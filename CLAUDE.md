# MsNhung

## Dự án làm gì

Ứng dụng quản lý lớp cho trung tâm Anh ngữ Ms.Nhung: điểm danh học sinh và trợ giảng, sticker, ảnh lớp, học phí,
thu tiền nhiều đợt, sổ thu chi, chốt sổ tháng, xuất Excel. Yêu cầu và các quyết định đã chốt ở
[`docs/YEU-CAU.md`](docs/YEU-CAU.md); file đó là nguồn sự thật, chat chỉ là nơi bàn.

## Tech stack

React + Vite + Ant Design (PWA, `HashRouter`) gọi thẳng Supabase (project `msnhung`, Singapore). Phân quyền ở RLS
(`supabase/migrations/`), tạo tài khoản qua Edge Function `supabase/functions/tai-khoan`. Tính tiền ở `src/hoc-phi.ts`
(thuần, có test). Kiến trúc ở [`docs/KE-HOACH.md`](docs/KE-HOACH.md).

Bản chạy thật: **https://ms-nhung.vercel.app** (Vercel team `tuong6`, tự deploy mỗi lần push `main`).
Sao lưu database: GitHub Actions `sao-luu` 01:00 giờ VN → nhánh `sao-luu`.

## Lệnh chạy

| Việc | Lệnh |
|------|------|
| Chạy dev | `npm run dev` |
| Test | `npm test` |
| Build | `npm run build` |
| Đẩy migration | `set -a; . ./.env; set +a; npx supabase db push --db-url "$SUPABASE_DB_URL"` |
| Deploy Edge Function | `SUPABASE_ACCESS_TOKEN=… npx supabase functions deploy tai-khoan --project-ref yfwgavfznjnjwpvjacjf --use-api` |
| Tạo/đặt lại admin break-glass | `npm run tao-admin` (mật khẩu từ `BREAK_GLASS_PASSWORD` trong `.env`) |

`.env` (không commit) chứa URL, publishable key, secret key, mật khẩu DB, access token, mật khẩu break-glass.

## Triển khai

- Push `main` → Vercel **chỉ build lại frontend**. Migration và Edge Function **không** tự lên: đổi
  `supabase/migrations/` thì `db push`, đổi `supabase/functions/` thì `functions deploy` (lệnh ở bảng trên).
  Thứ tự an toàn: đẩy migration trước, push frontend dùng cột/hàm mới sau.
- Bản dev trên máy và bản thật dùng **chung một database**: dữ liệu thử nhập ở máy hiện luôn trên app thật.
- Kiểm giao diện bằng Playwright Chromium ở khung 412px (giáo viên dùng điện thoại).

## Quy ước

- Code, comment và tài liệu viết tiếng Việt; comment giải thích *vì sao*, không mô tả lại *cái gì*.
- Mỗi tính năng: Plan Mode trước, duyệt kế hoạch, rồi mới code. Một tính năng mỗi lượt.
- Quyết định mới chốt ghi vào `docs/YEU-CAU.md` ngay, trước khi code.
- Tiền là số nguyên VND, không dùng số thực.
- Git: app nhỏ nên commit thẳng vào `main`, không cần nhánh feature hay PR (người dùng chốt 2026-11-15; luật này
  thay luật cấm commit vào `main` trong cấu hình global, chỉ áp dụng cho repo này).
- Project Supabase tắt "tự expose bảng mới" và bật `pg_safeupdate`: bảng mới phải `grant` tường minh (kể cả
  `service_role`), `UPDATE` phải có `WHERE`.
- Không xoá dữ liệu thật (điểm danh, phiếu thu, tháng đã chốt sổ) khi khởi động, migrate hay seed.
