-- Sửa các phát hiện của review pha R (docs/KE-HOACH.md, dòng R).

-- 1. Gói chồng tháng: chọn nhầm "Từ tháng" sẽ thu hai lần học phí cùng một tháng. Chặn ở database vì client không đáng tin.
create function trg_goi_khong_chong() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from goi_hoc g
    where g.hoc_sinh_id = new.hoc_sinh_id and g.id <> new.id
      and g.thang_bat_dau < (new.thang_bat_dau + make_interval(months => new.so_thang))
      and new.thang_bat_dau < (g.thang_bat_dau + make_interval(months => g.so_thang))
  ) then
    raise exception 'Học sinh đã có gói phủ một trong các tháng này';
  end if;
  return new;
end $$;
create trigger goi_khong_chong before insert or update on goi_hoc for each row execute function trg_goi_khong_chong();

-- 2. Chỉ giáo viên đánh "Lớp nghỉ" / thêm buổi phụ, bù (người dùng chốt 2026-11-15): buổi lớp nghỉ sinh tiền dư.
drop policy ghi on buoi_hoc;
create policy ghi on buoi_hoc for all using (la_quan_ly()) with check (la_quan_ly());
-- sinh buổi theo lịch vẫn phải chạy khi trợ giảng mở trang điểm danh, nên hàm này chạy quyền chủ
create or replace function sinh_buoi_thang(thang date) returns void language plpgsql security definer set search_path = public as $$
declare k date;
begin
  if not la_nhan_vien() then raise exception 'Không có quyền'; end if;
  select khoa_den into k from khoa_so;
  if k is not null and date_trunc('month', thang)::date <= k then return; end if;
  insert into buoi_hoc (lop_id, ngay, loai)
  select l.id, d::date, 'lich'
  from lop l
  cross join generate_series(date_trunc('month', thang), date_trunc('month', thang) + interval '1 month - 1 day', interval '1 day') d
  where l.hoat_dong and extract(dow from d)::smallint = any (l.lich)
  on conflict (lop_id, ngay) where loai = 'lich' do nothing;
end $$;

-- 3. Giáo viên chỉ sửa tài khoản trợ giảng / phụ huynh, khớp quyền của Edge Function tai-khoan; admin sửa mọi tài khoản trừ admin.
drop policy sua on tai_khoan;
create policy sua on tai_khoan for update using (
  vai_tro <> 'admin' and (vai_tro() = 'admin' or (la_quan_ly() and vai_tro in ('tro_giang', 'phu_huynh'))));

-- 4. Trợ giảng chỉ thêm và xem ảnh; sửa, xoá ảnh (kể cả avatar) chỉ giáo viên.
drop policy "anh: nhan vien" on storage.objects;
create policy "anh: nhan vien xem" on storage.objects for select to authenticated using (bucket_id = 'anh' and public.la_nhan_vien());
create policy "anh: nhan vien them" on storage.objects for insert to authenticated with check (bucket_id = 'anh' and public.la_nhan_vien());
create policy "anh: quan ly sua" on storage.objects for update to authenticated using (bucket_id = 'anh' and public.la_quan_ly());
create policy "anh: quan ly xoa" on storage.objects for delete to authenticated using (bucket_id = 'anh' and public.la_quan_ly());
drop policy ghi on anh_buoi;
create policy them on anh_buoi for insert with check (la_nhan_vien());
create policy xoa on anh_buoi for delete using (la_quan_ly());

-- 5. Không cho bỏ cờ "bắt đổi mật khẩu" khi mật khẩu vẫn là số điện thoại (mật khẩu mặc định sau tạo / đặt lại).
create or replace function da_doi_mat_khau() returns void language plpgsql security definer set search_path = public, extensions as $$
begin
  if exists (
    select 1 from auth.users u join tai_khoan t on t.id = u.id
    where u.id = auth.uid() and t.so_dien_thoai is not null
      and u.encrypted_password = crypt(t.so_dien_thoai, u.encrypted_password)
  ) then
    raise exception 'Mật khẩu mới không được trùng số điện thoại';
  end if;
  update tai_khoan set phai_doi_mat_khau = false where id = auth.uid();
end $$;
