# MsNhung

## Dự án làm gì

Ứng dụng quản lý lớp cho trung tâm Anh ngữ Ms.Nhung: điểm danh học sinh và trợ giảng, sticker, ảnh lớp, học phí,
thu tiền nhiều đợt, sổ thu chi, chốt sổ tháng, xuất Excel. Yêu cầu và các quyết định đã chốt ở
[`docs/YEU-CAU.md`](docs/YEU-CAU.md); file đó là nguồn sự thật, chat chỉ là nơi bàn.

## Tech stack

Chưa chốt (đang grill, xem `docs/YEU-CAU.md`).

## Lệnh chạy

Chưa có.

## Quy ước

- Code, comment và tài liệu viết tiếng Việt; comment giải thích *vì sao*, không mô tả lại *cái gì*.
- Mỗi tính năng: Plan Mode trước, duyệt kế hoạch, rồi mới code. Một tính năng mỗi lượt.
- Quyết định mới chốt ghi vào `docs/YEU-CAU.md` ngay, trước khi code.
- Tiền là số nguyên VND, không dùng số thực.
- Git: app nhỏ nên commit thẳng vào `main`, không cần nhánh feature hay PR (người dùng chốt 2026-11-15; luật này
  thay luật cấm commit vào `main` trong cấu hình global, chỉ áp dụng cho repo này).
- Không xoá dữ liệu thật (điểm danh, phiếu thu, tháng đã chốt sổ) khi khởi động, migrate hay seed.
