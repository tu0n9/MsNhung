-- Hỗ trợ 1 học sinh học nhiều lớp qua bảng trung gian ghi_danh, đơn giá cố định theo học sinh,
-- mã học sinh HSxxx, công cụ gộp hồ sơ trùng, và tắt tài khoản/cổng đăng nhập phụ huynh.
-- Spec: SPEC-hoc-sinh-nhieu-lop.md

-- ============ 1. Mã học sinh (HS001...) & đơn giá cố định trên hoc_sinh ============
create sequence hoc_sinh_ma_seq;

alter table hoc_sinh
  add column ma_hs text unique,
  add column don_gia integer check (don_gia >= 0);

-- Tạm tắt trigger nhật ký khi backfill hàng loạt để không sinh 128 dòng giả.
alter table hoc_sinh disable trigger nhat_ky;

with stt as (
  select id, 'HS' || lpad(nextval('hoc_sinh_ma_seq')::text, 3, '0') as ma
  from (select id from hoc_sinh order by tao_luc, id) x
)
update hoc_sinh h set ma_hs = stt.ma from stt where h.id = stt.id;

update hoc_sinh h set don_gia = coalesce(h.don_gia_rieng, l.don_gia)
from lop l where l.id = h.lop_id;

alter table hoc_sinh enable trigger nhat_ky;

alter table hoc_sinh
  alter column ma_hs set default ('HS' || lpad(nextval('hoc_sinh_ma_seq')::text, 3, '0')),
  alter column ma_hs set not null,
  alter column don_gia set not null;

-- ============ 2. Bảng trung gian ghi_danh (học sinh - lớp) ============
create table ghi_danh (
  id uuid primary key default gen_random_uuid(),
  hoc_sinh_id uuid not null references hoc_sinh,
  lop_id uuid not null references lop,
  ngay_vao date not null default current_date,
  trang_thai text not null default 'dang_hoc' check (trang_thai in ('dang_hoc', 'ngung')),
  tao_luc timestamptz not null default now(),
  unique (hoc_sinh_id, lop_id)
);
create index ghi_danh_hoc_sinh_id_idx on ghi_danh (hoc_sinh_id);
create index ghi_danh_lop_id_idx on ghi_danh (lop_id);

insert into ghi_danh (hoc_sinh_id, lop_id, ngay_vao, trang_thai, tao_luc)
select id, lop_id, ngay_vao, trang_thai, tao_luc from hoc_sinh;

alter table ghi_danh enable row level security;
create policy doc on ghi_danh for select using (la_nhan_vien());
create policy ghi on ghi_danh for all using (la_quan_ly()) with check (la_quan_ly());

grant select, insert, update, delete on ghi_danh to authenticated;
grant all on ghi_danh to service_role;
grant usage, select on sequence hoc_sinh_ma_seq to authenticated, service_role;

-- ============ 3. Nhật ký thao tác cho bảng ghi_danh ============
create or replace function trg_nhat_ky() returns trigger language plpgsql security definer set search_path = public as $$
declare
  cu jsonb := case when tg_op <> 'INSERT' then to_jsonb(old) end;
  moi jsonb := case when tg_op <> 'DELETE' then to_jsonb(new) end;
  r jsonb := coalesce(moi, cu);
  doi jsonb := r;
  hd text := case tg_op when 'INSERT' then 'them' when 'UPDATE' then 'sua' else 'xoa' end;
begin
  if tg_table_name = 'buoi_hoc' and tg_op = 'INSERT' and r->>'loai' = 'lich' then return null; end if;
  if tg_op = 'UPDATE' then
    select jsonb_object_agg(k, jsonb_build_array(cu->k, moi->k)) into doi
    from jsonb_object_keys(moi) k where cu->k is distinct from moi->k;
    if doi is null then return null; end if;
  end if;
  if tg_table_name = 'nhat_ky_chot_so' then
    hd := r->>'hanh_dong';
    doi := jsonb_build_object('ly_do', r->'ly_do');
  end if;
  insert into nhat_ky (nguoi, ten_nguoi, bang, hanh_dong, doi_tuong, thay_doi)
  values (auth.uid(), (select ho_ten from tai_khoan where id = auth.uid()), tg_table_name, hd,
    case tg_table_name
      when 'hoc_sinh' then r->>'ho_ten'
      when 'lop' then r->>'ten'
      when 'tai_khoan' then r->>'ho_ten'
      when 'chi_phi' then r->>'danh_muc'
      when 'ghi_danh' then concat_ws(' · ',
        (select ho_ten from hoc_sinh where id = (r->>'hoc_sinh_id')::uuid),
        (select ten from lop where id = (r->>'lop_id')::uuid))
      when 'sticker_cong_tru' then (select ho_ten from hoc_sinh where id = (r->>'hoc_sinh_id')::uuid)
      when 'goi_hoc' then (select ho_ten from hoc_sinh where id = (r->>'hoc_sinh_id')::uuid)
      when 'phieu_thu' then (select h.ho_ten from goi_hoc g join hoc_sinh h on h.id = g.hoc_sinh_id where g.id = (r->>'goi_id')::uuid)
      when 'buoi_hoc' then (select ten from lop where id = (r->>'lop_id')::uuid) || ' · ' || to_char((r->>'ngay')::date, 'DD/MM/YYYY')
      when 'tro_giang_buoi' then (select concat_ws(' · ', k.ho_ten, l.ten, to_char(b.ngay, 'DD/MM/YYYY'))
        from buoi_hoc b join lop l on l.id = b.lop_id left join tai_khoan k on k.id = (r->>'tro_giang_id')::uuid
        where b.id = (r->>'buoi_id')::uuid)
      when 'nhat_ky_chot_so' then 'Tháng ' || to_char((r->>'thang')::date, 'MM/YYYY')
    end,
    doi);
  return null;
end $$;

create trigger nhat_ky after insert or update or delete on ghi_danh for each row execute function trg_nhat_ky();
revoke execute on function trg_nhat_ky() from public, anon, authenticated;

-- ============ 4. Tắt tài khoản phụ huynh & gọn lại RLS (trước khi bỏ hoc_sinh.lop_id) ============
alter table tai_khoan disable trigger nhat_ky;
update tai_khoan set hoat_dong = false where vai_tro = 'phu_huynh';
alter table tai_khoan enable trigger nhat_ky;

drop policy doc on lop;
create policy doc on lop for select using (la_nhan_vien());

drop policy doc on hoc_sinh;
create policy doc on hoc_sinh for select using (la_nhan_vien());

drop policy doc on buoi_hoc;
create policy doc on buoi_hoc for select using (la_nhan_vien());

drop policy doc on diem_danh;
create policy doc on diem_danh for select using (la_nhan_vien());

drop policy doc on anh_buoi;
create policy doc on anh_buoi for select using (la_nhan_vien());

drop policy doc on sticker_cong_tru;
create policy doc on sticker_cong_tru for select using (la_nhan_vien());

drop policy doc on goi_hoc;
create policy doc on goi_hoc for select using (la_quan_ly());

drop policy doc on phieu_thu;
create policy doc on phieu_thu for select using (la_quan_ly());

drop policy doc on tai_khoan;
create policy doc on tai_khoan for select using (id = auth.uid() or la_quan_ly());

drop policy sua on tai_khoan;
create policy sua on tai_khoan for update using (
  vai_tro in ('giao_vien', 'tro_giang')
  and (vai_tro() = 'admin' or (la_quan_ly() and vai_tro = 'tro_giang')));

drop policy if exists "anh: phu huynh xem" on storage.objects;

-- ============ 5. Bỏ hoc_sinh.lop_id (giữ nguyên dữ liệu lịch sử phụ huynh & đơn giá riêng) ============
alter table hoc_sinh drop column lop_id;

-- ============ 6. Cập nhật RPC đánh giá, xoá lớp & thêm gộp học sinh ============
create or replace function phieu_danh_gia(p_ma text) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare t date := thang_cua_ma(p_ma);
begin
  return jsonb_build_object(
    'thang', to_char(t, 'YYYY-MM'),
    'han', (t + interval '1 month 4 days')::date,
    'lops', coalesce((select jsonb_agg(jsonb_build_object('id', id, 'ten', ten) order by ten) from lop where hoat_dong), '[]'),
    'hoc_sinhs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', h.id, 'ho_ten', h.ho_ten, 'ma_hs', h.ma_hs, 'lop_id', gd.lop_id,
        'da_gui', exists (select 1 from danh_gia d where d.thang = t and d.hoc_sinh_id = h.id)
      ) order by h.ho_ten, h.ma_hs)
      from ghi_danh gd
      join hoc_sinh h on h.id = gd.hoc_sinh_id
      join lop l on l.id = gd.lop_id
      where l.hoat_dong and gd.trang_thai = 'dang_hoc'
    ), '[]'),
    'tro_giangs', coalesce((select jsonb_agg(jsonb_build_object('id', id, 'ho_ten', ho_ten) order by ho_ten)
      from tai_khoan where vai_tro = 'tro_giang' and hoat_dong), '[]'));
end $$;

create or replace function gui_danh_gia(p_ma text, p_lop uuid, p_hoc_sinh uuid, p_khoa_hoc text, p_kho_khan text, p_tro_giang jsonb)
returns void language plpgsql security definer set search_path = public as $$
declare
  t date := thang_cua_ma(p_ma);
  tl text; th text; x jsonb; tg jsonb := '[]'; ten text; diem int;
begin
  select l.ten, h.ho_ten into tl, th
  from ghi_danh gd join hoc_sinh h on h.id = gd.hoc_sinh_id join lop l on l.id = gd.lop_id
  where gd.hoc_sinh_id = p_hoc_sinh and gd.lop_id = p_lop and l.hoat_dong and gd.trang_thai = 'dang_hoc';
  if th is null then raise exception 'Học sinh không thuộc lớp này'; end if;
  if length(p_khoa_hoc) > 1000 or length(p_kho_khan) > 1000 then raise exception 'Nhận xét quá dài'; end if;
  if jsonb_typeof(p_tro_giang) <> 'array' or jsonb_array_length(p_tro_giang) > 20 then raise exception 'Dữ liệu trợ giảng sai'; end if;
  if (select count(distinct e->>'id') from jsonb_array_elements(p_tro_giang) e) <> jsonb_array_length(p_tro_giang) then
    raise exception 'Trợ giảng bị chọn trùng';
  end if;
  for x in select * from jsonb_array_elements(p_tro_giang) loop
    select ho_ten into ten from tai_khoan where id::text = x->>'id' and vai_tro = 'tro_giang' and hoat_dong;
    if ten is null then raise exception 'Trợ giảng không tồn tại'; end if;
    foreach diem in array array[(x->>'kien_thuc')::int, (x->>'tuong_tac')::int, (x->>'ho_tro')::int] loop
      if diem is null or diem not between 1 and 5 then raise exception 'Điểm phải từ 1 đến 5'; end if;
    end loop;
    if length(x->>'nhan_xet') > 1000 or length(x->>'chua_bai') > 1000 then raise exception 'Nhận xét quá dài'; end if;
    tg := tg || jsonb_build_object('id', x->>'id', 'ten', ten,
      'kien_thuc', (x->>'kien_thuc')::int, 'tuong_tac', (x->>'tuong_tac')::int, 'ho_tro', (x->>'ho_tro')::int,
      'nhan_xet', nullif(trim(x->>'nhan_xet'), ''), 'chua_bai', nullif(trim(x->>'chua_bai'), ''));
  end loop;
  insert into danh_gia (thang, lop_id, ten_lop, hoc_sinh_id, ten_hoc_sinh, khoa_hoc, kho_khan, tro_giang)
  values (t, p_lop, tl, p_hoc_sinh, th, nullif(trim(p_khoa_hoc), ''), nullif(trim(p_kho_khan), ''), tg);
exception when unique_violation then
  raise exception 'Em đã gửi phiếu tháng này rồi';
end $$;

-- Xoá lớp: chỉ xoá ghi_danh của lớp đó; học sinh còn học lớp khác được giữ nguyên toàn bộ hồ sơ & gói học.
create or replace function xoa_lop(p_lop uuid, p_ten text) returns text[] language plpgsql security definer set search_path = public as $$
declare hs_xoa uuid[]; bh uuid[]; anh text[];
begin
  if not la_quan_ly() then raise exception 'Không có quyền'; end if;
  if not exists (select 1 from lop where id = p_lop and ten = p_ten) then raise exception 'Tên lớp gõ lại không khớp'; end if;
  select coalesce(array_agg(gd.hoc_sinh_id), '{}') into hs_xoa
  from ghi_danh gd
  where gd.lop_id = p_lop
    and not exists (select 1 from ghi_danh g2 where g2.hoc_sinh_id = gd.hoc_sinh_id and g2.lop_id <> p_lop);
  select coalesce(array_agg(id), '{}') into bh from buoi_hoc where lop_id = p_lop;
  select coalesce(array_agg(d), '{}') into anh from (
    select duong_dan d from anh_buoi where buoi_id = any(bh)
    union all select avatar from hoc_sinh where id = any(hs_xoa) and avatar is not null) x;
  update chi_phi set hoc_sinh_id = null where hoc_sinh_id = any(hs_xoa);
  delete from phieu_thu where goi_id in (select id from goi_hoc where hoc_sinh_id = any(hs_xoa));
  delete from goi_hoc where hoc_sinh_id = any(hs_xoa);
  delete from diem_danh where hoc_sinh_id = any(hs_xoa) or buoi_id = any(bh);
  delete from tro_giang_buoi where buoi_id = any(bh);
  delete from anh_buoi where buoi_id = any(bh);
  delete from sticker_cong_tru where hoc_sinh_id = any(hs_xoa);
  delete from ghi_danh where lop_id = p_lop;
  delete from hoc_sinh where id = any(hs_xoa);
  delete from buoi_hoc where id = any(bh);
  delete from lop where id = p_lop;
  return anh;
end $$;

-- Gộp 2 hồ sơ học sinh trùng thành 1 trong 1 transaction; trả về avatar thừa của p_bo (nếu cả 2 đều có ảnh) để client xoá Storage.
create function gop_hoc_sinh(p_giu uuid, p_bo uuid) returns text language plpgsql security definer set search_path = public as $$
declare
  giu hoc_sinh%rowtype;
  bo hoc_sinh%rowtype;
  anh_thua text;
begin
  if not la_quan_ly() then raise exception 'Không có quyền'; end if;
  if p_giu is null or p_bo is null or p_giu = p_bo then raise exception 'Chọn hai học sinh khác nhau để gộp'; end if;
  select * into giu from hoc_sinh where id = p_giu for update;
  select * into bo from hoc_sinh where id = p_bo for update;
  if giu.id is null or bo.id is null then raise exception 'Không tìm thấy học sinh'; end if;

  if exists (
    select 1 from goi_hoc g1 join goi_hoc g2 on g1.hoc_sinh_id = p_giu and g2.hoc_sinh_id = p_bo
    where g1.thang_bat_dau < (g2.thang_bat_dau + make_interval(months => g2.so_thang))
      and g2.thang_bat_dau < (g1.thang_bat_dau + make_interval(months => g1.so_thang))
  ) then
    raise exception 'Hai học sinh đều có gói học phủ chung tháng. Hãy kiểm tra hoặc xoá gói trùng trước khi gộp';
  end if;

  -- Gộp ghi danh: lớp trùng giữ ngày vào sớm hơn và ưu tiên đang học
  update ghi_danh g1 set
    ngay_vao = least(g1.ngay_vao, g2.ngay_vao),
    trang_thai = case when g1.trang_thai = 'dang_hoc' or g2.trang_thai = 'dang_hoc' then 'dang_hoc' else 'ngung' end
  from ghi_danh g2
  where g1.hoc_sinh_id = p_giu and g2.hoc_sinh_id = p_bo and g1.lop_id = g2.lop_id;

  delete from ghi_danh g2
  where g2.hoc_sinh_id = p_bo
    and exists (select 1 from ghi_danh g1 where g1.hoc_sinh_id = p_giu and g1.lop_id = g2.lop_id);

  update ghi_danh set hoc_sinh_id = p_giu where hoc_sinh_id = p_bo;

  -- Gộp điểm danh: buổi trùng cộng sticker và ưu tiên có mặt / học bù
  update diem_danh d1 set
    trang_thai = case
      when d1.trang_thai = 'co_mat' or d2.trang_thai = 'co_mat' then 'co_mat'
      when d1.trang_thai = 'hoc_bu' or d2.trang_thai = 'hoc_bu' then 'hoc_bu'
      else 'vang'
    end,
    sticker = d1.sticker + d2.sticker
  from diem_danh d2
  where d1.hoc_sinh_id = p_giu and d2.hoc_sinh_id = p_bo and d1.buoi_id = d2.buoi_id;

  delete from diem_danh d2
  where d2.hoc_sinh_id = p_bo
    and exists (select 1 from diem_danh d1 where d1.hoc_sinh_id = p_giu and d1.buoi_id = d2.buoi_id);

  update diem_danh set hoc_sinh_id = p_giu where hoc_sinh_id = p_bo;

  update sticker_cong_tru set hoc_sinh_id = p_giu where hoc_sinh_id = p_bo;
  update goi_hoc set hoc_sinh_id = p_giu where hoc_sinh_id = p_bo;
  update chi_phi set hoc_sinh_id = p_giu where hoc_sinh_id = p_bo;

  -- Phiếu đánh giá cùng tháng giữ liên kết của hồ sơ chính, phiếu còn lại bỏ liên kết học sinh để giữ lịch sử
  update danh_gia d2 set hoc_sinh_id = null
  where d2.hoc_sinh_id = p_bo
    and exists (select 1 from danh_gia d1 where d1.hoc_sinh_id = p_giu and d1.thang = d2.thang);

  update danh_gia set hoc_sinh_id = p_giu where hoc_sinh_id = p_bo;

  anh_thua := case when giu.avatar is not null and bo.avatar is not null and giu.avatar <> bo.avatar then bo.avatar else null end;

  update hoc_sinh set
    sticker_dau_ky = giu.sticker_dau_ky + bo.sticker_dau_ky,
    avatar = coalesce(giu.avatar, bo.avatar),
    ten_phu_huynh = coalesce(nullif(trim(giu.ten_phu_huynh), ''), bo.ten_phu_huynh),
    sdt_phu_huynh = coalesce(nullif(trim(giu.sdt_phu_huynh), ''), bo.sdt_phu_huynh),
    link_zalo = coalesce(giu.link_zalo, bo.link_zalo),
    ghi_chu = case
      when coalesce(trim(giu.ghi_chu), '') = '' then bo.ghi_chu
      when coalesce(trim(bo.ghi_chu), '') = '' or trim(bo.ghi_chu) = trim(giu.ghi_chu) then giu.ghi_chu
      else giu.ghi_chu || E'\n' || bo.ghi_chu
    end,
    ngay_vao = least(giu.ngay_vao, bo.ngay_vao),
    trang_thai = case when giu.trang_thai = 'dang_hoc' or bo.trang_thai = 'dang_hoc' then 'dang_hoc' else 'ngung' end
  where id = p_giu;

  delete from hoc_sinh where id = p_bo;
  return anh_thua;
end $$;

revoke execute on function gop_hoc_sinh(uuid, uuid) from public, anon;
grant execute on function gop_hoc_sinh(uuid, uuid) to authenticated, service_role;
