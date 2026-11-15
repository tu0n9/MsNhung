# Yêu cầu — Anh ngữ Ms.Nhung

## Yêu cầu gốc (người dùng đưa, 2026-11-15)

- Điểm danh được học sinh có trong lớp.
- Điền và hiện số sticker đã tích lũy từ lúc bắt đầu học đến hiện tại.
- Thêm, bớt, xoá học sinh bất kỳ (phòng khi học sinh nghỉ học).
- Chỉnh sửa tùy ý bất cứ lúc nào khi học sinh nghỉ học hoặc học bù.
- Học sinh ký xác nhận vào ngày đi học và ký vào số phiếu mình đạt trong ngày.
- Chụp ảnh lớp hôm học làm minh chứng điểm danh (nhiều ảnh).
- Cuối tháng, bấm vào một học sinh thì thấy: đi học những buổi nào trong tháng, tổng số buổi, học phí phải nộp.
- Ảnh đại diện từng học sinh (như avatar Facebook) để dễ nhận diện khi điểm danh.
- Xuất bảng học phí cả lớp ra Excel, và các tính năng kế toán cần cho sổ sách học phí cuối tháng.
- Tab "Học phí" (sổ thu chi của trung tâm):
  - Chọn tháng, xem ngay: phải thu, nợ kỳ trước, đã thu, còn phải thu, thực thu trong tháng, tổng chi, chênh lệch thu chi.
  - Danh sách học sinh theo lớp, lọc Tất cả / Còn nợ / Đã đủ. Chạm một em để xem chi tiết.
- Thu tiền từng đợt:
  - Mỗi lần thu ghi số tiền, ngày thu, hình thức (tiền mặt / chuyển khoản), ghi chú. Phụ huynh đóng nhiều đợt vẫn tính đúng.
  - Khi thu chọn được thu cho tháng nào, để nộp bù nợ cũ vẫn ghi đúng.
- Tin nhắn gửi phụ huynh ghi rõ học phí tháng này, nợ cũ, đã thu, số cần nộp.
- Xuất Excel của tháng đang chọn gồm 7 trang tính:
  1. Tổng hợp: theo từng lớp, kèm thu chi và chênh lệch.
  2. Mỗi lớp một trang: số buổi, học phí, điều chỉnh, nợ kỳ trước, đã thu, còn nợ, trạng thái. Cột tính toán là công
     thức, sửa số vẫn tự cập nhật.
  3. Điểm danh: bảng theo ngày.
  4. Sổ thu.
  5. Chi phí.
  6. Công nợ: các em còn nợ, kèm tên phụ huynh và số điện thoại để nhắc.
- Chốt sổ tháng.
- Học sinh đóng theo gói 1, 2 hoặc 3 tháng; khi thu tiền có 3 lựa chọn đó.
  Ví dụ: học xong tháng 1, 2, 3 thì tính tiền dư của tháng 1, 2, 3; tính tổng dự kiến tháng 4, 5, 6; số phải đóng =
  tổng dự kiến 4–6 trừ số dư 1–3; kết hợp tick đã đóng mấy tháng.
- Học sinh đã đóng 3 tháng thì nghỉ không trừ tiền, phải đi học bù.
- Điểm danh trợ giảng theo buổi; cuối tháng xuất Excel tổng buổi trợ giảng.

## Quyết định đã chốt

Vòng 1 (2026-11-15):

- **Nền tảng:** web app cài được lên màn hình chính (PWA), dùng trên điện thoại, máy tính bảng, máy tính.
- **Vai trò (RBAC):** Giáo viên (quản lý, thấy hết kể cả tiền), Trợ giảng (điểm danh, sticker, chụp ảnh; không thấy
  học phí), Học sinh. Dữ liệu lưu cloud, có đăng nhập.
- **Quy mô:** dưới 10 lớp, dưới 200 học sinh. Gói hosting miễn phí đủ dùng.
- **Học phí:** đơn giá mỗi buổi × số buổi. Đơn giá đặt theo lớp, ghi đè được cho từng học sinh. "Điều chỉnh" là
  khoản cộng/trừ tự do kèm lý do.
- **Tiền dư của gói:** (buổi dự kiến của gói − buổi lớp thực có học) × đơn giá. Chỉ tính những buổi *lớp* không học
  (lễ, Tết, giáo viên nghỉ). Học sinh tự nghỉ thì được học bù, không quy ra tiền.
- **Sticker = phiếu.** Mỗi buổi nhập số sticker (được nhập số âm để sửa sai), hiện tổng tích lũy. Chưa làm quy đổi.
- **Chữ ký:** học sinh ký tay trên màn hình, mỗi buổi một chữ ký, xác nhận cả việc có mặt lẫn số sticker.
- **Tin nhắn phụ huynh:** app soạn sẵn nội dung, có nút sao chép (dán vào Zalo) và nút mở Zalo/SMS tới số phụ huynh.
  Không gửi tự động.
- **Trợ giảng:** mỗi buổi chọn trợ giảng có mặt. Mỗi trợ giảng có đơn giá một buổi, cuối tháng app tự sinh khoản chi
  lương trợ giảng. Trang Excel thứ 7 là "Trợ giảng": số buổi, đơn giá, thành tiền.
- **Git:** app nhỏ, commit thẳng vào `main`.

## Câu hỏi còn mở

(Ghi dần theo từng vòng grill.)
