-- View tong_sticker cộng điểm danh theo từng học sinh; khoá chính (buoi_id, hoc_sinh_id) không dùng được khi lọc theo
-- hoc_sinh_id, nên không có chỉ mục này thì mỗi lần mở trang Lớp quét cả bảng điểm danh cho từng em.
create index if not exists diem_danh_hoc_sinh_id_idx on diem_danh (hoc_sinh_id);
