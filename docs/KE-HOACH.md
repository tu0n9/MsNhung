# Kế hoạch — Anh ngữ Ms.Nhung

Yêu cầu và quyết định: [`YEU-CAU.md`](YEU-CAU.md). Mỗi pha là một lượt làm: Plan Mode → duyệt → code → kiểm trên
trình duyệt → commit. Pha sau dựa trên pha trước, làm tuần tự.

## Kiến trúc

```
Trình duyệt (React + Vite + AntD, PWA)
  ├─ supabase-js ──► Postgres  (bảng + RLS phân quyền + trigger khoá tháng đã chốt)
  │                  Storage   (avatar học sinh, ảnh lớp)
  │                  Auth      (email nội bộ <id>@msnhung.local + mật khẩu)
  ├─ Edge Function `tai-khoan` (tạo tài khoản, đặt lại mật khẩu — cần service role, không để ở trình duyệt)
  └─ src/hoc-phi.ts (tính tiền thuần TS, có test) — tab Học phí, cổng phụ huynh, tin nhắn và Excel cùng dùng
GitHub Actions hằng đêm ──► pg_dump ──► repo sao lưu riêng tư
```

Vì sao như vậy:

- **Tính tiền ở một module TS thuần** để UI, Excel và cổng phụ huynh ra cùng một con số, và test được bằng vitest
  mà không cần database.
- **Khoá tháng đã chốt nằm ở database (trigger)**, không ở UI, vì client không đáng tin.
- **Đăng nhập bằng tên hoặc số điện thoại:** Supabase Auth cần email, nên mỗi tài khoản có email nội bộ. Hàm RPC
  `email_dang_nhap(dinh_danh)` đổi tên đăng nhập hoặc số điện thoại ra email đó trước khi gọi `signInWithPassword`.
  Không dùng phone auth của Supabase vì nó đòi cấu hình nhà cung cấp SMS.

## Mô hình dữ liệu (phác thảo, chốt ở pha 1–4)

| Bảng | Nội dung chính |
|------|----------------|
| `tai_khoan` | user_id, ten_dang_nhap, so_dien_thoai, vai_tro (admin/giao_vien/tro_giang/phu_huynh), phai_doi_mat_khau |
| `lop` | tên, đơn giá/buổi, lịch tuần (mảng thứ), trạng thái |
| `hoc_sinh` | tên, avatar, phụ huynh (tên, sđt → tài khoản phụ huynh), lớp, ngày vào học, đơn giá riêng, trạng thái |
| `buoi_hoc` | lớp, ngày, loại (theo lịch / phụ / bù), lớp nghỉ? |
| `diem_danh` | buổi, học sinh, trạng thái (co_mat / vang / hoc_bu), sticker |
| `diem_danh_tro_giang` | buổi, trợ giảng |
| `anh_buoi` | buổi, đường dẫn Storage |
| `tro_giang` | tài khoản, đơn giá/buổi |
| `goi_hoc` | học sinh, tháng bắt đầu, số tháng (1/2/3), đơn giá chốt, buổi dự kiến, tiền dư trừ vào |
| `phieu_thu` | gói, số tiền, ngày thu, hình thức, ghi chú |
| `chi_phi` | danh mục, ngày, số tiền, ghi chú, học sinh (khi hoàn học phí) |
| `chot_so` | tháng, người chốt, ảnh chụp số nợ cuối kỳ (json), lịch sử mở khoá kèm lý do |

## Các pha

| # | Pha | Kết quả kiểm được |
|---|-----|-------------------|
| 0 | **Hạ tầng**: scaffold Vite + React + AntD + PWA, nối Supabase, deploy bản trống | Mở được URL trên điện thoại, cài ra màn hình chính |
| 1 | **Đăng nhập + tài khoản**: bảng `tai_khoan`, RPC đăng nhập, Edge Function `tai-khoan`, seed break-glass, bắt đổi mật khẩu lần đầu, trang quản lý tài khoản, khung RLS theo vai trò | admin đăng nhập, tạo giáo viên/trợ giảng/phụ huynh; đăng nhập bằng tên và bằng sđt đều được |
| 2 | **Lớp, học sinh, lịch**: CRUD lớp + lịch tuần, học sinh + avatar, ngừng học / xoá khi chưa có dữ liệu, sinh buổi theo tháng, đánh dấu lớp nghỉ / thêm buổi phụ | Tạo lớp T2-4-6, tháng hiện đúng số buổi |
| 3 | **Điểm danh**: màn hình buổi học (lưới avatar, Có mặt/Vắng/Học bù, sticker), trợ giảng có mặt, chụp nhiều ảnh lớp (nén ~1600px), tổng sticker, số buổi chưa bù | Điểm danh một buổi trên điện thoại, ảnh lên Storage |
| 4 | **Gói và thu tiền**: `hoc-phi.ts` (buổi dự kiến, phân bổ gói theo tháng, tiền dư, nợ) + test; màn hình thu tiền (chọn gói 1/2/3 + tháng bắt đầu, thu nhiều đợt) | Test vitest cho các ví dụ trong YEU-CAU pass; thu 3 tháng thì tháng 5–6 hiện "Đã đủ (đóng trước)" |
| 5 | **Tab Học phí, chi phí, chốt sổ**: chỉ số tháng, lọc Còn nợ/Đã đủ, chi tiết học sinh, chi phí theo danh mục, lương trợ giảng tự sinh, chốt / mở khoá (trigger khoá) | Tháng đã chốt: sửa điểm danh bị database từ chối |
| 6 | **Phụ huynh**: tin nhắn soạn sẵn (sao chép, mở Zalo/SMS); cổng phụ huynh chỉ xem (buổi, sticker, học phí, ảnh) | Đăng nhập phụ huynh chỉ thấy con mình (kiểm RLS bằng tài khoản khác) |
| 7 | **Xuất Excel 7 loại trang** bằng `exceljs`, cột tính toán là công thức | Mở file bằng Excel, sửa số thì cột công thức cập nhật |
| 8 | **Sao lưu**: GitHub Actions hằng đêm `pg_dump` sang repo riêng tư; nút "Sao lưu toàn bộ"; nhắc khi chốt sổ | Có bản dump đêm đầu tiên trong repo sao lưu |
| R | **Review toàn bộ** trước khi giao cho cô Nhung dùng thật | Ghi kết quả vào cuối file này |

## Tiến độ

| Pha | Trạng thái | Kiểm chứng |
|-----|-----------|------------|
| 0–7 | ✅ 2026-11-15 | `npm test` 9/9 pass (`src/hoc-phi.test.ts`); `tsc` sạch; build OK. E2E Playwright Chromium ở khung 412px: admin đăng nhập → tạo trợ giảng → tạo lớp → thêm học sinh có avatar + SĐT phụ huynh → điểm danh, sticker, trợ giảng, ảnh lớp → thu gói 3 tháng 2 triệu → chi phí → tab Học phí (3.000.000 phải thu / 2.000.000 đã thu / 1.000.000 còn / chi 230.000 / chênh 1.770.000) → xuất Excel 7 loại trang có công thức → phụ huynh đăng nhập bằng SĐT, bị bắt đổi mật khẩu, thấy điểm danh, ảnh, học phí. Không lỗi JS. Khoá sổ thử qua API: tháng đã chốt từ chối thêm chi phí, sửa điểm danh, xoá phiếu thu; mở khoá phải có lý do. Edge Function: trợ giảng tạo giáo viên bị 403, trợ giảng đọc `chi_phi` ra rỗng. Dữ liệu thử đã xoá. |
| 8 | ✅ 2026-11-15 | Workflow `.github/workflows/sao-luu.yml` chạy 01:00 giờ VN, dump `roles.sql` / `schema.sql` / `data.sql` vào nhánh `sao-luu` của chính repo (người dùng chọn). Secret `SUPABASE_DB_URL` đã đặt. Chạy tay lần đầu thành công (1m39s); `data.sql` có 47 lệnh COPY gồm `auth.users` và `public.tai_khoan`. **Ảnh trong Storage không nằm trong bản dump.** Nút "Sao lưu toàn bộ" (JSON) và nhắc tải khi chốt sổ có trong app. |
| Deploy | ✅ 2026-11-15 | https://ms-nhung.vercel.app: Playwright Chromium 412px đăng nhập admin, đi qua 5 tab, không lỗi JS; `manifest.webmanifest` và `sw.js` trả 200 (cài PWA được). |
| Import Excel | ✅ 2026-11-15 | `src/import-excel.ts` (đọc/kiểm, file mẫu), `src/nhap-du-lieu.ts` (ghi), màn `trang/ImportExcel.tsx` kiểu A; migration `sticker_dau_ky`. `npm test` 17/17. Playwright Chromium 412px: tải mẫu (3 trang, ô Lớp thả xuống `'Lớp'!$A$2:$A$500`) → điền 2 lớp + 6 học sinh → kiểm tra bắt 4 lỗi + 2 đã có → nhập 1 lớp 2 học sinh, 2 em chung 1 tài khoản phụ huynh → import lại cùng file: Mới 0. Không lỗi JS. Dữ liệu TEST đã xoá. |
| Phong cách 3 | ✅ 2026-11-15 | Theme `src/giao-dien.ts` (xanh `#0f7a5c`, Lexend gói kèm app, bo 4–6px), avatar vuông, tab Học phí đổi sang khối kẻ ô + dòng từng học sinh (hết bảng kéo ngang trên điện thoại). Chụp Chromium 412px: Điểm danh, Lớp, Học phí, Import. |
| Quyền trợ giảng | ✅ 2026-11-15 | Migration `tro_giang_thu_quyen`: trợ giảng chỉ đọc tài khoản mình + phụ huynh; cột đơn giá `tro_giang_buoi` không cấp cho client; `ds_tro_giang()`, `luong_tro_giang()`. Thử bằng tài khoản trợ giảng tạm qua API: đúng như trên, admin vẫn đủ. |
| Test toàn bộ | ✅ 2026-11-15 | `tests/e2e/` + `npm run test:all`. Lần chạy đầu bắt được 4 lỗi thật, đã sửa: (1) bấm Lưu / Enter hai lần tạo trùng học sinh, phiếu thu, chi phí, buổi, tài khoản → hook `useMotLan` khoá nút khi đang lưu; (2) màn import kiểm file bằng danh sách cũ/chưa tải xong → coi mọi dòng là Mới, nhập trùng → tải lại dữ liệu ngay lúc chọn file; (3) tổng sticker ở điểm danh sai khi chấm trước lúc tải xong → tính từ "sticker đã có + các buổi khác" + buổi này; (4) bấm Vắng rồi chấm sticker liền tay ghi đè thành Có mặt → đọc bản mới nhất qua ref. Sau sửa: 3 lượt liên tiếp đạt hết (17 unit, 11 E2E, 20 API), database về đúng như trước. |
| Video hướng dẫn | 🔶 2026-11-15 | `tests/video/` (khung.py: Playwright + giọng vi-VN-HoaiMyNeural qua edge-tts + ffmpeg ghép MP4; chuong.py: 8 kịch bản; du_lieu_mau.py: dữ liệu mẫu tạo/xoá theo id, trả khoá sổ về như cũ). ~~Ra `docs/huong-dan/*.mp4` + `index.html`, mp4 không vào git~~ → từ 2026-11-15 (dòng "Video trong app" bên dưới) ra `public/huong-dan/*.mp4`, có trong git, phát ở trang Hướng dẫn của app. Quay video bắt được 2 lỗi thật, đã sửa: (1) điểm danh: em chưa điểm danh bấm "Có mặt" không lưu (Segmented tự chọn sẵn ô đầu, không gọi onChange) → Radio.Group, E2E thêm câu kiểm; (2) Thu tiền: học sinh chưa có gói mặc định "Từ tháng" = tháng vào học → gói ghi lùi về quá khứ thành nợ → mặc định tháng muộn hơn giữa tháng vào học và tháng này. `npm run test:all` sau sửa: 22 unit + 40 PASS. |
| R | 🔶 2026-11-15 | Review toàn bộ `636d4aa...4b9d6fa` bằng `mattpocock-skills:code-review` (có spec `YEU-CAU.md`): 2 agent song song, trục Standards (CLAUDE.md + smell Fowler) và trục Spec. **Đã sửa** (migration `sua_sau_review`, commit này): cột Học phí của Excel suy ngược sai → `hocPhiGocThang`; logic tiền rải trong component → gom về `hoc-phi.ts` có test (`demNghiPhu`, `tongGoi`, `conNoGoi`, `duConLai`, `trangThaiThang`); gói chồng tháng → trigger chặn; tiền dư chỉ lấy gói cuối, buổi nghỉ đánh dấu muộn bị mất, có thể hoàn hai lần → `duConLai` tính trên tổng của học sinh trừ đã trừ và đã hoàn; "Hoàn học phí" gắn học sinh; "Đã đủ (đóng trước)"; chỉ giáo viên đánh Lớp nghỉ / thêm buổi (người dùng chốt); giáo viên không sửa tài khoản giáo viên khác; trợ giảng chỉ thêm/xem ảnh; không bỏ được cờ bắt đổi mật khẩu khi mật khẩu vẫn là SĐT; ô tiền chỉ nhận số nguyên; Edge Function tách `QUYEN_TAO` / `QUYEN_DAT_LAI`. Kiểm: `npm run test:all` đạt hết (21 unit, 11 E2E, 26 API, database về như trước). **Chấp nhận** (người dùng chốt): trợ giảng đọc được đơn giá lớp qua API (giao diện ẩn), thấy đơn giá của chính mình. **Học bù (người dùng chốt):** buổi bù riêng chỉ có "Học bù / Không đến", vắng buổi bù không sinh buổi chưa bù (`demChuaBu`, có test; E2E + API kiểm). Sau cùng `npm run test:all`: 22 unit, 12 E2E, 27 API, database về như trước — đạt hết. **Còn mở:** smell nhỏ (định dạng tháng/gói lặp, danh sách bảng sao lưu viết tay). |
| Lưới điểm danh tháng + giờ học | ✅ 2026-11-15 | Quyết định ở `YEU-CAU.md` mục "Lưới lịch điểm danh tháng và giờ học". Hàm thuần `src/diem-danh-thang.ts` (`luoiThang`, 6 test); màn chi tiết học sinh bỏ danh sách từng buổi, thay bằng lưới 7 cột + dòng chi tiết khi chạm ô + chú thích; màu mới `MAU.vangDam/xanh/xanhNhat/xam`. Migration `gio_hoc` (cột `lop.gio`, chữ tự do) đã `db push`; giờ hiện ở trang Lớp, Điểm danh, chi tiết học sinh. E2E thêm bước lưới (hôm nay có mặt, hôm qua vắng, hôm kia có mặt + học bù → ô học bù, ngày trước đó chưa điểm danh, chạm ô ra chi tiết) và kiểm lại cùng lưới bằng tài khoản phụ huynh (RLS đọc được `buoi_hoc` của lớp con và buổi bù). `npm run test:all`: 28 unit, 13 E2E, 27 API, database về như trước — đạt hết. Đã xem ảnh Chromium 412px của cả giáo viên lẫn phụ huynh. |
| Video trong app | ✅ 2026-11-15 | Quyết định ở `YEU-CAU.md` mục "Video hướng dẫn trong app". 8 video ở `public/huong-dan/` (~13 MB, có trong git, Vercel phục vụ tĩnh, không dùng Supabase); trang `trang/HuongDan.tsx` lọc theo vai trò (giáo viên 8, trợ giảng 2, phụ huynh 1), nút "Hướng dẫn" cạnh "Thoát", phụ huynh có liên kết "Xem hướng dẫn"; service worker không cache sẵn mp4 và không đổi link mp4 thành index.html. Bỏ `docs/huong-dan/index.html`. Quay lại cả 8 video cho khớp lưới tháng, giờ học, nút Hướng dẫn; dữ liệu mẫu thêm điểm danh đầu tháng 11 (có mặt, vắng, học bù lớp khác) để lưới không toàn ô vàng. **Bài học:** câu đọc mới chưa có trong đệm giọng thì edge-tts có thể chạy rất lâu trong lúc đang quay, sinh khoảng đứng hình (video 8 dài 4:49) → quay lại lần hai khi đệm đã có (1:45). Kiểm khung hình video 4 và 8 bằng ffmpeg. `npm run test:all`: 28 unit, 13 E2E (thêm: 8 / 2 / 1 video theo vai trò, mọi video đọc được metadata), 27 API, database về như trước — đạt hết. |
| Dọn ảnh lớp cũ | ✅ 2026-11-15 | Quyết định ở `YEU-CAU.md` mục "Dọn ảnh lớp cũ". Workflow `.github/workflows/don-anh.yml` (01:30 ngày 2 hằng tháng + chạy tay): bước 1 ảnh buổi cũ hơn 3 tháng → zip theo tháng lên Release `anh-YYYY-MM`, tải lại `cmp` + đếm số ảnh, khớp mới xoá file khỏi Storage (dòng `anh_buoi` giữ lại vì trigger khoá sổ); bước 2 xoá hẳn release cũ hơn 6 tháng. App ẩn ảnh không còn file (ký link trả `signedURL: null`). Migration `dung_luong_anh` đã `db push`; tab Học phí hiện "Ảnh đang dùng X MB / 1 GB". Secret `SUPABASE_SECRET_KEY` người dùng tự thêm (mở sẵn trang bằng browser-use). Thử thật trên GitHub với một ảnh TEST tháng 6/2026: lượt 1 (mặc định) → release `anh-2026-06` có zip 1 ảnh, file trên Supabase trả 400, dòng `anh_buoi` còn; lượt 2 (`giu_github=0`, bỏ chọn xoá) → "xoá: false", ảnh đã dọn được bỏ qua, release + tag `anh-2026-06` bị xoá. Dữ liệu TEST đã dọn. **Bài học:** ô tích của hộp "Run workflow" (React) không phản ánh qua `input.checked`, phải bấm vào phần tử checkbox trong cây trợ năng. `npm run test:all`: 28 unit, 13 E2E (thêm dòng dung lượng ảnh), 27 API, database về như trước — đạt hết. Bản thật nhận `index-yUrnXluA.js`. |

### Chỗ lệch so với thiết kế ban đầu

- **Chốt sổ không chụp lại số nợ.** Số của một tháng chỉ tính từ phiếu thu có ngày trước cuối tháng đó và dữ liệu đến
  hết tháng bị trigger khoá, nên tính lại lúc nào cũng ra cùng con số; không cần bảng ảnh chụp. Chốt tháng M khoá mọi
  thứ đến hết M (mốc `khoa_so.khoa_den`), mở khoá M thì các tháng sau M cũng mở.
- **"Đã thu" của tháng M** = tiền thu được trong kỳ cho các khoản đến hết tháng M: gồm tiền đóng trước cho tháng M
  và tiền trả nợ cũ thu trong tháng M. Nhờ vậy luôn có *Còn phải thu = Học phí + Nợ kỳ trước − Đã thu*. Tiền đóng
  trước cho các tháng sau không nằm trong "Đã thu" mà chỉ nằm trong "Thực thu trong tháng".
- **Lương trợ giảng không sinh dòng chi phí** mà tính từ `tro_giang_buoi` (đơn giá chốt lúc điểm danh) và cộng vào
  tổng chi; trang Chi phí và Excel hiện riêng một dòng.

## Việc người dùng phải tự làm (cần trước pha 0–1)

1. Tạo project Supabase (supabase.com, gói Free, chọn region Singapore). Gửi lại **Project URL** và **anon key**.
   **Service role key** và mật khẩu database chỉ đặt vào `.env` trên máy, không dán vào chat.
2. Vercel: team `tuong6` (tài khoản Vercel trong Chrome, đăng nhập bằng GitLab), ứng dụng Vercel trên GitHub chỉ được cấp repo `MsNhung`, project `ms-nhung` tự deploy khi push `main`.
3. Sao lưu: nhánh `sao-luu` trong chính repo này (không cần repo riêng).
