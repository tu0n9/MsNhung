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

Vòng 2 (2026-11-15). Chỗ nào khác vòng 1 thì vòng 2 thắng:

- **Stack:** React + Vite + Ant Design; Supabase (Postgres, Auth, Storage, RLS cho phân quyền); Excel sinh trên
  trình duyệt bằng `exceljs`; host tĩnh (Vercel/Cloudflare Pages). Không có backend riêng. Ảnh nén về khoảng 1600px
  trước khi tải lên.
- **Tài khoản học sinh = tài khoản phụ huynh, chỉ xem:** buổi học, sticker, học phí, nợ của con mình. Đăng nhập bằng
  số điện thoại phụ huynh, mật khẩu ban đầu là số điện thoại, tự đổi được. Giáo viên và trợ giảng đổi/đặt lại mật khẩu
  học sinh trong trang quản lý; giáo viên đặt lại được tài khoản trợ giảng.
- **Bỏ chữ ký tay của học sinh** (thay quyết định vòng 1). Minh chứng buổi học là ảnh do giáo viên hoặc trợ giảng chụp
  và đăng lên.
- **Lịch học:** mỗi lớp có lịch tuần cố định, app tự sinh buổi trong tháng; giáo viên đánh dấu buổi lớp nghỉ hoặc thêm
  buổi phụ. Buổi dự kiến = số buổi theo lịch.
- **Mọi gói (1, 2, 3 tháng) đều là khoá học đóng trước, đủ tiền** (thay mục "Học phí" vòng 1: không tính theo buổi
  thực học nữa). Học phí gói = buổi dự kiến × đơn giá. Học sinh nghỉ không bị trừ tiền; học bù ở buổi khác, buổi bù
  không tính tiền (coi như đổi lịch). Không học bù cũng không trừ tiền.
- **Học bù:** ngồi vào buổi của lớp khác hoặc buổi bù riêng do giáo viên tạo.
- **Hai chỉ số tiền:** "Đã thu" = tiền thu *cho* tháng đó; "Thực thu trong tháng" = tiền có *ngày thu* trong tháng.
  Chênh lệch thu chi = thực thu − tổng chi (theo dòng tiền).
- **Chốt sổ:** khoá điểm danh, phiếu thu, chi phí của tháng; nợ cuối kỳ ghi cố định làm nợ kỳ trước của tháng sau.
  Chỉ giáo viên mở khoá được, phải ghi lý do; chốt lại thì app tính lại.
- **Học sinh nghỉ hẳn:** trạng thái "Ngừng học", ẩn khỏi điểm danh, giữ lịch sử và công nợ. Chỉ xoá hẳn được học sinh
  chưa có dữ liệu.
- **Chi phí:** danh mục cố định, giáo viên thêm mục được (lương trợ giảng do app tự sinh); mỗi khoản có ngày, số tiền,
  ghi chú; tính theo ngày chi.

Vòng 3 (2026-11-15):

- **Tài khoản phụ huynh:** mỗi số điện thoại một tài khoản, thấy tất cả các con dùng số đó. Lần đăng nhập đầu bắt buộc
  đổi mật khẩu; đặt lại mật khẩu thì quay về mật khẩu = số điện thoại và lại bắt đổi.
- **Buổi chưa bù khi hết gói:** chuyển sang gói sau, không hạn. App hiện "còn N buổi chưa bù".
- **Phân bổ gói theo tháng:** khi thu, chọn gói (1/2/3 tháng) + tháng bắt đầu. Phải thu từng tháng = buổi dự kiến
  tháng đó × đơn giá; tiền đã đóng phân bổ theo đó, tháng đóng trước hiện "Đã đủ (đóng trước)".
- **Tiền dư** (buổi lớp nghỉ) trừ vào gói kế tiếp. Học sinh nghỉ hẳn còn dư: app hiện số dư; giáo viên quyết hoàn,
  hoàn thì ghi khoản chi "Hoàn học phí" gắn với học sinh.
- **Vào học giữa chừng:** gói đầu tính từ buổi đầu vào học; phải thu tháng đầu = buổi dự kiến còn lại × đơn giá.
- **Đổi đơn giá:** giá chốt lúc đóng gói; giá mới áp dụng từ gói kế tiếp.
- **Ảnh minh chứng:** giáo viên hoặc trợ giảng chụp.

Vòng 4 (2026-11-15):

- **Ảnh minh chứng là ảnh cả lớp** theo buổi, nhiều ảnh; không chụp riêng từng em.
- **Sao lưu:** GitHub Actions hằng đêm dump database vào một repo riêng tư; thêm nút "Sao lưu toàn bộ" trong app, và
  app nhắc tải bản sao lưu mỗi lần chốt sổ tháng.
- **Trạng thái điểm danh:** Có mặt / Vắng (+1 buổi chưa bù) / Học bù (học sinh bù vào đúng buổi được đánh dấu, −1
  buổi chưa bù). Không phân biệt vắng có phép hay không.
- **Quyền sửa:** trợ giảng sửa được điểm danh và sticker mọi buổi của tháng chưa chốt, giống giáo viên. Tháng đã chốt
  thì chỉ giáo viên mở khoá.

Chốt hiểu biết chung (2026-11-15):

- **Phụ huynh xem được ảnh lớp** của những buổi con mình có mặt.
- **Đăng nhập bằng tên đăng nhập hoặc số điện thoại**, áp dụng cho mọi tài khoản.
- **Tài khoản break-glass `admin`:** quyền cao nhất, tạo sẵn được các tài khoản khác (giáo viên, trợ giảng, phụ
  huynh). Mật khẩu do người dùng cung cấp, **không ghi vào repo**; script seed đọc từ biến môi trường
  `BREAK_GLASS_PASSWORD` trong `.env` (đã nằm trong `.gitignore`). Tài khoản này không bị bắt đổi mật khẩu.

## Câu hỏi còn mở

Không còn.
