-- Khi học sinh tồn tại độc lập với lớp (có thể ở trạng thái "Chưa xếp lớp"),
-- xoá lớp chỉ xoá buổi học, điểm danh, ảnh buổi và ghi_danh của lớp đó;
-- giữ nguyên toàn bộ hồ sơ hoc_sinh, avatar, gói học, phiếu thu, sticker và chi phí.
create or replace function xoa_lop(p_lop uuid, p_ten text) returns text[] language plpgsql security definer set search_path = public as $$
declare hs_anh_huong uuid[]; bh uuid[]; anh text[];
begin
  if not la_quan_ly() then raise exception 'Không có quyền'; end if;
  if not exists (select 1 from lop where id = p_lop and ten = p_ten) then raise exception 'Tên lớp gõ lại không khớp'; end if;

  select coalesce(array_agg(distinct gd.hoc_sinh_id), '{}') into hs_anh_huong
  from ghi_danh gd
  where gd.lop_id = p_lop;

  select coalesce(array_agg(id), '{}') into bh from buoi_hoc where lop_id = p_lop;
  select coalesce(array_agg(duong_dan), '{}') into anh from anh_buoi where buoi_id = any(bh);

  delete from diem_danh where buoi_id = any(bh);
  delete from tro_giang_buoi where buoi_id = any(bh);
  delete from anh_buoi where buoi_id = any(bh);
  delete from ghi_danh where lop_id = p_lop;
  delete from buoi_hoc where id = any(bh);
  delete from lop where id = p_lop;

  -- Đồng bộ trạng thái các học sinh từng thuộc lớp vừa xoá:
  -- còn lớp đang học -> dang_hoc; không còn lớp nào (chuyển về Chưa xếp lớp) -> dang_hoc; chỉ còn lớp ngừng -> ngung.
  update hoc_sinh h set
    trang_thai = case
      when exists (select 1 from ghi_danh g where g.hoc_sinh_id = h.id and g.trang_thai = 'dang_hoc') then 'dang_hoc'
      when not exists (select 1 from ghi_danh g where g.hoc_sinh_id = h.id) then 'dang_hoc'
      else 'ngung'
    end
  where h.id = any(hs_anh_huong);

  return anh;
end $$;

revoke execute on function xoa_lop(uuid, text) from public, anon;
grant execute on function xoa_lop(uuid, text) to authenticated, service_role;
