-- Tổng dung lượng bucket 'anh' để giáo viên thấy ở tab Học phí còn bao nhiêu so với 1 GB của gói Free.
-- Client không đọc được storage.objects nên cần hàm quyền chủ; chỉ giáo viên/admin gọi được.
-- Ảnh lớp cũ được workflow .github/workflows/don-anh.yml cất lên GitHub Release và xoá khỏi Storage hằng tháng.
create function dung_luong_anh() returns bigint language plpgsql stable security definer set search_path = public as $$
begin
  if not la_quan_ly() then raise exception 'Không có quyền'; end if;
  return (select coalesce(sum((metadata->>'size')::bigint), 0) from storage.objects where bucket_id = 'anh');
end $$;
revoke execute on function dung_luong_anh() from public, anon;
grant execute on function dung_luong_anh() to authenticated, service_role;
