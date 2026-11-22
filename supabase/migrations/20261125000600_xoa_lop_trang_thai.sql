-- Đồng bộ hoc_sinh.trang_thai cho các học sinh được giữ lại khi xoá lớp (10d):
-- nếu chỉ còn ghi_danh 'ngung' ở các lớp khác thì chuyển hoc_sinh.trang_thai thành 'ngung',
-- nếu vẫn còn ít nhất một ghi_danh 'dang_hoc' thì giữ 'dang_hoc'.
create or replace function xoa_lop(p_lop uuid, p_ten text) returns text[] language plpgsql security definer set search_path = public as $$
declare hs_xoa uuid[]; hs_giu uuid[]; bh uuid[]; anh text[];
begin
  if not la_quan_ly() then raise exception 'Không có quyền'; end if;
  if not exists (select 1 from lop where id = p_lop and ten = p_ten) then raise exception 'Tên lớp gõ lại không khớp'; end if;
  select coalesce(array_agg(gd.hoc_sinh_id), '{}') into hs_xoa
  from ghi_danh gd
  where gd.lop_id = p_lop
    and not exists (select 1 from ghi_danh g2 where g2.hoc_sinh_id = gd.hoc_sinh_id and g2.lop_id <> p_lop);
  select coalesce(array_agg(distinct gd.hoc_sinh_id), '{}') into hs_giu
  from ghi_danh gd
  where gd.lop_id = p_lop
    and exists (select 1 from ghi_danh g2 where g2.hoc_sinh_id = gd.hoc_sinh_id and g2.lop_id <> p_lop);
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
  -- Đồng bộ trạng thái các em được giữ lại dựa trên những ghi_danh còn lại sau khi đã xoá lớp p_lop
  update hoc_sinh h set
    trang_thai = case
      when exists (select 1 from ghi_danh g where g.hoc_sinh_id = h.id and g.trang_thai = 'dang_hoc') then 'dang_hoc'
      else 'ngung'
    end
  where h.id = any(hs_giu);
  delete from hoc_sinh where id = any(hs_xoa);
  delete from buoi_hoc where id = any(bh);
  delete from lop where id = p_lop;
  return anh;
end $$;

revoke execute on function xoa_lop(uuid, text) from public, anon;
grant execute on function xoa_lop(uuid, text) to authenticated, service_role;
