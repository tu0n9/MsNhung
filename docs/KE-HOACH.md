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

## Việc người dùng phải tự làm (cần trước pha 0–1)

1. Tạo project Supabase (supabase.com, gói Free, chọn region Singapore). Gửi lại **Project URL** và **anon key**.
   **Service role key** và mật khẩu database chỉ đặt vào `.env` trên máy, không dán vào chat.
2. Tạo tài khoản Vercel hoặc Cloudflare Pages, nối với repo GitHub `MsNhung` (pha 0).
3. Tạo repo GitHub riêng tư cho bản sao lưu (pha 8).
