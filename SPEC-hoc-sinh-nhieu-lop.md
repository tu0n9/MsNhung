# Spec Delta: Học sinh học nhiều lớp, đơn giá cố định theo học sinh & bỏ đăng nhập phụ huynh

Status: approved

## 1. Objective

Chuyển mô hình dữ liệu và luồng nghiệp vụ với phạm vi chỉnh sửa tối thiểu để:
1. Một học sinh (`hoc_sinh.id` + mã `HSxxx`) có thể ghi danh vào nhiều lớp (qua bảng trung gian `ghi_danh`), chấm dứt tình trạng 1 em học nhiều lớp bị tạo thành 2 học sinh khác nhau.
2. Tính học phí theo **1 đơn giá/buổi cố định của từng học sinh** (`hoc_sinh.don_gia`), đóng **1 gói 1/2/3 tháng** cho tổng buổi của tất cả các lớp em đang học.
3. Gộp điểm danh, lịch tháng, sticker, gói học phí, xuất Excel (1 dòng/học sinh) và phiếu đánh giá (1 phiếu/em/tháng) về đúng 1 hồ sơ học sinh duy nhất.
4. Bỏ tính năng tài khoản & cổng đăng nhập phụ huynh, nhưng giữ nguyên Tên & SĐT phụ huynh để liên hệ Zalo/SMS, xuất sổ Công nợ và phân biệt học sinh trùng tên.

Tham chiếu nguồn sự thật gốc: `docs/YEU-CAU.md`, `docs/KE-HOACH.md`, `CLAUDE.md`.

## 2. Current Behavior (As-Is) vs New Behavior (To-Be)

| Hạng mục | Hành vi cũ (As-Is) | Hành vi mới (To-Be) |
|---|---|---|
| **Quan hệ Học sinh – Lớp** | `hoc_sinh.lop_id` (1 học sinh chỉ thuộc 1 lớp); học 2 lớp buộc tạo 2 dòng `hoc_sinh` khác nhau. | Thêm bảng `ghi_danh (id, hoc_sinh_id, lop_id, ngay_vao, trang_thai, tao_luc)` với `UNIQUE(hoc_sinh_id, lop_id)`. Bỏ `hoc_sinh.lop_id`. Thêm `hoc_sinh.ma_hs` tự sinh (`HS001`…). |
| **Đơn giá học phí** | Mặc định lấy `lop.don_gia`, tuỳ chọn ghi đè bằng `hoc_sinh.don_gia_rieng`. | Mỗi học sinh có **1 đơn giá cố định** `hoc_sinh.don_gia` (số nguyên VND ≥ 0) áp cho mọi lớp em học. `lop.don_gia` giữ lại làm giá gợi ý khi tạo học sinh mới. Dữ liệu cũ kế thừa `coalesce(don_gia_rieng, lop.don_gia)`. |
| **Luồng thêm học sinh** | Tạo lớp → Thêm học sinh chọn đúng 1 lớp; không kiểm trùng. | Tạo lớp trước → Thêm học sinh chọn được **1 hoặc nhiều lớp** ngay từ đầu + đơn giá cố định. Nếu **trùng** học sinh đã có (`Họ tên + SĐT PH`, hoặc trùng `Họ tên` được cô xác nhận), **gộp vào đúng 1 `hoc_sinh`** (chỉ thêm `ghi_danh` lớp mới), không tạo hồ sơ thứ 2. |
| **Gộp dữ liệu cũ bị trùng** | Không có. | Thêm công cụ **Gộp học sinh** (chỉ `admin`/`giao_vien`, RPC `gop_hoc_sinh`) gộp 2 hồ sơ cũ thành 1 trong 1 transaction (có xem trước). |
| **Điểm danh & Lịch tháng** | Điểm danh theo `hoc_sinh.lop_id`; chi tiết học sinh chỉ hiện lịch 1 lớp → học T2 & T4 bị chia đôi. | Điểm danh lấy học sinh theo `ghi_danh (lop_id, dang_hoc, ngay_vao <= ngay)`. Chi tiết học sinh nạp buổi của **tất cả các lớp em ghi danh** vào 1 lịch tháng duy nhất (chạm ngày hiện rõ tên lớp từng buổi); `demChuaBu` gộp chung 1 người. |
| **Sticker** | Chia đôi theo 2 `hoc_sinh_id`. | View `tong_sticker`, `diem_danh`, `sticker_cong_tru` giữ nguyên hoàn toàn — nhờ chỉ còn 1 `hoc_sinh_id`, tổng sticker tự động gộp chuẩn trên mọi lớp. |
| **Gói học & Tiền dư** | `demBuoiDuKien`, `tinhTrangGoi`, `duConLai` chỉ tính trên 1 `lop.lich` và buổi của 1 lớp. | `goi_hoc`, `phieu_thu`, `chi_phi` giữ nguyên bảng & FK `hoc_sinh_id`. Cộng buổi dự kiến, buổi còn lại và tiền dư lớp nghỉ trên **tất cả `ghi_danh` của em** (tôn trọng `ngay_vao` và `max(0, nghi - phu)` theo từng lớp). |
| **Tab Học phí & Xuất Excel** | Nhóm theo từng lớp (mỗi lớp 1 thẻ / 1 sheet Excel) rồi `SUM` lại → học 2 lớp sẽ bị cộng trùng. | Hiển thị & xuất Excel **theo từng học sinh** (1 em = 1 dòng duy nhất, kèm cột *Mã HS*, *Các lớp*, *Đơn giá*, *Số buổi*, *Học phí*, *Điều chỉnh*, *Nợ kỳ trước*, *Đã thu*, *Còn nợ*, *Trạng thái*, *Gói*, *Phụ huynh*, *SĐT*). Tab Học phí có ô tìm tên + lọc theo lớp. |
| **Import Excel** | Trùng theo `(Họ tên + Lớp + SĐT)`; tự gọi tạo tài khoản phụ huynh. | File mẫu thêm cột `Mã HS` (điền sẵn cho em đang học). Nhận diện cùng 1 em theo `Mã HS` hoặc `Họ tên + SĐT` → dòng khác lớp chỉ **thêm `ghi_danh`**, không tạo học sinh thứ 2. Bỏ gọi tạo tài khoản phụ huynh. |
| **Đánh giá cuối tháng** | `danh_gia` có `unique(thang, hoc_sinh_id)` (nhưng 2 hồ sơ nên gửi được 2 phiếu). | Giữ nguyên `unique(thang, hoc_sinh_id)` → đúng **1 phiếu/em/tháng**. `phieu_danh_gia` & `gui_danh_gia` tra lớp qua `ghi_danh`; em đã gửi ở lớp 1 tự đánh dấu đã gửi ở mọi lớp khác. |
| **Ngừng học & Xoá lớp** | `hoc_sinh.trang_thai = 'ngung'`; `xoa_lop` xoá toàn bộ `hoc_sinh` thuộc lớp đó. | Ngừng/Học lại trên từng lớp đổi `ghi_danh.trang_thai` của lớp đó (không ảnh hưởng lớp khác). `xoa_lop` chỉ xoá `ghi_danh` & buổi của lớp bị xoá; **giữ nguyên `hoc_sinh`** (và gói/sticker/avatar) nếu em còn học lớp khác. |
| **Phụ huynh** | Có tài khoản `phu_huynh`, cổng `PhuHuynh.tsx`, nút đặt lại MK phụ huynh, video 8. | **Tắt hoàn toàn đăng nhập & tạo tài khoản phụ huynh** (khoá `hoat_dong = false` tài khoản `phu_huynh` cũ, bỏ khỏi Edge Function `tai-khoan`, bỏ route `PhuHuynh`, bỏ nút đặt lại MK PH). **Vẫn giữ** Tên PH, SĐT PH, nút *Mở Zalo PH*, *Mở nhóm Zalo*, *Gửi SMS*, *Sao chép tin nhắn*. |

## 3. Tác động chi tiết tới Hệ thống & Phần giữ nguyên

### A. Những phần giữ nguyên (không đập đi xây lại)
- **Database:** giữ nguyên cấu trúc bảng `lop`, `buoi_hoc`, `diem_danh`, `tro_giang_buoi`, `anh_buoi`, `sticker_cong_tru`, view `tong_sticker`, `goi_hoc`, `phieu_thu`, `chi_phi`, `khoa_so`, `nhat_ky_chot_so`, `danh_gia`, `link_danh_gia`, `tom_tat_danh_gia`, `nhat_ky`, các trigger `khoa_so`, `goi_khong_chong`, `lop_nghi_xoa`.
- **Logic thuần & UI:** giữ nguyên lõi tính tiền trong `src/hoc-phi.ts` (`phaiThuTheoThang`, `daThuTheoThang`, `tongHopHocSinh`, `trangThaiThang`, `tongGoi`, `conNoGoi`, `demChuaBu`, `tinNhanPhuHuynh`…), `src/diem-danh-thang.ts`, `src/gio-hoc.ts`, `src/danh-gia.ts`, `src/trang/ChiPhi.tsx`, `src/trang/NhatKy.tsx`, `src/trang/DangNhap.tsx`, `src/trang/DoiMatKhau.tsx`, `src/giao-dien.ts`.

### B. Tác động tới Database (Migration mới)
1. **Thêm cột trên `hoc_sinh`:**
   - `ma_hs text unique` dùng sequence `hoc_sinh_ma_seq` (`'HS' || lpad(nextval(...)::text, 3, '0')`) tự sinh cho cả 128 em cũ và mọi em tạo mới.
   - `don_gia integer not null check (don_gia >= 0)` backfill từ `coalesce(h.don_gia_rieng, l.don_gia)` trước khi drop `lop_id`.
2. **Tạo bảng `ghi_danh`:**
   - Cột: `id uuid primary key default gen_random_uuid()`, `hoc_sinh_id uuid not null references hoc_sinh`, `lop_id uuid not null references lop`, `ngay_vao date not null default current_date`, `trang_thai text not null default 'dang_hoc' check (trang_thai in ('dang_hoc', 'ngung'))`, `tao_luc timestamptz not null default now()`, `unique (hoc_sinh_id, lop_id)`.
   - Index trên `(hoc_sinh_id)` và `(lop_id)`.
   - Backfill 100% từ `(id, lop_id, ngay_vao, trang_thai)` của `hoc_sinh` hiện có.
   - `GRANT select, insert, update, delete on ghi_danh to authenticated; grant all on ghi_danh to service_role;` + `GRANT usage, select on sequence hoc_sinh_ma_seq to authenticated, service_role;`.
   - RLS `ghi_danh`: `select` cho `la_nhan_vien()`, `insert/update/delete` cho `la_quan_ly()`.
   - Gắn trigger `nhat_ky` trên `ghi_danh` (ghi thêm/sửa/xoá ghi danh với `doi_tuong = 'Tên HS · Tên lớp'`).
3. **Cập nhật cột & tài khoản cũ an toàn:**
   - `UPDATE tai_khoan SET hoat_dong = false WHERE vai_tro = 'phu_huynh';`
   - Gỡ nhánh `phu_huynh_id = auth.uid()` trong RLS của `lop`, `hoc_sinh`, `buoi_hoc`, `diem_danh`, `anh_buoi`, `goi_hoc`, `phieu_thu`, `sticker_cong_tru`, `storage.objects` (chỉ còn `la_nhan_vien()` / `la_quan_ly()`).
   - `ALTER TABLE hoc_sinh DROP COLUMN lop_id;` (giữ nguyên `ten_phu_huynh`, `sdt_phu_huynh`, `phu_huynh_id`, `don_gia_rieng` để bảo toàn dữ liệu lịch sử).
4. **Cập nhật / Thêm RPC:**
   - `phieu_danh_gia(p_ma)` & `gui_danh_gia(...)`: đọc/kiểm học sinh theo lớp qua `ghi_danh` (`gd.trang_thai = 'dang_hoc'`).
   - `xoa_lop(p_lop, p_ten)`: chỉ xoá `ghi_danh` và dữ liệu buổi của `p_lop`; chỉ xoá `hoc_sinh` (+ gói/phiếu thu/sticker/avatar) với các em **không còn `ghi_danh` ở lớp nào khác**.
   - Thêm `gop_hoc_sinh(p_giu uuid, p_bo uuid) returns text`: `security definer`, chỉ `la_quan_ly()`, chạy trong 1 transaction, gộp `ghi_danh`, `diem_danh`, `sticker_cong_tru`, `goi_hoc`, `chi_phi`, `danh_gia`, cộng `sticker_dau_ky`, điền bù thông tin trống, xoá `p_bo`, trả về `avatar` thừa để client xoá Storage.

### C. Tác động tới API / Edge Function / Logic thuần
- `supabase/functions/tai-khoan/index.ts`: bỏ `'phu_huynh'` khỏi `QUYEN_TAO` và `QUYEN_DAT_LAI`.
- `src/supabase.ts`: cập nhật `HocSinh` (thêm `ma_hs`, `don_gia`; bỏ `lop_id`), thêm `GhiDanh`.
- `src/hoc-phi.ts`: giữ toàn bộ hàm cũ, thêm `demBuoiDuKienNhieuLop`, `tinhTrangGoiNhieuLop`, `tienDuGoiNhieuLop`, `duConLaiNhieuLop`.
- `src/du-lieu.ts`: nạp thêm `ghi_danh`, gắn danh sách `ghiDanh` + tên lớp vào từng `DongHs` (mỗi `hoc_sinh` đúng 1 dòng).
- `src/import-excel.ts` & `src/nhap-du-lieu.ts`: thêm cột `Mã HS`, đổi nhãn `Đơn giá riêng` → `Đơn giá/buổi`, nhận diện cùng 1 em theo `Mã HS` hoặc `Họ tên + SĐT PH`, hỗ trợ trạng thái `Thêm lớp`, bỏ gọi `goiTaiKhoan`.
- `src/xuat-excel.ts`: gộp các sheet lớp thành 1 sheet `Học phí` (1 học sinh = 1 dòng, công thức động, có cột `Mã HS`, `Các lớp`, `Đơn giá/buổi`), cập nhật `Tổng hợp`, `Điểm danh`, `Sổ thu`, `Công nợ`.

### D. Tác động tới UI
- `src/App.tsx`: bỏ route `PhuHuynh` và nhánh menu `phu_huynh`.
- `src/trang/LopHoc.tsx`: hiển thị theo `ghi_danh` (kèm `ma_hs` và tag `+N lớp`), form chọn nhiều lớp (`Select mode="multiple"`), ô `Đơn giá/buổi` (gợi ý theo lớp đầu tiên), bỏ tạo tài khoản PH, tự gộp khi trùng tên + SĐT (hoặc hỏi khi chỉ trùng tên), nút & Modal **Gộp học sinh**, Ngừng/Xoá theo `ghi_danh`.
- `src/trang/DiemDanh.tsx`: nạp học sinh theo `ghi_danh`, xác định học bù ngoài lớp theo `ghi_danh`, thêm `ma_hs` ở dropdown học bù khi cần.
- `src/trang/HocSinhChiTiet.tsx`: hiện `ma_hs`, tất cả lớp đang học & đơn giá cố định; nạp `buoi_hoc` mọi lớp em ghi danh vào `LuoiThang` (chạm ngày hiện tên lớp); `ThuTien` dùng hàm đa lớp & `hs.don_gia`; bỏ `chiXem` & nút đặt lại MK phụ huynh; giữ nút Zalo/SMS/Sao chép tin nhắn.
- `src/trang/HocPhi.tsx`: danh sách phẳng 1 dòng/học sinh kèm tìm tên & lọc lớp (dùng chung cho mọi tab lọc), cập nhật `saoLuuToanBo` thêm `ghi_danh`.
- `src/trang/DanhGia.tsx`: tính danh sách chưa gửi qua `ghi_danh`, đếm theo học sinh duy nhất.
- `src/trang/ImportExcel.tsx`: nạp `ghi_danh`, hiện trạng thái `Thêm lớp`, bỏ thông báo tạo tài khoản PH.
- `src/trang/TaiKhoan.tsx` & `src/trang/HuongDan.tsx`: bỏ vai trò `Phụ huynh` và video số 8.

## 4. Các trường hợp biên (Edge Cases)

1. **Học 2 lớp cùng 1 thứ (khác giờ, VD sáng T7 + chiều T7):** `demBuoiDuKienNhieuLop` cộng tổng theo từng lớp (ra 2 buổi, không gộp theo `Set` ngày); `gopTheoNgay` trên Excel ghi `C+C` và công thức đếm đúng 2 buổi; `LuoiThang` hiện đủ cả 2 buổi khi chạm ô.
2. **Vào lớp 2 giữa tháng (lệch `ngay_vao`):** Gói tháng tính đủ buổi lớp cũ + các buổi từ `ngay_vao` của lớp mới; `LuoiThang` không báo "chưa điểm danh" cho buổi lớp mới trước `ngay_vao`.
3. **Ngừng 1 lớp, giữ lớp kia:** Đổi `ghi_danh` của lớp bị ngừng sang `ngung` → ẩn khỏi điểm danh lớp đó, không tính buổi vào gói mới, không báo "chưa điểm danh" sau đó; giữ lịch sử điểm danh cũ & tiền dư lớp nghỉ đã phát sinh.
4. **Gộp hồ sơ cũ bị chồng gói tháng hoặc dính tháng đã chốt sổ:** Nếu 2 hồ sơ cùng có gói phủ chung tháng hoặc có dữ liệu ở tháng đã chốt sổ → `gop_hoc_sinh` từ chối trong transaction và báo lỗi rõ ràng để giáo viên xử lý gói/mở khoá trước. Nếu cùng `buoi_id` có 2 dòng điểm danh → cộng sticker và ưu tiên `co_mat`/`hoc_bu` hơn `vang`.
5. **Hai học sinh khác nhau tình cờ trùng họ tên:** Khác SĐT PH → tách thành 2 `hoc_sinh` riêng (`ma_hs` khác nhau); cùng trống SĐT → nhập tay hỏi xác nhận gộp hay tạo mới, Import Excel báo yêu cầu điền `Mã HS` hoặc `SĐT PH`.
6. **Xoá lớp (`xoa_lop`) chứa em học nhiều lớp:** Chỉ xoá buổi & `ghi_danh` của lớp bị xoá; giữ nguyên hồ sơ `hoc_sinh`, sticker, gói học ở các lớp còn lại (`khoa_so` vẫn chặn nếu lớp bị xoá có buổi ở tháng đã chốt).
7. **Đơn giá `0` (miễn phí) vs để trống:** Giữ nguyên quy tắc 2026-11-21 — ô tiền xoá trắng ra trống, nhập `0` hiện cảnh báo màu đỏ *"0 = em học miễn phí"*, vẫn cho lưu `don_gia = 0`.
8. **Gỡ hết lớp trong form Sửa học sinh:** Không cho lưu nếu không chọn ít nhất 1 lớp; muốn ngừng hẳn thì đổi trạng thái lớp cuối sang `Ngừng`.

## 5. Success Criteria

**Phải đạt:**
- [ ] Migration chạy sạch trên DB local Docker với bản clone thật (13 lớp, 128 học sinh, 66 buổi, 95 điểm danh, 52 nhật ký), không mất dòng dữ liệu nào, mọi em đều có `ma_hs` duy nhất và `don_gia` khớp giá trước migration.
- [ ] Thêm học sinh 2 lớp hoặc trùng vào lớp 2 chỉ tạo 1 `hoc_sinh` + 2 `ghi_danh`; điểm danh 2 lớp đổ về 1 lịch tháng, 1 tổng sticker, 1 gói học phí 1/2/3 tháng, 1 phiếu đánh giá/tháng.
- [ ] `gop_hoc_sinh` gộp 2 hồ sơ trùng giữ đủ điểm danh, sticker, gói học, lịch sử lớp và xoá hồ sơ thừa.
- [ ] Tab Học phí & Xuất Excel hiển thị 1 dòng/học sinh, công thức Excel tự tính đúng, không cộng trùng doanh thu.
- [ ] Tài khoản `phu_huynh` không thể đăng nhập và không tạo mới được; Tên & SĐT PH vẫn giữ đầy đủ để nhắn Zalo/SMS và Công nợ.
- [ ] `npx tsc --noEmit`, `npm run build`, `npm test` (cũ + mới) và E2E/API local đều pass.

**Không được làm vỡ:**
- [ ] Nhánh `main` và DB thật trên Supabase Cloud không bị chạm tới.
- [ ] Lương trợ giảng theo ca (`luong_tro_giang`), lớp dạy gộp (`NhomBuoi`), lớp nghỉ xoá điểm danh (`lop_nghi_xoa`), cộng/trừ sticker ngoài buổi, nhật ký thao tác (`nhat_ky`), AI tóm tắt đánh giá (`tom-tat-danh-gia`) hoạt động nguyên vẹn.

## 6. Boundaries

- **Always:** Chỉ làm trên nhánh `feat/hoc-sinh-nhieu-lop` và DB local Docker; code/comment/UI tiếng Việt; tiền nguyên VND; `GRANT` tường minh + `WHERE` cho mọi `UPDATE`; xác minh sau từng checkpoint.
- **Ask first:** Bất kỳ thao tác nào liên quan tới `main`, DB thật trên Supabase Cloud, deploy Edge Function lên Cloud, hoặc xoá cứng cột/dữ liệu lịch sử.
- **Never:** Không sửa lỏng/xoá test để pass, không `@ts-ignore` hoặc `catch {}` rỗng, không commit `.env` hay `sao-luu-may/`.

## 7. Out of Scope (Deferred) & Open Questions

- **Đơn giá cố định & giá riêng ca đặc biệt (bổ sung 2026-11-22, migration `20261124000000_gop_hs_don_gia_rieng.sql`):**
   - Bổ sung `ghi_danh.don_gia_rieng int check (don_gia_rieng >= 0)` (nullable, mặc định lấy `hoc_sinh.don_gia`) và `goi_hoc.tien_thang jsonb` (lưu tổng học phí từng tháng khi học sinh có lớp áp đơn giá riêng).
   - Gộp tự động 128 hồ sơ cũ trùng tên thành **65 học sinh** (`127` lượt ghi danh) và áp bảng đơn giá chuẩn trung tâm; riêng các ca 1-1 đặc biệt khác thời lượng (vd `Minh Trang`: `500.000đ` / `1.000.000đ`, `Ngọc Minh`: `400.000đ` / `1.000.000đ`) gắn `ghi_danh.don_gia_rieng = 1.000.000`.
- **Out of Scope:** Không tách nhiều gói học phí theo từng lớp cho 1 học sinh; không sửa workflow `sao-luu` / `don-anh` hay giao diện theme hồng kim; không quay lại video hướng dẫn.
- **Open Questions:** Không còn.
