# Task List: Học sinh học nhiều lớp, đơn giá cố định & bỏ đăng nhập phụ huynh

Source plan: `tasks/plan.md` · Source spec: `SPEC-hoc-sinh-nhieu-lop.md` · Constraints: `CONSTRAINTS.md`

---

## Task 1: Viết & áp dụng Migration SQL (`ghi_danh`, `ma_hs`, `don_gia`, RLS, RPCs, tắt `phu_huynh`)

**Description:** Tạo migration mở rộng schema hỗ trợ 1 học sinh nhiều lớp qua bảng `ghi_danh`, thêm `ma_hs` & `don_gia` cố định trên `hoc_sinh`, khoá tài khoản `phu_huynh` cũ, cập nhật RLS và các hàm `phieu_danh_gia`, `gui_danh_gia`, `xoa_lop`, đồng thời bổ sung RPC `gop_hoc_sinh`.

**Acceptance criteria:**
- [x] Chạy migration trên DB local Docker chứa bản clone 128 học sinh thành công, 0 lỗi, 0 dòng dữ liệu bị mất (`ghi_danh` có đúng 128 dòng, 100% học sinh có `ma_hs` duy nhất dạng `HSxxx` và `don_gia` khớp giá trước migration).
- [x] Mọi `UPDATE` đều có `WHERE`; `ghi_danh`, `hoc_sinh_ma_seq` và `gop_hoc_sinh` có đủ `GRANT`/`REVOKE` tường minh cho `authenticated` và `service_role`; `nhat_ky` ghi được thao tác trên `ghi_danh`.
- [x] Tài khoản `phu_huynh` bị `hoat_dong = false`; `gop_hoc_sinh` gộp sạch điểm danh/sticker/gói/ghi danh về 1 `id` và từ chối nếu gói chồng tháng hoặc nằm trong tháng đã chốt sổ; `xoa_lop` giữ lại học sinh nếu còn lớp khác.

**Verification:**
- [x] Áp migration lên DB local (`supabase_db_msnhung-local`) và kiểm tra đối chiếu SQL 128 học sinh, quyền `authenticated`/`tro_giang`, thử nghiệm `xoa_lop` và `gop_hoc_sinh` (kèm rollback dữ liệu thử).

**Dependencies:** None

**Files likely touched:**
- `supabase/migrations/20261123000000_hoc_sinh_nhieu_lop.sql` (new)

**Estimated scope:** Medium (1 file SQL lớn)

---

## Task 2: Cập nhật Edge Function `tai-khoan` & kiểu dữ liệu cốt lõi `src/supabase.ts`

**Description:** Gỡ quyền tạo/đặt lại tài khoản `phu_huynh` khỏi Edge Function `tai-khoan`, đồng thời cập nhật TypeScript interfaces trong `src/supabase.ts` (`HocSinh`, `GhiDanh`) khớp schema sau Task 1.

**Acceptance criteria:**
- [x] Edge Function `tai-khoan` trả về `403` nếu có request cố tạo hoặc đặt lại mật khẩu vai trò `phu_huynh`; tạo/đặt lại `giao_vien` và `tro_giang` hoạt động bình thường.
- [x] Interface `HocSinh` (`ma_hs`, `don_gia`, bỏ `lop_id`) và `GhiDanh` khớp 100% với bảng DB sau Task 1.

**Verification:**
- [x] Chạy thử `npx supabase functions serve --no-verify-jwt` và kiểm tra request Edge Function `tai-khoan`.
- [x] Chạy `npx tsc --noEmit` để xác định danh sách chính xác các vị trí còn tham chiếu `HocSinh.lop_id` cần xử lý ở Phase 2–3.

**Dependencies:** Task 1

**Files likely touched:**
- `supabase/functions/tai-khoan/index.ts`
- `src/supabase.ts`

**Estimated scope:** Small (2 files)

---

## Checkpoint 1: Sau Task 1–2
- [x] DB local chạy ổn định với đủ 19 migrations + 128 học sinh clone giữ nguyên dữ liệu thật.
- [x] RLS, `xoa_lop`, `gop_hoc_sinh`, `phieu_danh_gia`, `gui_danh_gia` và Edge Function `tai-khoan` đã xác minh pass.

---

## Task 3: Mở rộng hàm tính học phí đa lớp trong `src/hoc-phi.ts` + Unit Test

**Description:** Giữ nguyên toàn bộ hàm tính tiền cũ trong `src/hoc-phi.ts`, bổ sung các hàm thuần cho học sinh nhiều lớp (`demBuoiDuKienNhieuLop`, `tinhTrangGoiNhieuLop`, `tienDuGoiNhieuLop`, `duConLaiNhieuLop`) và viết unit test đầy đủ.

**Acceptance criteria:**
- [x] Toàn bộ 29 unit test cũ trong `src/hoc-phi.test.ts` pass không cần sửa.
- [x] Unit test mới bao phủ: học 2 lớp khác thứ (T2 + T4), học 2 lớp cùng thứ (sáng + chiều T7 = 2 buổi), vào lớp 2 giữa tháng, nghỉ ở lớp A nhưng có buổi phụ ở lớp B không bù chéo nhau, sắp hết gói tính tổng buổi còn lại của cả 2 lớp.

**Verification:**
- [x] Tests pass: `npx vitest run src/hoc-phi.test.ts`

**Dependencies:** Task 2

**Files likely touched:**
- `src/hoc-phi.ts`
- `src/hoc-phi.test.ts`

**Estimated scope:** Small (2 files)

---

## Task 4: Cập nhật nạp dữ liệu tháng (`src/du-lieu.ts`) & Xuất Excel theo học sinh (`src/xuat-excel.ts`)

**Description:** Nạp thêm `ghi_danh` vào `taiDuLieuThang`, xuất 1 dòng/1 học sinh trên 1 sheet `Học phí` duy nhất (kèm `Mã HS`, `Các lớp`, `Đơn giá/buổi`), cập nhật `Tổng hợp`, `Điểm danh`, `Sổ thu`, `Công nợ` và viết unit test kiểm tra công thức Excel không cộng trùng.

**Acceptance criteria:**
- [x] Học sinh học 2 lớp chỉ xuất hiện đúng 1 dòng trên `Học phí`, `Điểm danh`, `Công nợ`; tổng tiền ở `Tổng hợp` khớp chính xác với `tongCong(d)`, tuyệt đối không cộng trùng.
- [x] Mọi cột tổng & `Còn nợ`/`Trạng thái` dùng công thức Excel hợp lệ (không lỗi `circular reference` khi bảng rỗng).

**Verification:**
- [x] Tests pass: `npx vitest run src/xuat-excel.test.ts`

**Dependencies:** Task 3

**Files likely touched:**
- `src/du-lieu.ts`
- `src/xuat-excel.ts`
- `src/xuat-excel.test.ts` (new)

**Estimated scope:** Medium (3 files)

---

## Task 5: Cập nhật Import Excel (`src/import-excel.ts`, `src/nhap-du-lieu.ts`) + Unit Test

**Description:** Thêm cột `Mã HS` và đổi nhãn `Đơn giá riêng` → `Đơn giá/buổi` trong file mẫu Excel; nhận diện cùng 1 học sinh theo `Mã HS` hoặc `Họ tên + SĐT PH` để gom nhiều lớp về 1 `hoc_sinh` (trạng thái `Thêm lớp`); bỏ gọi tạo tài khoản phụ huynh khi nhập dữ liệu.

**Acceptance criteria:**
- [x] 2 dòng Excel cùng `Họ tên + SĐT` (hoặc cùng `Mã HS`) ở 2 lớp khác nhau được gom thành 1 `hoc_sinh` + 2 `ghi_danh`.
- [x] 2 dòng cùng `Họ tên` nhưng khác `SĐT` được tách thành 2 `hoc_sinh` riêng; trùng tên không có SĐT/Mã HS với em đã có sẽ báo lỗi yêu cầu bổ sung để tránh gộp nhầm.
- [x] Import lại cùng file sau khi đã nhập ra 0 dòng mới; không gọi Edge Function tạo tài khoản phụ huynh.

**Verification:**
- [x] Tests pass: `npx vitest run src/import-excel.test.ts`

**Dependencies:** Task 2

**Files likely touched:**
- `src/import-excel.ts`
- `src/import-excel.test.ts`
- `src/nhap-du-lieu.ts`

**Estimated scope:** Medium (3 files)

---

## Checkpoint 2: Sau Task 3–5
- [x] Chạy `npm test` — 100% unit test (toàn bộ 52 test cũ + tất cả test mới ở Task 3, 4, 5) pass.

---

## Task 6: Tắt cổng & tài khoản phụ huynh trên UI điều hướng

**Description:** Gỡ luồng cổng phụ huynh khỏi `App.tsx`, bỏ vai trò `Phụ huynh` khỏi tạo/lọc tài khoản ở `TaiKhoan.tsx`, và bỏ mục video 8 dành cho phụ huynh ở `HuongDan.tsx`.

**Acceptance criteria:**
- [x] Trang Tài khoản chỉ quản lý `Quản trị`, `Giáo viên`, `Trợ giảng`; ẩn tài khoản `phu_huynh` đã vô hiệu hoá và không thể tạo/đặt lại MK phụ huynh.
- [x] Trang Hướng dẫn hiển thị 7 video cho giáo viên/admin, 2 video cho trợ giảng.

**Verification:**
- [x] Kiểm tra không còn luồng tạo/đăng nhập phụ huynh trong `App.tsx`, `TaiKhoan.tsx`, `HuongDan.tsx`.

**Dependencies:** Task 2

**Files likely touched:**
- `src/App.tsx`
- `src/trang/TaiKhoan.tsx`
- `src/trang/HuongDan.tsx`

**Estimated scope:** Small (3 files)

---

## Task 7: Cập nhật trang Lớp (`src/trang/LopHoc.tsx`)

**Description:** Hiển thị danh sách học sinh theo `ghi_danh` (kèm `ma_hs` và tag `+N lớp`), cập nhật form Thêm/Sửa chọn 1 hoặc nhiều lớp + `Đơn giá/buổi` cố định, tự gộp khi trùng, thêm Modal **Gộp học sinh** (`gop_hoc_sinh`), và xử lý Ngừng/Xoá theo `ghi_danh`.

**Acceptance criteria:**
- [x] Tạo lớp A, lớp B → thêm em A chọn luôn cả 2 lớp → chỉ sinh 1 `hoc_sinh` + 2 `ghi_danh`, hiện ở cả 2 lớp kèm cùng 1 chip `⭐ tổng sticker`.
- [x] Thêm em A lần 2 ở lớp C (trùng tên + SĐT) → tự gộp thêm `ghi_danh` lớp C; trùng tên khác/thiếu SĐT → hỏi xác nhận Gộp hay Tạo mới.
- [x] Công cụ **Gộp học sinh** gộp 2 hồ sơ cũ thành công và dọn avatar thừa trên Storage.

**Verification:**
- [x] Manual check: kiểm thử trực tiếp trên `npm run dev` (412px) kết nối DB local.

**Dependencies:** Task 2, Task 8

**Files likely touched:**
- `src/trang/LopHoc.tsx`

**Estimated scope:** Medium (1 file)

---

## Task 8: Cập nhật Điểm danh (`src/trang/DiemDanh.tsx`) & Chi tiết học sinh (`src/trang/HocSinhChiTiet.tsx`)

**Description:** Nạp danh sách lớp theo `ghi_danh` ở màn Điểm danh; cập nhật `HocSinhChiTiet` nhận nhiều lớp, gộp lịch tháng mọi lớp (chạm ngày hiện rõ tên lớp), tính tiền & gói theo `hoc_sinh.don_gia` + hàm đa lớp, giữ nguyên Zalo/SMS/Sao chép tin nhắn và bỏ chế độ `chiXem`/đặt lại MK phụ huynh.

**Acceptance criteria:**
- [x] Điểm danh em A ở lớp T2 và lớp T4 đều ghi vào cùng 1 `hoc_sinh_id`; tổng sticker cộng dồn chuẩn ngay lúc chấm.
- [x] Màn `HocSinhChiTiet` hiển thị đủ buổi T2 & T4 trên cùng 1 lưới lịch tháng; chạm ô hiện đúng tên lớp; tổng buổi, số buổi chưa bù, tổng sticker và tiền gói 1/2/3 tháng đều gộp chuẩn.

**Verification:**
- [x] Manual check: kiểm thử trực tiếp trên `npm run dev` (412px) kết nối DB local.

**Dependencies:** Task 3

**Files likely touched:**
- `src/trang/DiemDanh.tsx`
- `src/trang/HocSinhChiTiet.tsx`

**Estimated scope:** Medium (2 files)

---

## Task 9: Cập nhật Học phí (`HocPhi.tsx`), Đánh giá (`DanhGia.tsx`) & Import UI (`ImportExcel.tsx`)

**Description:** Đổi `HocPhi.tsx` sang danh sách phẳng 1 dòng/học sinh kèm tìm tên & lọc lớp (và thêm `ghi_danh` vào `saoLuuToanBo`); cập nhật `DanhGia.tsx` dùng `ghi_danh` và đếm theo học sinh duy nhất; cập nhật `ImportExcel.tsx` hiển thị `Thêm lớp` và bỏ thông báo tài khoản PH.

**Acceptance criteria:**
- [x] Tab Học phí: tổng phải thu / đã thu / còn phải thu không cộng trùng; lọc lớp và xuất Excel theo học sinh hoạt động đúng.
- [x] Trang Đánh giá: em học 2 lớp gửi 1 phiếu thì cả 2 lớp đều ghi nhận đã gửi.
- [x] Trang Import Excel: tải mẫu có `Mã HS`, xem trước hiện `Thêm lớp`, nhập xong không gọi tạo tài khoản PH.

**Verification:**
- [x] Type check & build: `npx tsc --noEmit` và `npm run build` pass sạch.

**Dependencies:** Task 4, Task 5, Task 8

**Files likely touched:**
- `src/trang/HocPhi.tsx`
- `src/trang/DanhGia.tsx`
- `src/trang/ImportExcel.tsx`

**Estimated scope:** Medium (3 files)

---

## Checkpoint 3: Sau Task 6–9
- [x] `npx tsc --noEmit` sạch 0 lỗi, `npm run build` thành công, `npm test` pass 100%.
- [x] Kiểm thử trực quan trên trình duyệt 412px (`npm run dev` nối DB local): luồng tạo lớp → thêm em học 2 lớp → điểm danh 2 buổi → sticker → thu gói 1/2/3 tháng → tab Học phí → xuất Excel → gộp 2 em trùng → đánh giá 1 phiếu.

---

## Task 10: Cập nhật Scripts (`tao-demo.mjs`, `lam-moi.mjs`) & Tài liệu (`docs/YEU-CAU.md`)

**Description:** Thêm `ghi_danh` vào `lam-moi.mjs`, cập nhật `tao-demo.mjs` tạo dữ liệu demo theo `ghi_danh` & `don_gia` (có em học 2 lớp, bỏ tài khoản phụ huynh), và ghi các quyết định đã chốt vào `docs/YEU-CAU.md`.

**Acceptance criteria:**
- [x] `lam-moi.mjs` xoá đủ bảng `ghi_danh` đúng thứ tự FK; `tao-demo.mjs` khớp schema mới.
- [x] `docs/YEU-CAU.md` ghi nhận đầy đủ các quyết định mới của Spec.

**Verification:**
- [x] Kiểm tra thủ công khớp schema & toàn bộ bảng trong DB.

**Dependencies:** Task 1, Task 9

**Files likely touched:**
- `scripts/tao-demo.mjs`
- `scripts/lam-moi.mjs`
- `docs/YEU-CAU.md`

**Estimated scope:** Small (3 files)

---

## Task 11: Cập nhật bộ Test E2E & API (`dem.mjs`, `don-test.mjs`, `all.py`, `api.py`)

**Description:** Bổ sung `ghi_danh` vào `dem.mjs`/`don-test.mjs`; sửa đường dẫn `.env` và kiểm RLS/RPC mới (`ghi_danh`, `gop_hoc_sinh`, `xoa_lop`, từ chối `phu_huynh`) trong `api.py`; cập nhật `all.py` kiểm thử E2E 412px luồng học sinh học nhiều lớp, tự gộp trùng, xuất Excel theo học sinh và đánh giá 1 phiếu.

**Acceptance criteria:**
- [x] Toàn bộ test unit + `tsc` + `build` + E2E Chromium 412px + API/RLS chạy trên DB local Docker đều `PASS`.
- [x] Số dòng mọi bảng trước và sau khi chạy E2E/API khớp nhau 100%.

**Verification:**
- [x] Chạy đầy đủ: `npm test`, `npx tsc --noEmit`, `npm run build`, và kiểm E2E + API trên DB local (với `NODE_OPTIONS="--experimental-websocket"` cho Node 20).

**Dependencies:** Task 9

**Files likely touched:**
- `tests/e2e/dem.mjs`
- `tests/e2e/don-test.mjs`
- `tests/e2e/all.py`
- `tests/e2e/api.py`

**Estimated scope:** Medium (4 files)

---

## Checkpoint 4: Complete
- [x] Toàn bộ Acceptance Criteria trong `SPEC-hoc-sinh-nhieu-lop.md` và `CONSTRAINTS.md` đạt 100%.
- [x] Nhánh `main` và database thật trên Supabase Cloud hoàn toàn nguyên vẹn.
- [x] Sẵn sàng cho người dùng test thủ công trên máy trước khi quyết định merge/deploy.
