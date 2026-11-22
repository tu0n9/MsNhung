# Báo cáo rà soát lỗi & kiểm thử TDD — Nhánh `test-tuong` (`5befa97`)

- **Ngày lập:** 2026-11-22
- **Nhánh / Commit đối chứng:** `test-tuong` (`5befa97`) — trạng thái mã nguồn & DB local chưa áp dụng bản vá
- **Phương pháp:** `doubt-driven-development` + `test-engineer` + `test-driven-development` (`Prove-It Pattern`)
- **Baseline `npm test` trên `5befa97`:** `6 / 6 files`, `64 / 64 tests PASS` (`hoc-phi`: 35, `import-excel`: 13, `diem-danh-thang`: 6, `gio-hoc`: 4, `xuat-excel`: 3, `danh-gia`: 3)

---

## I. Danh sách lỗi đã phát hiện trên nhánh `test-tuong` (`5befa97`)

### Mức Nghiêm trọng (Critical)

- [x] **1. PostgreSQL `lpad(..., 3, '0')` cắt mã học sinh từ STT 1000 → `unique_violation`**
  - **Vị trí:** [`supabase/migrations/20261123000000_hoc_sinh_nhieu_lop.sql`](../supabase/migrations/20261123000000_hoc_sinh_nhieu_lop.sql#L16) (`L16`, `L27`)
  - **Chi tiết:** Default `('HS' || lpad(nextval('hoc_sinh_ma_seq')::text, 3, '0'))` làm `lpad('1000', 3, '0') = '100'`, sinh trùng `'HS100'` và chặn toàn bộ thao tác tạo học sinh mới vĩnh viễn khi sequence đạt 1000.

- [x] **2. Tiền dư `tienDuGoiNhieuLop` / `duConLaiNhieuLop` bị sinh ảo & biến đổi ngược quá khứ**
  - **Vị trí:** [`src/hoc-phi.ts`](../src/hoc-phi.ts#L228-L243), [`src/trang/HocSinhChiTiet.tsx`](../src/trang/HocSinhChiTiet.tsx#L46)
  - **Chi tiết:**
    - Gói `0đ` hoặc gói ghi đè đơn giá (`coGiaOverride = true`, `tien_thang = null`) vẫn nhân theo `don_gia_rieng` của lớp (vd `1.000.000 đ`) → sinh tiền dư ảo từ gói `0đ`.
    - Sửa `ghi_danh.don_gia_rieng` sau này, xoá `ghi_danh`, hoặc thêm lớp mới giữa chừng gói 2–3 tháng làm thay đổi tiền dư của gói cũ / tháng đã chốt.

- [x] **3. Cơ chế bypass `trg_khoa_so()` qua GUC `msnhung.dang_gop_hs` khi gộp học sinh**
  - **Vị trí:** [`supabase/migrations/20261124000000_gop_hs_don_gia_rieng.sql`](../supabase/migrations/20261124000000_gop_hs_don_gia_rieng.sql#L11-L104)
  - **Chi tiết:**
    - Không reset `set_config('msnhung.dang_gop_hs', '0', true)` trước khi thoát `gop_hoc_sinh` (các lệnh sau trong cùng transaction tiếp tục đi xuyên `khoa_so`).
    - Khoá hàng `hoc_sinh` theo thứ tự tham số `(p_giu, p_bo)` thay vì `order by id` → nguy cơ deadlock AB-BA.
    - Khi `p_giu` và `p_bo` có `diem_danh` trùng `buoi_id` ở tháng đã chốt sổ, phép gộp sửa/xoá trực tiếp bản ghi điểm danh tháng đã chốt; nếu còn sót `diem_danh` ở buổi `lop_nghi = true`, trigger `chan_buoi_nghi` chặn `UPDATE` làm hỏng phép gộp.

- [x] **4. Migration gộp trùng tên thiếu chốt an toàn `sdt_phu_huynh`**
  - **Vị trí:** [`supabase/migrations/20261124000000_gop_hs_don_gia_rieng.sql`](../supabase/migrations/20261124000000_gop_hs_don_gia_rieng.sql#L130-L138)
  - **Chi tiết:** `group by 1 having count(*) > 1` không kiểm tra `sdt_phu_huynh` khác nhau (và chỉ chuẩn hoá `'uỳ'→'ùy'`), có thể gộp nhầm 2 em trùng tên khác người nếu chạy trên dữ liệu khác.

- [x] **5. Mở khoá sổ tháng (`moKhoa`) luôn crash `TypeError: daHuy is not a function`**
  - **Vị trí:** [`src/trang/HocPhi.tsx`](../src/trang/HocPhi.tsx#L49-L55) (`L114`)
  - **Chi tiết:** `.then(tai)` truyền giá trị `null` từ RPC `mo_khoa` vào tham số `daHuy = () => false` (default parameter chỉ áp dụng cho `undefined`, không áp cho `null`). Sau khi DB đã mở khoá xong, app văng lỗi và không đóng hộp thoại.

- [x] **6. Modal `Thu tiền` tạo gói âm & tính sai `duCon` theo tháng chọn**
  - **Vị trí:** [`src/trang/HocSinhChiTiet.tsx`](../src/trang/HocSinhChiTiet.tsx#L186) (`L270`, `L292`, `L326`, `L341`)
  - **Chi tiết:**
    - `L186` truyền `truocThang = '9999-12'` nên cộng cả tiền dư từ gói đang học chưa kết thúc.
    - `L270` tính `duCon` theo `thangKe` ban đầu, không cập nhật theo `thangBd` khi người dùng đổi `Từ tháng`.
    - `L326` gán `initialValues.tien_du_tru = duCon` và không có validator chặn `tien_du_tru > tongGoiMoi` → có thể lưu gói tổng âm (vd khi chọn `don_gia = 0` hoặc gói 1 tháng nhỏ hơn `duCon`).

---

### Mức Cao (High) & Trung bình (Medium)

- [x] **7. `LopHoc.tsx` — luồng thêm/sửa học sinh, `AutoComplete`, `xoaKhoiLop`, `TrungTenModal`**
  - **Vị trí:** [`src/trang/LopHoc.tsx`](../src/trang/LopHoc.tsx#L72-L485)
  - **Chi tiết:**
    - **7a.** Chọn `emDaChon` ở `AutoComplete` (`L375-L389`): 6 ô thông tin cá nhân + upload ảnh vẫn mở cho sửa, nhưng `gopLopVaoEm` bỏ qua hết khi lưu.
    - **7b.** Chọn `emDaChon` rồi thêm 1 lớp mới: ô `gia_rieng` bị ẩn vì `L419` chỉ kiểm `ids.length < 2` trên form, bỏ qua lớp em đã học sẵn.
    - **7c.** Bấm `"Đổi sang tạo mới"` (`L349`) chỉ gọi `setEmDaChon(null)`, giữ nguyên SĐT / phụ huynh / đơn giá / sticker của em vừa chọn → dễ dính dữ liệu người cũ hoặc bị auto-merge nhầm.
    - **7d.** `Sửa học sinh` (`L119-L142`): sửa `Ngày vào học` chỉ cập nhật `hoc_sinh.ngay_vao`, không cập nhật `ghi_danh.ngay_vao` đang có; thêm lớp mới ở `L130` ép ngày hôm nay nếu `ngayVao === suaHs.ngay_vao`.
    - **7e.** `gopLopVaoEm` (`L72-L92`) bật lại lớp từng `ngung` vẫn giữ `ngay_vao` cũ và không cho đặt `don_gia_rieng` về `null`.
    - **7f.** `Sửa học sinh` không đồng bộ `hoc_sinh.trang_thai` khi bỏ lớp cuối đang học hoặc thêm lớp mới cho em đang ngừng.
    - **7g.** Bỏ tick lớp trong `Sửa học sinh` (`L135`) xoá thẳng `ghi_danh` không hỏi xác nhận.
    - **7h.** `gop_hoc_sinh` chuyển `ghi_danh` từ `p_bo` sang `p_giu` nếu `don_gia_rieng is null` và `bo.don_gia !== giu.don_gia` sẽ đổi giá lớp đó sang giá `p_giu`.
    - **7i.** `xoaKhoiLop` (`L214-L220`) bỏ qua `.error` của 4 truy vấn đếm bảng con (nguy cơ làm mồ côi `hoc_sinh`); `TrungTenModal` (`L452-L471`) thiếu `useMotLan` chống bấm đúp.
    - **7j.** `AutoComplete` (`L341-L343`) cắt `.slice(0, 12)` không báo và dropdown có thể che ô chọn lớp phía dưới.

- [x] **8. Import Excel (`import-excel.ts`, `nhap-du-lieu.ts`, `ImportExcel.tsx`)**
  - **Vị trí:** [`src/import-excel.ts`](../src/import-excel.ts#L53-L212), [`src/nhap-du-lieu.ts`](../src/nhap-du-lieu.ts#L30-L60), [`src/trang/ImportExcel.tsx`](../src/trang/ImportExcel.tsx#L59-L171)
  - **Chi tiết:**
    - Dòng 1 có SĐT + dòng 2 cùng tên không SĐT trong cùng file không bị chặn thành `loi`.
    - `maHs` trùng DB nhưng `hoTen` khác học sinh của mã đó vẫn cho ghi danh nhầm người.
    - Em từng `ngung` ở lớp cũ khi import lại bị coi là `da_co` và bỏ qua.
    - `chuanNgay` văng `RangeError` với `NaN`, `Infinity`, `Invalid Date` và hiểu sai năm `< 2000`; `chuanTien` nuốt số thập phân (`"150.5" → 1505`) và text lẫn số (`"abc 123" → 123`); `chuanLinkZalo` dính dấu câu cuối link.
    - `nhapDuLieu` không bật lại `hoc_sinh.trang_thai = 'dang_hoc'` khi `them_lop`; thiếu giao dịch nguyên khối nếu `ghi_danh.insert` lỗi sau `hoc_sinh.insert`.
    - `ImportExcel.tsx` (`L59-L67`, `L171`) đếm trùng `tongViec` với dòng `them_lop + capNhatLink` và thiếu `useMotLan`.

- [x] **9. Xuất Excel & Báo gia hạn (`xuat-excel.ts`, `HocPhi.tsx`, `hoc-phi.ts`)**
  - **Vị trí:** [`src/xuat-excel.ts`](../src/xuat-excel.ts#L69-L97), [`src/trang/HocPhi.tsx`](../src/trang/HocPhi.tsx#L84-L119), [`src/hoc-phi.ts`](../src/hoc-phi.ts#L308-L322)
  - **Chi tiết:**
    - Cột `Đơn giá` trang `Học phí` trong Excel dùng `r.hs.don_gia` thay vì `g.don_gia`, làm sai đơn giá tháng đã chốt nếu sau đó học sinh đổi đơn giá.
    - Trang `Điểm danh` trong Excel duyệt `d.dong` thay vì `d.hocSinh`, làm mất em đã ngừng học dù tháng đó vẫn có điểm danh/sticker.
    - `HocPhi.tsx#L119` gọi `xuatExcel(d)` thiếu `await`.
    - `giaHan` (`HocPhi.tsx#L84-L97`) vẫn nhắc gia hạn em miễn phí `don_gia = 0` (`Ngọc Minh`) và hiện `"Hết gói undefined/undefined"` khi lớp có `lich = []`; `tinNhanGiaHan` in `"đã kết thúc ngày ."`.

- [x] **10. Phân quyền, Điểm danh, Đánh giá, Nhật ký, `xoa_lop`, `PhieuDanhGia`**
  - **Vị trí:** [`src/trang/DiemDanh.tsx`](../src/trang/DiemDanh.tsx#L119-L288), [`src/trang/DanhGia.tsx`](../src/trang/DanhGia.tsx#L82-L125), [`src/App.tsx`](../src/App.tsx#L55-L58), [`supabase/migrations/20261123000000_hoc_sinh_nhieu_lop.sql`](../supabase/migrations/20261123000000_hoc_sinh_nhieu_lop.sql#L217-L220), [`src/trang/NhatKy.tsx`](../src/trang/NhatKy.tsx#L13-L31), [`src/trang/PhieuDanhGia.tsx`](../src/trang/PhieuDanhGia.tsx#L65)
  - **Chi tiết:**
    - `DiemDanh.tsx` chỉ tải `ghi_danh` `dang_hoc` nên buổi cũ có em đã ngừng học bị xếp vào mục học bù (`· học bù`).
    - `DanhGia.tsx` dùng `k.soPhieu` ở tiêu đề thẻ, lệch với bảng từng lớp khi lọc theo lớp của em học nhiều lớp đã gửi qua lớp khác.
    - `App.tsx` kiểm tra `phai_doi_mat_khau` trước `vai_tro === 'phu_huynh'` và thiếu kiểm tra `!toi.hoat_dong`.
    - `xoa_lop` giữ học sinh còn lớp `ngung` nhưng để `hoc_sinh.trang_thai = 'dang_hoc'`.
    - `NhatKy.tsx` thiếu nhãn `ghi_danh`, `ma_hs`, `tien_thang`; `PhieuDanhGia.tsx` chưa hiển thị `ma_hs`.
    - `SPEC-hoc-sinh-nhieu-lop.md` (`L81`, `L111`) lệch với thực tế commit `5befa97` (`gop_hoc_sinh` qua tháng đã chốt & `Ngọc Minh = 0đ`).

---

## II. Kiểm thử chuyên sâu phần Học phí theo TDD (`Prove-It Pattern` trên `5befa97`)

Chạy 14 test cases TDD trực tiếp trên nhánh `5befa97` (không giữ code tạm): **`TOTAL=14 | PASSED=6 | FAILED=8`**.

### 1. Các quy tắc & giá trị biên đang ĐÚNG (`6 / 6 GREEN`)

1. `demBuoiDuKienNhieuLop`: mảng rỗng `[]` → `0`; năm nhuận `02/2028` (5 thứ Ba gồm `29/02`); vắt năm `12/2026 → 01/2027`.
2. `tinhTienThangNhieuLop`: `[]` / đồng giá → `null`; nhiều lớp cùng đơn giá riêng khác `donGiaMacDinh` → trả bảng `tien_thang`; lớp `0đ` khác mặc định → `{ 'YYYY-MM': 0 }`.
3. `phaiThuTheoThang` & `hocPhiGocThang`: điều chỉnh âm + tiền dư tràn 3 tháng (kể cả tràn âm ở tháng cuối nếu vượt tổng gói), điều chỉnh dương, fallback khi `tien_thang` thiếu khoá tháng.
4. `daThuTheoThang`, `tongHopHocSinh`, `tongCong`, `tinNhanPhuHuynh`: đóng thừa giữ số âm `noKyTruoc` xuyên qua tháng không có gói; đóng nợ trễ không đổi số tháng đã chốt; `tongCong` tổng hợp đúng; `tinNhanPhuHuynh` kẹp `Số cần nộp >= 0`.
5. `tienDuGoiNhieuLop` & `duConLaiNhieuLop`: không bù chéo buổi phụ giữa các lớp; biên `ngay_vao` (inclusive) và `thangHetGoi-01` (exclusive); bỏ qua `loai = 'bu'` và `phu` có `lop_nghi = true`; kẹp không âm khi `daHoan + daTru > phatSinh`.
6. `tinhTrangGoiNhieuLop`: đúng ngưỡng `NGUONG_GIA_HAN` (`0/1/4/5` buổi), ưu tiên gói tháng sau đã đóng trước, cộng 3 lớp.

### 2. Các lỗi học phí được tái hiện (`8 / 8 RED Prove-It`) — gồm 3 lỗi mới phát hiện

| Mã | Tên test tái hiện trên `5befa97` | Lỗi quan sát thực tế từ Vitest |
| :--- | :--- | :--- |
| **RED-1 *(Đã vá)*** | Gói `0đ` / ghi đè đơn giá (`tien_thang = null`) với lớp có `don_gia_rieng = 1.000.000` | `AssertionError: expected 1000000 to be +0` |
| **RED-2 *(Đã vá)*** | Tiền dư gói cũ thay đổi khi sửa `don_gia_rieng` và thêm lớp mới giữa gói 3 tháng | `AssertionError: expected 1150000 to be 500000` |
| **RED-3 *(Mới — Đã vá)*** | `tinhTrangGoiNhieuLop` chọn `buoiCuoi` của lớp có `ngay_vao` sau khi gói đã hết hạn (`src/hoc-phi.ts#L171-L185`) | `AssertionError: expected '2026-11-30' to be '2026-11-27'` (do `tinhTrangGoi` gán `buoiCuoi = n` ngay cả khi `n < ngayVao`) |
| **RED-4 *(Đã vá)*** | `tinNhanGiaHan` khi lớp chưa có lịch tuần (`lich = []`, `buoiCuoi = undefined`) | `AssertionError: expected '... đã kết thúc ngày .' not to contain 'ngày .'` |
| **RED-5 *(Mới — Đã vá)*** | `conNoGoi(g2)` lệch `tongHopHocSinh` khi gói `g1` trước đó đóng thừa bù đủ cho `g2` (`src/hoc-phi.ts#L140`, `HocSinhChiTiet.tsx#L266`) | `AssertionError: expected 200000 to be +0` (`tongHopHocSinh.conPhaiThu = 0` nhưng `ThuTien` vẫn liệt kê `g2` trong danh sách `"Trả gói đang nợ"`) |
| **RED-6 *(Mới — Đã vá)*** | Học sinh đang học chưa đóng gói nào (`goi = 'Chưa có gói'`, `phaiThu = 0`) bị gán nhãn `"Đã đủ"` ở Excel & App (`src/xuat-excel.ts#L72-L73`, `HocPhi.tsx#L72, L197`) | `AssertionError: expected 'Đã đủ' not to be 'Đã đủ'` |
| **RED-7 *(Đã vá)*** | Excel `Học phí` tháng cũ đổi cột `Đơn giá` (`G2`) sau khi `hs.don_gia` tăng ở tháng mới | `AssertionError: expected 250000 to be 150000` |
| **RED-8 *(Đã vá)*** | Excel `Điểm danh` mất dòng của em đã ngừng học (`ngoài d.dong`) dù tháng đó vẫn có điểm danh | `AssertionError: expected null to be 'Ngọc Minh Ngừng'` |

### 3. Khe hở học phí bổ sung ở UI & Database

- [x] **Nút `Thu tiền` vẫn mở cho học sinh đã ngừng mọi lớp** ([`src/trang/HocSinhChiTiet.tsx`](../src/trang/HocSinhChiTiet.tsx#L157)): khi `dsLopDangHoc = []`, modal vẫn cho lưu gói `0 buổi`.
- [x] **`moTaGia` danh sách `Học phí` hiển thị theo giá hiện tại thay vì giá lịch sử của gói** ([`src/trang/HocPhi.tsx`](../src/trang/HocPhi.tsx#L74-L80)) khi xem lại tháng đã chốt sau đợt đổi giá (tiền `phaiThu` vẫn đúng theo gói).
- [x] **Database `goi_hoc` chưa có ràng buộc chống gói âm** ([`supabase/migrations/20261115000000_khoi_tao.sql`](../supabase/migrations/20261115000000_khoi_tao.sql#L108-L119)): cho phép lưu `tien_du_tru` hoặc `dieu_chinh` âm lớn hơn học phí gốc nếu client bỏ qua kiểm tra.
