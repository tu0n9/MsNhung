-- Cộng / trừ sticker ngoài buổi học (người dùng chốt 2026-11-20, docs/YEU-CAU.md mục "Sticker ngoài buổi").
-- Mỗi lần là một dòng; tổng sticker = sticker_dau_ky + sticker các buổi + các lần cộng/trừ (view tong_sticker).

create table sticker_cong_tru (
  id uuid primary key default gen_random_uuid(),
  hoc_sinh_id uuid not null references hoc_sinh,
  so integer not null check (so <> 0),
  ly_do text,
  -- giờ VN: server chạy UTC, 0h–7h sáng ở VN vẫn là hôm qua theo current_date
  ngay date not null default (now() at time zone 'Asia/Ho_Chi_Minh')::date,
  nguoi uuid references tai_khoan on delete set null,
  -- chụp tên lúc ghi: trợ giảng không đọc được tài khoản giáo viên qua RLS nên không join được về sau
  ten_nguoi text,
  tao_luc timestamptz not null default now(),
  check (so > 0 or coalesce(trim(ly_do), '') <> '')  -- trừ thì bắt buộc lý do
);
create index on sticker_cong_tru (hoc_sinh_id);

-- Người ghi lấy từ phiên đăng nhập, client gửi gì cũng bị ghi đè.
create function trg_nguoi_ghi_sticker() returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.nguoi := auth.uid();
  new.ten_nguoi := (select ho_ten from tai_khoan where id = auth.uid());
  return new;
end $$;
create trigger nguoi_ghi before insert on sticker_cong_tru for each row execute function trg_nguoi_ghi_sticker();

alter table sticker_cong_tru enable row level security;
create policy doc on sticker_cong_tru for select using (
  la_nhan_vien() or hoc_sinh_id in (select id from hoc_sinh where phu_huynh_id = auth.uid()));
-- chỉ ghi cho hôm nay; không có update: ghi nhầm thì xoá rồi ghi lại
create policy them on sticker_cong_tru for insert with check (
  la_nhan_vien() and ngay = (now() at time zone 'Asia/Ho_Chi_Minh')::date);
create policy xoa on sticker_cong_tru for delete using (la_nhan_vien());
grant select, insert, delete on sticker_cong_tru to authenticated;
grant all on sticker_cong_tru to service_role;

-- Khoá sổ: thêm nhánh cho bảng mới, giữ nguyên các nhánh cũ.
create or replace function ngay_cua(bang text, r jsonb) returns date language sql stable security definer set search_path = public as $$
  select case bang
    when 'buoi_hoc' then (r->>'ngay')::date
    when 'chi_phi' then (r->>'ngay')::date
    when 'phieu_thu' then (r->>'ngay_thu')::date
    when 'goi_hoc' then (r->>'thang_bat_dau')::date
    when 'sticker_cong_tru' then (r->>'ngay')::date
    else (select ngay from buoi_hoc where id = (r->>'buoi_id')::uuid)
  end
$$;
create trigger khoa_so before insert or update or delete on sticker_cong_tru for each row execute function trg_khoa_so();

-- security_invoker: RLS của người xem lọc từng bảng, phụ huynh chỉ ra tổng của con mình.
create view tong_sticker with (security_invoker = true) as
  select h.id as hoc_sinh_id,
    h.sticker_dau_ky
      + coalesce((select sum(d.sticker) from diem_danh d where d.hoc_sinh_id = h.id), 0)
      + coalesce((select sum(s.so) from sticker_cong_tru s where s.hoc_sinh_id = h.id), 0) as tong
  from hoc_sinh h;
grant select on tong_sticker to authenticated, service_role;

-- Xoá lớp: xoá cả cộng/trừ sticker của học sinh lớp đó (giữ nguyên phần còn lại của 20261115000800_xoa_lop.sql).
create or replace function xoa_lop(p_lop uuid, p_ten text) returns text[] language plpgsql security definer set search_path = public as $$
declare hs uuid[]; bh uuid[]; anh text[];
begin
  if not la_quan_ly() then raise exception 'Không có quyền'; end if;
  if not exists (select 1 from lop where id = p_lop and ten = p_ten) then raise exception 'Tên lớp gõ lại không khớp'; end if;
  select coalesce(array_agg(id), '{}') into hs from hoc_sinh where lop_id = p_lop;
  select coalesce(array_agg(id), '{}') into bh from buoi_hoc where lop_id = p_lop;
  select coalesce(array_agg(d), '{}') into anh from (
    select duong_dan d from anh_buoi where buoi_id = any(bh)
    union all select avatar from hoc_sinh where id = any(hs) and avatar is not null) x;
  update chi_phi set hoc_sinh_id = null where hoc_sinh_id = any(hs);
  delete from phieu_thu where goi_id in (select id from goi_hoc where hoc_sinh_id = any(hs));
  delete from goi_hoc where hoc_sinh_id = any(hs);
  delete from diem_danh where hoc_sinh_id = any(hs) or buoi_id = any(bh);
  delete from tro_giang_buoi where buoi_id = any(bh);
  delete from anh_buoi where buoi_id = any(bh);
  delete from sticker_cong_tru where hoc_sinh_id = any(hs);
  delete from hoc_sinh where id = any(hs);
  delete from buoi_hoc where id = any(bh);
  delete from lop where id = p_lop;
  return anh;
end $$;

revoke execute on function trg_nguoi_ghi_sticker() from public, anon, authenticated;
