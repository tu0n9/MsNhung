# Báo cáo rà soát Code Review (Alibaba Open Code Review) — Nhánh `test-tuong` (`8efdbd2`)

- **Ngày lập:** 2026-11-23
- **Công cụ:** `open-code-review v1.14.0` (`ocr delegate preview` + `ocr delegate rule`)
- **Phạm vi đối chiếu:** `main` (`8b7516d`) → `test-tuong` (`8efdbd2`)
- **Độ phủ (Coverage):** `total_files: 40` | `reviewed_files: 40` | `skipped_files: 0` | `coverage_rate: 100%`
- **Kết quả trước khi vá:** `0 Critical`, `1 High`, `3 Medium` *(đã đối chiếu loại bỏ false positive: video cổng phụ huynh trong `HuongDan.tsx` đã được team gỡ sẵn từ trước)*

---

## Danh sách lỗi phát hiện & trạng thái khắc phục

### Mức Cao (High)

- [x] **1. `taoHocSinhMoi` không dọn hồ sơ `hoc_sinh` nếu `ghi_danh.insert` lỗi**
  - **Vị trí:** [`src/trang/LopHoc.tsx`](../src/trang/LopHoc.tsx#L107-L117)
  - **Nguyên nhân:** Sau khi `insert` vào `hoc_sinh` thành công, nếu lệnh `insert` vào `ghi_danh` thất bại (rớt mạng, lỗi ràng buộc), bản ghi `hoc_sinh` không được xoá bù → để lại hồ sơ mồ côi không có lớp (tàng hình khỏi danh sách lớp ở `/lop`).
  - **Cách sửa:** Bọc `ghi_danh.insert` trong `try/catch`; khi lỗi thì gọi `sb.from('hoc_sinh').delete().eq('id', luu.id)` rồi ném lỗi ra (đồng nhất với `src/nhap-du-lieu.ts`).

---

### Mức Trung bình (Medium)

- [x] **2. Dòng *"Tiền dư còn lại chưa trừ / chưa hoàn"* cộng cả tiền dư của gói đang học chưa kết thúc**
  - **Vị trí:** [`src/trang/HocSinhChiTiet.tsx`](../src/trang/HocSinhChiTiet.tsx#L196-L199)
  - **Nguyên nhân:** Truyền `truocThang = thangHetGoi(goi[goi.length - 1])` khiến điều kiện `thangHetGoi(g) <= truocThang` luôn đúng với chính gói cuối đang học → số hiển thị bên ngoài lệch với `duCon` trong modal **Thu tiền** (tính theo `thangBd`).
  - **Cách sửa:** Đổi `truocThang` thành `dayjs().format('YYYY-MM')` để chỉ cộng tiền dư từ các gói đã kết thúc tính tới tháng hiện tại.

- [x] **3. Luồng `Sửa học sinh` (`luuHs`) không đồng bộ lại state khi lỗi giữa chừng**
  - **Vị trí:** [`src/trang/LopHoc.tsx`](../src/trang/LopHoc.tsx#L127-L208)
  - **Nguyên nhân:** `luuHs` thực thi nhiều truy vấn ghi tuần tự (`hoc_sinh.update`, `ghi_danh.update`, `ghi_danh.insert`, `ghi_danh.delete`, đồng bộ `trang_thai`). Nếu lỗi xảy ra sau khi `ghi_danh.insert(them)` đã ghi xuống DB, state `gds` trên UI vẫn là bản cũ → bấm Lưu lại sẽ dính `unique_violation` trên `(hoc_sinh_id, lop_id)`.
  - **Cách sửa:** Đặt cờ `daGhi = true` sau lệnh ghi đầu tiên; trong nhánh `catch`, gọi `tai()` để tải lại state mới nhất từ DB.

- [x] **4. Ô `Điều chỉnh` trong modal `Thu tiền` thiếu validator chặn gói âm ở tầng UI**
  - **Vị trí:** [`src/trang/HocSinhChiTiet.tsx`](../src/trang/HocSinhChiTiet.tsx#L380-L391)
  - **Nguyên nhân:** Database đã có trigger `goi_khong_am` chặn tuyệt đối gói `< 0`, nhưng form chưa báo lỗi trực tiếp dưới ô `Điều chỉnh` khi người dùng nhập số âm vượt tổng gói (phải bấm Lưu gửi request lên server mới báo lỗi).
  - **Cách sửa:** Thêm `dependencies={['don_gia', 'so_thang', 'thang', 'tien_du_tru']}` và validator kiểm `tongGoi(...) >= 0` ngay trên `Form.Item` `dieu_chinh`.

---

## Kiểm chứng sau khi sửa

- `npm test`: `9 / 9` test files, `110 / 110` tests PASS.
- `npm run build` (`tsc --noEmit && vite build`): build sạch, 0 lỗi TypeScript.
