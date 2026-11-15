-- Trợ giảng chỉ cần: điểm danh, sticker, ảnh, đặt lại mật khẩu phụ huynh (docs/YEU-CAU.md vòng 1–2).
-- Trước đây policy cho mọi nhân viên đọc hết tai_khoan, và đọc được đơn giá trả trợ giảng (tai_khoan.don_gia_buoi,
-- tro_giang_buoi.don_gia) qua API dù giao diện không hiện.

-- Tài khoản: trợ giảng chỉ thấy mình và phụ huynh (để đặt lại mật khẩu).
drop policy doc on tai_khoan;
create policy doc on tai_khoan for select using (
  id = auth.uid() or la_quan_ly() or (la_nhan_vien() and vai_tro = 'phu_huynh'));

-- Danh sách trợ giảng cho ô "Trợ giảng có mặt": chỉ tên, không đơn giá.
create function ds_tro_giang() returns table (id uuid, ho_ten text)
language sql stable security definer set search_path = public as $$
  select id, ho_ten from tai_khoan
  where vai_tro = 'tro_giang' and hoat_dong and la_nhan_vien()
  order by ho_ten
$$;

-- Điểm danh trợ giảng: nhân viên đọc/ghi được ai có mặt, nhưng không đọc được cột đơn giá.
-- Đơn giá vẫn được trigger trg_gia_tro_giang điền khi thêm dòng.
revoke all on tro_giang_buoi from authenticated;
grant select (buoi_id, tro_giang_id), insert (buoi_id, tro_giang_id), delete on tro_giang_buoi to authenticated;

-- Lương trợ giảng cho tab Học phí / Chi phí / Excel: chỉ giáo viên, admin.
create function luong_tro_giang(tu date, den date)
returns table (tro_giang_id uuid, ho_ten text, so_buoi bigint, thanh_tien bigint)
language plpgsql stable security definer set search_path = public as $$
begin
  if not la_quan_ly() then raise exception 'Chỉ giáo viên xem được lương trợ giảng'; end if;
  return query
    select t.tro_giang_id, k.ho_ten, count(*), sum(t.don_gia)::bigint
    from tro_giang_buoi t join buoi_hoc b on b.id = t.buoi_id join tai_khoan k on k.id = t.tro_giang_id
    where b.ngay >= tu and b.ngay < den
    group by t.tro_giang_id, k.ho_ten
    order by k.ho_ten;
end $$;

revoke execute on function ds_tro_giang(), luong_tro_giang(date, date) from public, anon;
grant execute on function ds_tro_giang(), luong_tro_giang(date, date) to authenticated, service_role;
