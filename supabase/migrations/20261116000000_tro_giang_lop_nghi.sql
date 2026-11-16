-- Trợ giảng đánh "Lớp nghỉ" và thêm buổi phụ / bù như giáo viên (người dùng chốt 2026-11-16, thay quyết định
-- "chỉ giáo viên" của sua_sau_review). Tháng đã chốt vẫn do trigger khoa_so chặn. Xoá buổi vẫn chỉ quản lý: app không có
-- nút xoá buổi, xoá lớp đi qua hàm xoa_lop.
drop policy ghi on buoi_hoc;
create policy them on buoi_hoc for insert with check (la_nhan_vien());
create policy sua on buoi_hoc for update using (la_nhan_vien()) with check (la_nhan_vien());
create policy xoa on buoi_hoc for delete using (la_quan_ly());
