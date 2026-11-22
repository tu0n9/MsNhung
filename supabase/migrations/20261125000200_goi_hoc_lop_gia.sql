-- Chụp danh sách lớp, ngày vào học và đơn giá áp dụng tại thời điểm tạo gói vào goi_hoc.lop_gia
-- để tiền dư gói cũ không bị biến đổi khi sửa don_gia_rieng, xoá ghi_danh hoặc thêm lớp mới về sau.
alter table goi_hoc add column lop_gia jsonb;
