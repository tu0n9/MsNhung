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
  (Khi làm, "Đã thu" được tính gồm cả tiền trả nợ cũ thu trong tháng, để *Còn phải thu = Học phí + Nợ kỳ trước −
  Đã thu* luôn đúng; xem `docs/KE-HOACH.md` mục "Chỗ lệch".)
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

Import lớp và học sinh bằng Excel (grill 2026-11-15):

- **Một file mẫu** gồm 3 trang `Hướng dẫn`, `Lớp`, `Học sinh`. File tải về đã điền sẵn các lớp đang có; cột Lớp
  của trang Học sinh là danh sách thả xuống lấy từ trang Lớp.
- **Chỉ thêm mới, không sửa.** Lớp trùng tên, hoặc học sinh trùng (họ tên + lớp + SĐT phụ huynh) thì bỏ qua và báo.
- **Xem trước rồi mới nhập:** từng dòng xanh/đỏ kèm lý do; nhập các dòng hợp lệ; tải được danh sách lỗi ra Excel;
  import lại cùng file sau khi sửa vẫn an toàn vì dòng đã có bị bỏ qua.
- **Cột:** Lớp = Tên lớp*, Đơn giá/buổi*, T2…CN đánh "x". Học sinh = Họ tên*, Lớp*, Tên phụ huynh, SĐT phụ huynh,
  Ngày vào học (trống = hôm nay), Đơn giá riêng, Ghi chú, **Sticker đã có** (số sticker tích luỹ từ sổ giấy, cần
  trường mới trên học sinh). Không có cột Nợ cũ: nợ cũ ghi lúc Thu tiền bằng ô điều chỉnh. Ảnh thêm trong app.
- **Tự tạo tài khoản phụ huynh** theo SĐT như khi thêm tay, có thanh tiến độ.
- Chỉ giáo viên và admin được import. SĐT bỏ ký tự thừa, `+84` → `0`, phải còn 10 số bắt đầu bằng 0; cột SĐT
  trong mẫu định dạng Text.

Giao diện và quyền trợ giảng (2026-11-15):

- ~~**Phong cách 3 "Sổ tay giáo viên"**~~ (thay bằng "Sổ vàng" ngày 2026-11-16, mục cuối) cho cả app (mẫu: `docs/mau-giao-dien/phong-cach-toan-app.html`): đầu trang
  xanh lá đậm `#0f7a5c`, font Lexend, góc gần vuông (4–6px), ít khung, phân cách bằng đường kẻ, số xếp thẳng cột,
  điểm danh dạng danh sách dày.
- **Màn import kiểu A**: trang riêng 3 bước, tóm tắt lỗi ở đầu, lọc Lỗi / Đã có / Mới (mẫu: `import-excel.html`).
- **Trợ giảng chỉ thấy tài khoản của mình và của phụ huynh**; không đọc được đơn giá trả trợ giảng (kể cả qua API).
  Danh sách trợ giảng để điểm danh lấy qua hàm `ds_tro_giang()` (chỉ tên); lương qua `luong_tro_giang()` (chỉ giáo viên).

Sau review pha R (2026-11-15):

- **Học bù trong buổi bù riêng:** mỗi em chỉ có "Học bù" (trừ 1 buổi chưa bù) hoặc "Không đến" (không ghi gì, không
  sinh thêm buổi chưa bù). Buổi thường và buổi phụ giữ như cũ: vắng cộng 1 buổi chưa bù.
- ~~**Chỉ giáo viên** đánh "Lớp nghỉ" và thêm buổi phụ / bù (buổi lớp nghỉ sinh tiền dư).~~ (thay ở mục
  "Quyền trợ giảng, cột gói, báo gia hạn" bên dưới).
- Trợ giảng đọc được đơn giá lớp qua API là **chấp nhận được** (giao diện đã ẩn); trợ giảng thấy đơn giá của chính mình.
- Video hướng dẫn: nhiều video ngắn theo từng việc, có giọng đọc tiếng Việt (Microsoft HoaiMy qua `edge-tts`).
  ~~Video để trên máy, không đưa vào git~~ (thay ở mục "Video hướng dẫn trong app" bên dưới). Quay lại bằng
  `python -I -X utf8 tests/video/chuong.py [số video]` (cần dev server 127.0.0.1:5180).

Lưới lịch điểm danh tháng và giờ học (grill 2026-11-15):

- **"Điểm danh tháng" ở màn chi tiết học sinh là lưới lịch** 7 cột T2 → CN, thay hẳn danh sách từng buổi. Giáo viên
  và phụ huynh dùng chung. Chạm vào một ô thì dòng cố định dưới lưới hiện mọi buổi của ngày đó (loại buổi, trạng thái,
  sticker); dưới lưới có chú thích màu.
- **Màu ô:** Có mặt xanh lá; Vắng đỏ; Học bù xanh dương có chữ "bù"; Lớp nghỉ xám gạch ngang; buổi đã qua mà chưa
  điểm danh nền vàng viền vàng đậm; buổi sắp tới số thường; ngày không có buổi số mờ; hôm nay viền đậm.
- **Nguồn ngày có buổi:** các buổi đã sinh của lớp (`buoi_hoc`), không suy từ lịch tuần. Bỏ qua buổi trước ngày vào
  học, buổi bù riêng mà em không đến, và buổi chưa điểm danh của học sinh đã ngừng học. Buổi phụ tính như buổi lịch.
- **Chỉ ngày trước hôm nay** mới tính "chưa điểm danh"; buổi hôm nay chưa điểm danh là buổi sắp tới.
- **Ngày có nhiều buổi** tô theo thứ tự Vắng > Chưa điểm danh > Học bù > Có mặt > Lớp nghỉ. Trạng thái lấy từ điểm danh
  của em trước (cả buổi học bù ở lớp khác), rồi mới tới buổi của lớp.
- **Giờ học:** mỗi lớp một ô giờ chung dạng chữ (ví dụ "17:30–19:00"), không bắt buộc; hiện ở trang Lớp, Điểm danh và
  chi tiết học sinh (phụ huynh thấy). Chưa có giờ riêng cho từng thứ, chưa có cột giờ trong file import.

Video hướng dẫn trong app (2026-11-15):

- **Video nằm trong repo** ở `public/huong-dan/*.mp4` (khoảng 11 MB), Vercel phục vụ như file tĩnh; không dùng bộ nhớ
  Supabase. Repo riêng tư nên không liên kết sang GitHub (người xem phải có quyền vào repo).
- **Trang Hướng dẫn** trong app, lọc theo vai trò: giáo viên/admin 8 video, trợ giảng video 1 và 4, phụ huynh video 8.
  Giáo viên, trợ giảng vào bằng nút "Hướng dẫn" cạnh "Thoát"; phụ huynh bằng liên kết "Xem hướng dẫn" cạnh "Đổi mật khẩu".
- Service worker không cache sẵn video; video chỉ tải khi bấm xem.

Dọn ảnh lớp cũ (2026-11-15):

- Dữ liệu điểm danh, học phí **không xoá** (vài MB mỗi năm, cần cho công nợ, Excel, lịch sử). Thứ làm đầy bộ nhớ là
  ảnh lớp (khoảng 1 GB mỗi năm ở quy mô 10 lớp), nên chỉ dọn ảnh lớp; avatar giữ nguyên.
- **Tự động hằng tháng** bằng GitHub Actions (`.github/workflows/don-anh.yml`, 01:30 ngày 2), không có nút trong app,
  không cần tải về máy: ảnh của buổi **cũ hơn 3 tháng** (giữ tháng này và 3 tháng trước) được nén zip theo tháng, đưa
  lên **GitHub Release** `anh-YYYY-MM`, tải lại so khớp rồi mới xoá file khỏi Supabase. Dòng `anh_buoi` giữ lại (tháng
  đã chốt sổ không cho xoá dòng); app ẩn ảnh không còn file.
- **Release ảnh của tháng cũ hơn 6 tháng bị xoá hẳn khỏi GitHub**: sau đó ảnh không còn ở đâu nữa.
- Tab Học phí hiện "Ảnh đang dùng: X MB / 1 GB" (hàm `dung_luong_anh()`, chỉ giáo viên); quá 800 MB thì chữ đỏ.
- Secret `SUPABASE_SECRET_KEY` trong GitHub Actions do người dùng tự thêm.

Xoá lớp (2026-11-15):

- **Lớp có dữ liệu vẫn xoá hẳn được**; xoá nhầm là lỗi người dùng. Nút "Xoá lớp" trong form Sửa lớp, giáo viên và admin,
  phải gõ lại đúng tên lớp thì nút "Xoá hẳn" mới bật.
- Xoá cùng lúc: học sinh của lớp và mọi thứ của các em (điểm danh ở mọi lớp, gói học, phiếu thu, avatar), buổi học của
  lớp và mọi thứ gắn với buổi (điểm danh của em lớp khác sang học bù, trợ giảng, ảnh). Khoản chi "Hoàn học phí" giữ
  lại, chỉ bỏ liên kết học sinh. Tài khoản phụ huynh giữ lại.
- Lớp có dữ liệu trong **tháng đã chốt sổ** thì database từ chối và không xoá gì; mở khoá tháng đó trước rồi xoá.

Dữ liệu demo và làm sạch (2026-11-15):

- **Demo để bàn giao thử** (`npm run tao-demo`): 3 lớp, 15 học sinh, điểm danh 3 tháng tính tới hôm nay (vắng, học bù
  lớp khác, lớp nghỉ, một buổi quên điểm danh), ảnh lớp, gói 1 / 3 tháng với đủ kiểu đóng tiền, chi phí, chốt sổ 2
  tháng trước. **Không tạo tài khoản mới**: dùng 3 tài khoản đang có (`admin`, trợ giảng `tg01`, phụ huynh
  `0356998740` là phụ huynh của hai anh em trong demo). Thêm bên cạnh dữ liệu đang có, không xoá gì.
- **Làm sạch như app mới** (`npm run lam-moi`, chỉ chạy khi người dùng cần): xoá mọi dữ liệu và ảnh, mở khoá sổ,
  **giữ mọi tài khoản**; bắt gõ `XOA HET`, tải bản sao lưu JSON về `sao-luu-may/` trước khi xoá. Chạy trên máy có `.env`.

Quyền trợ giảng, cột gói, báo gia hạn (grill 2026-11-16):

- **Trợ giảng đánh được "Lớp nghỉ" và thêm buổi phụ / bù** như giáo viên, ở mọi buổi của tháng chưa chốt sổ (thay
  quyết định "chỉ giáo viên" ngày 2026-11-15). Không ghi lại ai đánh.
- **Excel, sheet từng lớp có cột "Gói"** dạng `3 tháng · 04→06/2026` (gói phủ tháng đang xuất); không có gói thì
  "Chưa có gói". Chỉ là cột chữ, công thức tiền không đổi; sheet Công nợ giữ nguyên.
- **Danh sách "Sắp hết gói"** trên trang Học phí, chỉ giáo viên thấy. Gồm học sinh đang học (bỏ em ngừng học) mà:
  còn ≤ 4 buổi theo lịch tuần từ hôm nay tới cuối gói (không trừ buổi lớp nghỉ, vì lớp nghỉ đã thành tiền dư); hoặc gói
  cũ đã hết mà chưa có gói tiếp; hoặc **chưa từng có gói** (nhãn "Chưa có gói"; các em này không hiện ở Công nợ vì phải
  thu = 0).
- Mỗi dòng có SĐT phụ huynh và nút copy tin nhắn nhắc gia hạn: gói hiện tại, còn N buổi, ngày buổi cuối, học phí
  **1 tháng kế tiếp** = buổi theo lịch × đơn giá của em. Em chưa có gói thì bỏ phần gói cũ.
- **Phụ huynh luôn thấy** dòng "Gói: 3 tháng · 04→06/2026 · còn N buổi", chữ đỏ khi còn ≤ 4 buổi hoặc đã hết.
- **Ô "Trừ tiền dư"** khi đóng gói mới vẫn tự điền và không cho vượt tiền dư app tính được. Khi tiền dư bằng 0 thì
  khoá ô và ghi rõ tiền dư chỉ sinh từ buổi lớp nghỉ của gói đã kết thúc. Tiền dư từ sổ giấy (ngoài app) nhập ở ô
  "Điều chỉnh" bằng số âm kèm lý do.

Giờ học theo thứ, lương trợ giảng theo ca, điểm danh gộp (grill 2026-11-16):

- **Giờ học theo từng thứ** bằng ô chọn giờ (thay ô chữ `gio`): tick thứ nào thì **bắt buộc** giờ bắt đầu–kết thúc của
  thứ đó; kết thúc mặc định = bắt đầu + 2 tiếng (một ca 2 tiếng), sửa được. Danh sách buổi trong ngày xếp theo giờ.
- **Mỗi buổi lưu giờ riêng** lúc sinh; buổi phụ / bù chọn giờ khi tạo (tự điền giờ của lớp nếu thứ đó có lịch). Đổi giờ
  lớp thì buổi theo lịch **từ hôm nay trở đi** đổi theo, buổi đã qua giữ giờ cũ (lớp nhập giờ muộn vẫn có giờ cho các buổi
  còn lại của tháng); tháng đã chốt không đổi.
- **Ảnh lớp gộp** tải một lần, app chép file sang từng buổi của ca (phụ huynh mỗi lớp đều thấy). Tốn gấp đôi dung lượng
  cho ảnh lớp gộp, đổi lại không phải sửa quyền xem ảnh, xoá lớp và workflow dọn ảnh.
- **Lương trợ giảng tính theo ca:** số cặp (ngày, giờ bắt đầu) khác nhau mà trợ giảng có mặt × đơn giá của trợ giảng
  (hiện là "đơn giá / ca"). Một trợ giảng không thể ở hai lớp khác giờ: cùng ngày cùng giờ bắt đầu là lớp gộp, tính 1 ca;
  khác giờ bắt đầu thì mỗi lớp 1 ca. Màn lương và sheet Excel "Trợ giảng" đổi "buổi" thành "ca". Tính lại từ tháng 11;
  tháng đã chốt giữ nguyên.
- **Điểm danh gộp:** các buổi cùng ngày + cùng giờ bắt đầu tự hiện thành một dòng (`14:00 · Lớp A + Lớp B`) và một màn
  điểm danh: học sinh chia nhóm theo lớp, "Tất cả có mặt" áp cho cả nhóm, chọn trợ giảng một lần và chụp ảnh một lần cho
  mọi lớp trong nhóm (phụ huynh các lớp đều thấy ảnh). "Lớp nghỉ" vẫn bật riêng từng lớp. Dữ liệu vẫn tách theo lớp.
- **Import Excel:** ô T2…CN ghi giờ dạng `08:00-09:30`; ô chỉ có "x" báo lỗi thiếu giờ.
- **Lớp đang có:** migration tự chuyển giờ dạng `17:30–19:00` cho mọi thứ trong lịch; giờ không đọc được (ví dụ
  `T7 8:00, CN 9:30`) để trống, trang Lớp cảnh báo "Chưa có giờ".
- Thứ tự làm: cột gói Excel → báo gia hạn + ô tiền dư → giờ học + lương theo ca + điểm danh gộp.


Giao diện "Sổ vàng" (2026-11-16):

- Người dùng chọn hướng A trong `docs/ban-mau/giao-dien.html`, thay phong cách 3: **nền tối, vàng kim theo logo** Ms Nhung
  English; nội dung Be Vietnam Pro, số lớn (giờ ca, còn phải thu) và chữ "Ms.Nhung" Playfair Display (font tự host).
- Vàng là màu nhấn; trạng thái tốt (có mặt, đã đủ, tiền dương) màu xanh nhạt, nợ / vắng màu đỏ cam.
- Màn đăng nhập nền đen liền với nền logo, logo lớn ở trên, ô nhập và nút vàng bên dưới.
- **Có bản sáng và bản tối, mặc định sáng** (người dùng thấy nền tối nặng nề). Nút mặt trời / mặt trăng ở thanh trên, cho
  mọi vai trò; lựa chọn lưu theo từng máy. Bản sáng: nền trắng, chữ gần đen, nút vàng kim chữ tối, chữ và liên kết vàng
  đậm cho đủ tương phản. Màn đăng nhập luôn tối ở cả hai chế độ.
- **Đổi sang hồng kim** (2026-11-16, người dùng chọn trong 3 kiểu ở `docs/ban-mau/logo-hong/`): logo đổi phần vàng kim
  sang hồng ánh kim, nền đen giữ nguyên; màu nhấn của app đổi theo (sáng: nút `#E3A1AB`, chữ `#A8485A`; tối: `#E8A4AE`).
  Ở bản tối, nợ / vắng màu cam thay đỏ cam để không lẫn với hồng nhấn.
- **Logo tách nền đen** (trong suốt) cho thanh trên và màn đăng nhập; màn đăng nhập theo chế độ sáng / tối như các màn
  khác (thay quy định "đăng nhập luôn tối"). Icon cài ra màn hình chính vẫn nền đen, vì máy tự tô kín phần trong suốt.
- **Bản sáng kiểu kính mờ hồng** (theo ảnh mẫu người dùng gửi, chủ đạo hồng): nền chuyển hồng phấn sang tím hồng, thẻ
  và thanh trên / dưới trắng trong mờ, bo góc lớn, nút và tab dạng viên thuốc; nút chính và tab đang chọn hồng đậm
  `#D23C69` chữ trắng, chữ / liên kết hồng `#B8325C`. Máy bật giảm trong suốt thì thẻ trắng đặc. Bản tối giữ nguyên.
- Làm thử trên máy, người dùng duyệt ảnh rồi mới đưa lên bản thật. Video hướng dẫn cũ còn màu xanh.


Đánh giá từ học sinh (2026-11-18, theo mẫu phiếu IELTS Arena người dùng gửi):

- Cuối tháng giáo viên gửi link vào Zalo mời học sinh đánh giá khoá học và trợ giảng. **Bỏ phần đánh giá Admin**,
  "giảng viên" trong mẫu đổi thành trợ giảng.
- **Mỗi tháng 1 link chung, mã ngẫu nhiên**: giáo viên bấm "Tạo link tháng X" rồi sao chép. Nút **"Đổi link"** tạo mã
  mới, link cũ hết hiệu lực ngay, phiếu đã gửi vẫn giữ. Link nhận phiếu tới **hết ngày 5 tháng sau** rồi tự đóng.
- **Không đăng nhập, nhưng ghi tên** (đổi lại cùng ngày, thay "ẩn danh"): chọn lớp rồi chọn tên trong danh sách học
  sinh đang học của lớp, cả hai bắt buộc. **Mỗi em mỗi tháng chỉ gửi 1 phiếu** (database chặn); tên em đã gửi hiện mờ.
  Em nào chọn nhầm tên bạn thì giáo viên xoá phiếu đó, bạn kia gửi lại được. Giáo viên xoá được từng phiếu.
- Phiếu thấy tên lớp, tên học sinh đang học và tên trợ giảng (lớp, tài khoản trợ giảng đang hoạt động), chỉ khi mã
  link còn hạn. Trang kết quả có số em đã gửi / tổng số em và danh sách em chưa gửi để cô nhắc.
- **Câu hỏi cố định trong code:** chọn lớp; phần Khoá học 2 câu viết (nhận xét chung và mong muốn cải thiện; khó khăn
  khi học). Phần Trợ giảng: tick một hoặc nhiều trợ giảng, hoặc "không có trợ giảng"; **mỗi người được tick có riêng**
  3 câu chấm 1–5 (kiến thức chuyên môn; tương tác, điều phối lớp, xử lý tình huống; hỗ trợ ngoài giờ) và 2 câu viết
  (nhận xét riêng gửi trợ giảng; chữa bài tập về nhà). Câu chấm điểm bắt buộc, câu viết không bắt buộc. Thang 1–5, bỏ mức 0.
- **Chỉ giáo viên xem kết quả** (trợ giảng không thấy). Trang "Đánh giá": chọn tháng, lọc lớp; bảng trợ giảng (số phiếu,
  điểm trung bình 3 tiêu chí, tăng / giảm so với tháng trước), nhận xét chữ gom theo câu hỏi, số phiếu theo lớp.
- File Excel tháng thêm trang **"Đánh giá"**.
- **AI tóm tắt (làm lượt sau**, khi đã có phiếu thật và người dùng tự dán `GEMINI_API_KEY` vào secret Supabase): nút bấm
  khi cần, gọi Gemini gói free qua Edge Function, chỉ giáo viên gọi được. Tên trợ giảng đổi thành "TG1, TG2…" và **không gửi tên
  học sinh** lên Gemini, đổi lại tên trợ giảng khi nhận. **Tóm tắt theo từng lớp**, lưu theo (tháng, lớp), bấm lại thì ghi đè, ghi "Tóm tắt lúc… từ N
  phiếu"; lọc "Tất cả lớp" thì ẩn nút.

## Câu hỏi còn mở

Không còn.
