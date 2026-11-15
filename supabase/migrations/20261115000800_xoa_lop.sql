-- Xoá hẳn một lớp cùng mọi dữ liệu của nó (người dùng chốt 2026-11-15: lớp có dữ liệu vẫn xoá được, xoá nhầm là lỗi
-- người dùng). Gồm học sinh của lớp và mọi thứ của các em (điểm danh ở mọi lớp, gói học, phiếu thu), buổi học của lớp
-- và mọi thứ gắn với buổi (điểm danh của em lớp khác sang học bù, trợ giảng, ảnh). Khoản chi "Hoàn học phí" giữ lại,
-- chỉ bỏ liên kết học sinh (tiền đã chi thật). Tài khoản phụ huynh giữ lại (có thể còn con khác).
-- Một hàm = một giao dịch: trigger khoá sổ chặn bất kỳ dòng nào thuộc tháng đã chốt thì không xoá gì cả; muốn xoá thì
-- mở khoá tháng đó trước. Trả về đường dẫn ảnh (ảnh lớp + avatar) để client xoá file trong Storage.
create function xoa_lop(p_lop uuid, p_ten text) returns text[] language plpgsql security definer set search_path = public as $$
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
  delete from hoc_sinh where id = any(hs);
  delete from buoi_hoc where id = any(bh);
  delete from lop where id = p_lop;
  return anh;
end $$;
revoke execute on function xoa_lop(uuid, text) from public, anon;
grant execute on function xoa_lop(uuid, text) to authenticated, service_role;
