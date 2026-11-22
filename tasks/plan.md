# Implementation Plan: Học sinh học nhiều lớp, đơn giá cố định & bỏ đăng nhập phụ huynh

Source spec: SPEC-hoc-sinh-nhieu-lop.md

## Overview

Triển khai thay đổi trên nhánh `feat/hoc-sinh-nhieu-lop` và DB clone cục bộ Docker (`http://127.0.0.1:54321`) để 1 học sinh (`hoc_sinh.id` + mã `HSxxx`) có thể học nhiều lớp qua bảng `ghi_danh` với 1 đơn giá/buổi cố định, gộp lịch sử điểm danh/sticker/học phí/đánh giá (1 phiếu/em/tháng), xuất Excel 1 dòng/học sinh, và tắt tài khoản/cổng đăng nhập phụ huynh (giữ nguyên Tên & SĐT phụ huynh), theo nguyên tắc chỉnh sửa tối thiểu.

## Architecture Decisions

- **Tách `ghi_danh (hoc_sinh_id, lop_id, ngay_vao, trang_thai)` khỏi `hoc_sinh`:** Giữ nguyên PK `hoc_sinh.id` (UUID) và bổ sung `ma_hs` tự sinh (`HS001`…) giúp toàn bộ bảng `diem_danh`, `sticker_cong_tru`, `tong_sticker`, `goi_hoc`, `chi_phi`, `danh_gia` giữ nguyên khoá ngoại `hoc_sinh_id`.
- **Đơn giá cố định trên `hoc_sinh.don_gia`:** Mỗi học sinh có 1 đơn giá chung cho mọi lớp; `lop.don_gia` làm giá gợi ý lúc tạo học sinh mới; dữ liệu cũ kế thừa `coalesce(don_gia_rieng, lop.don_gia)` trước khi bỏ `hoc_sinh.lop_id`.
- **1 gói học phí cho 1 học sinh:** `goi_hoc` giữ nguyên cấu trúc; mở rộng `src/hoc-phi.ts` bằng các hàm đa lớp (`demBuoiDuKienNhieuLop`, `tinhTrangGoiNhieuLop`, `duConLaiNhieuLop`) tính tổng buổi trên mọi `ghi_danh` đang học và tính tiền dư theo từng lớp rồi cộng lại.
- **Học phí & Xuất Excel theo học sinh:** Hiển thị 1 dòng/1 học sinh kèm cột `Các lớp` và bộ lọc theo lớp, dùng 1 sheet `Học phí` trong Excel thay cho nhiều sheet lớp để tổng doanh thu không bị cộng trùng.
- **Đánh giá 1 phiếu/em/tháng:** Giữ nguyên `unique (thang, hoc_sinh_id)` trên `danh_gia`, cập nhật `phieu_danh_gia` và `gui_danh_gia` truy vấn qua `ghi_danh`.
- **Tắt đăng nhập phụ huynh nhưng giữ Tên/SĐT:** Khoá `hoat_dong = false` các tài khoản `phu_huynh` cũ, bỏ tạo/đặt lại mật khẩu `phu_huynh` trong Edge Function & UI, gỡ route `PhuHuynh`, nhưng giữ `ten_phu_huynh` & `sdt_phu_huynh` trên hồ sơ học sinh.

## Dependency Graph

```text
Phase 1 (Data & API):
  Task 1 (Migration SQL + RLS + RPCs)
     └─► Task 2 (Edge Function tai-khoan + src/supabase.ts)
           └─► Checkpoint 1

Phase 2 (Pure Logic & Excel — TDD):
  Task 3 (hoc-phi.ts đa lớp + tests)
     ├─► Task 4 (du-lieu.ts + xuat-excel.ts + tests)
     └─► Task 5 (import-excel.ts + nhap-du-lieu.ts + tests)
           └─► Checkpoint 2

Phase 3 (UI Integration):
  ├─► Task 6 (App.tsx, TaiKhoan.tsx, HuongDan.tsx)
  ├─► Task 7 (LopHoc.tsx)
  ├─► Task 8 (DiemDanh.tsx, HocSinhChiTiet.tsx)
  └─► Task 9 (HocPhi.tsx, DanhGia.tsx, ImportExcel.tsx)
        └─► Checkpoint 3

Phase 4 (Scripts, Docs & E2E/API):
  ├─► Task 10 (tao-demo.mjs, lam-moi.mjs, docs/YEU-CAU.md)
  └─► Task 11 (tests/e2e: dem.mjs, don-test.mjs, all.py, api.py)
        └─► Checkpoint 4
```

## Task List

### Phase 1: Data & API Foundation
- [x] Task 1: Viết & áp dụng Migration SQL (`ghi_danh`, `ma_hs`, `don_gia`, RLS, RPCs, tắt `phu_huynh`)
- [x] Task 2: Cập nhật Edge Function `tai-khoan` & kiểu dữ liệu `src/supabase.ts`

### Checkpoint 1: Data & API Foundation
- [x] DB local Docker có đủ 19 migrations + 128 học sinh clone giữ nguyên dữ liệu thật; RLS, `xoa_lop`, `gop_hoc_sinh`, `phieu_danh_gia`, `gui_danh_gia` và Edge Function `tai-khoan` pass kiểm tra.

### Phase 2: Pure Logic & Excel (TDD)
- [x] Task 3: Mở rộng hàm tính học phí đa lớp trong `src/hoc-phi.ts` + unit test `src/hoc-phi.test.ts`
- [x] Task 4: Cập nhật `src/du-lieu.ts` & Xuất Excel theo học sinh `src/xuat-excel.ts` + unit test `src/xuat-excel.test.ts`
- [x] Task 5: Cập nhật Import Excel (`src/import-excel.ts`, `src/nhap-du-lieu.ts`) + unit test `src/import-excel.test.ts`

### Checkpoint 2: Pure Logic & Excel
- [x] `npm test` pass 100% (toàn bộ 52 test cũ + toàn bộ unit test mới cho Task 3, 4, 5).

### Phase 3: UI Integration
- [x] Task 6: Tắt cổng & tài khoản phụ huynh trên điều hướng (`App.tsx`, `TaiKhoan.tsx`, `HuongDan.tsx`)
- [x] Task 7: Cập nhật trang Lớp (`LopHoc.tsx`) — đa lớp, đơn giá cố định, tự gộp trùng & Modal Gộp học sinh
- [x] Task 8: Cập nhật Điểm danh (`DiemDanh.tsx`) & Chi tiết học sinh (`HocSinhChiTiet.tsx`)
- [x] Task 9: Cập nhật Học phí (`HocPhi.tsx`), Đánh giá (`DanhGia.tsx`) & Import UI (`ImportExcel.tsx`)

### Checkpoint 3: UI & Build
- [x] `npx tsc --noEmit` (0 lỗi), `npm run build` sạch, `npm test` pass 100%, kiểm tra trực quan 412px trên `npm run dev` nối DB local.

### Phase 4: Scripts, Docs & E2E/API
- [x] Task 10: Cập nhật Scripts (`tao-demo.mjs`, `lam-moi.mjs`) & Tài liệu (`docs/YEU-CAU.md`)
- [x] Task 11: Cập nhật bộ Test E2E & API (`dem.mjs`, `don-test.mjs`, `all.py`, `api.py`)

### Checkpoint 4: Complete
- [x] Đạt toàn bộ Acceptance Criteria trong `SPEC-hoc-sinh-nhieu-lop.md` và `CONSTRAINTS.md`; nhánh `main` & DB thật hoàn toàn nguyên vẹn.

## Parallelization Opportunities

- **Tuần tự bắt buộc:** Task 1 → Task 2 → Checkpoint 1; Task 3 → Task 4.
- **Có thể làm song song sau khi xong phụ thuộc:**
  - Sau Task 2 & Task 3: Task 4, Task 5 và Task 6 độc lập nhau.
  - Sau Task 8: Task 7 và Task 9 có thể triển khai nối tiếp/song song.
  - Sau Task 9: Task 10 và Task 11 độc lập nhau.

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Mất hoặc lệch đơn giá của 128 học sinh thật khi migrate | High | Backfill `hoc_sinh.don_gia = coalesce(h.don_gia_rieng, l.don_gia)` trước khi drop `lop_id`; đối chiếu SQL 128/128 em khớp 100% trên bản clone local ở Checkpoint 1. |
| Quên `GRANT` bảng/sequence mới hoặc `UPDATE` thiếu `WHERE` | High | Viết tường minh `GRANT ... TO authenticated, service_role` cho `ghi_danh`, `hoc_sinh_ma_seq`, `gop_hoc_sinh`; kiểm mọi `UPDATE` có `WHERE`. |
| `gop_hoc_sinh` gặp 2 hồ sơ cũ có gói chồng tháng hoặc nằm trong tháng đã chốt sổ | Medium | Kiểm tra & từ chối rõ ràng trong transaction (không tự ý xoá gói hoặc vượt `khoa_so`), báo rõ tháng/gói để giáo viên xử lý trước khi gộp. |
| Học sinh học ≥ 2 lớp bị cộng trùng doanh thu trên Học phí / Excel | High | Đổi `du-lieu.ts`, `HocPhi.tsx`, `xuat-excel.ts` sang 1 dòng/1 `hoc_sinh`; viết unit test đối chiếu tổng công thức Excel = `tongCong(d)`. |
| Đường dẫn hardcode trong `api.py` và Node 20 thiếu WebSocket mặc định | Low | Đổi `api.py` sang đọc `.env` theo đường dẫn repo hiện tại; chạy script Node local với `NODE_OPTIONS="--experimental-websocket"`. |

## Open Questions

Không còn.
