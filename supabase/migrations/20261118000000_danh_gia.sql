-- Phiếu đánh giá từ học sinh (người dùng chốt 2026-11-18, docs/YEU-CAU.md mục "Đánh giá từ học sinh").
-- Học sinh không đăng nhập: mở link có mã của tháng, chọn lớp + tên, mỗi em mỗi tháng một phiếu.

-- Mỗi tháng một mã. Đổi link = ghi mã mới: link cũ hết hiệu lực, phiếu đã gửi giữ nguyên (phiếu gắn tháng, không gắn mã).
create table link_danh_gia (
  thang date primary key check (extract(day from thang) = 1),
  ma text not null unique check (length(ma) >= 10),
  tao_luc timestamptz not null default now()
);

-- Lưu kèm tên lớp / học sinh / trợ giảng để xoá lớp hay xoá tài khoản thì phiếu cũ vẫn đọc được (khoá ngoại set null,
-- xoa_lop() không bị chặn). Điểm trợ giảng để jsonb trong phiếu vì kết quả tính trên máy, không truy vấn theo cột.
create table danh_gia (
  id uuid primary key default gen_random_uuid(),
  thang date not null,
  lop_id uuid references lop on delete set null,
  ten_lop text not null,
  hoc_sinh_id uuid references hoc_sinh on delete set null,
  ten_hoc_sinh text not null,
  khoa_hoc text,
  kho_khan text,
  -- [{id, ten, kien_thuc, tuong_tac, ho_tro, nhan_xet, chua_bai}], rỗng = không có trợ giảng
  tro_giang jsonb not null default '[]',
  gui_luc timestamptz not null default now(),
  unique (thang, hoc_sinh_id)
);
create index on danh_gia (thang);

-- Không gắn trigger khoá sổ: phiếu tháng 11 nhận tới 5/12, kể cả khi tháng 11 đã chốt.

-- Tháng của mã nếu link còn nhận phiếu (tới hết ngày 5 tháng sau, giờ VN), không thì báo lỗi.
create function thang_cua_ma(p_ma text) returns date language plpgsql stable security definer set search_path = public as $$
declare t date;
begin
  select thang into t from link_danh_gia where ma = p_ma;
  if t is null or (now() at time zone 'Asia/Ho_Chi_Minh')::date >= (t + interval '1 month 5 days')::date then
    raise exception 'Link không còn hiệu lực';
  end if;
  return t;
end $$;

create function phieu_danh_gia(p_ma text) returns jsonb language plpgsql stable security definer set search_path = public as $$
declare t date := thang_cua_ma(p_ma);
begin
  return jsonb_build_object(
    'thang', to_char(t, 'YYYY-MM'),
    'han', (t + interval '1 month 4 days')::date,
    'lops', coalesce((select jsonb_agg(jsonb_build_object('id', id, 'ten', ten) order by ten) from lop where hoat_dong), '[]'),
    'hoc_sinhs', coalesce((select jsonb_agg(jsonb_build_object('id', h.id, 'ho_ten', h.ho_ten, 'lop_id', h.lop_id,
        'da_gui', exists (select 1 from danh_gia d where d.thang = t and d.hoc_sinh_id = h.id)) order by h.ho_ten)
      from hoc_sinh h join lop l on l.id = h.lop_id where l.hoat_dong and h.trang_thai = 'dang_hoc'), '[]'),
    'tro_giangs', coalesce((select jsonb_agg(jsonb_build_object('id', id, 'ho_ten', ho_ten) order by ho_ten)
      from tai_khoan where vai_tro = 'tro_giang' and hoat_dong), '[]'));
end $$;

create function gui_danh_gia(p_ma text, p_lop uuid, p_hoc_sinh uuid, p_khoa_hoc text, p_kho_khan text, p_tro_giang jsonb)
returns void language plpgsql security definer set search_path = public as $$
declare
  t date := thang_cua_ma(p_ma);
  tl text; th text; x jsonb; tg jsonb := '[]'; ten text; diem int;
begin
  select l.ten, h.ho_ten into tl, th from hoc_sinh h join lop l on l.id = h.lop_id
  where h.id = p_hoc_sinh and l.id = p_lop and l.hoat_dong and h.trang_thai = 'dang_hoc';
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

alter table link_danh_gia enable row level security;
alter table danh_gia enable row level security;
create policy ql on link_danh_gia for all using (la_quan_ly()) with check (la_quan_ly());
-- không có policy insert: phiếu chỉ vào qua gui_danh_gia()
create policy doc on danh_gia for select using (la_quan_ly());
create policy xoa on danh_gia for delete using (la_quan_ly());

grant select, insert, update on link_danh_gia to authenticated;
grant select, delete on danh_gia to authenticated;
grant all on link_danh_gia, danh_gia to service_role;

-- hàm mới mặc định ai cũng gọi được (PUBLIC), nên thu lại rồi cấp đúng chỗ
revoke execute on function thang_cua_ma(text), phieu_danh_gia(text), gui_danh_gia(text, uuid, uuid, text, text, jsonb) from public;
grant execute on function phieu_danh_gia(text), gui_danh_gia(text, uuid, uuid, text, text, jsonb) to anon, authenticated, service_role;
grant execute on function thang_cua_ma(text) to service_role;
