# MsNhung

## Dự án làm gì

Ứng dụng quản lý lớp cho trung tâm Anh ngữ Ms.Nhung: điểm danh học sinh và trợ giảng, sticker, ảnh lớp, học phí,
thu tiền nhiều đợt, sổ thu chi, chốt sổ tháng, xuất Excel. Yêu cầu và các quyết định đã chốt ở
[`docs/YEU-CAU.md`](docs/YEU-CAU.md); file đó là nguồn sự thật, chat chỉ là nơi bàn.

## Tech stack

React + Vite + Ant Design (PWA, `HashRouter`) gọi thẳng Supabase (project `msnhung`, Singapore). Phân quyền ở RLS
(`supabase/migrations/`), tạo tài khoản qua Edge Function `supabase/functions/tai-khoan`, tóm tắt phiếu đánh giá bằng
Gemini qua `supabase/functions/tom-tat-danh-gia` (secret `GEMINI_API_KEY` chỉ nằm trên Supabase, người dùng tự đặt). Tính tiền ở `src/hoc-phi.ts`
(thuần, có test). Kiến trúc ở [`docs/KE-HOACH.md`](docs/KE-HOACH.md).

Bản chạy thật: **https://ms-nhung.vercel.app** (Vercel team `tuong6`, tự deploy mỗi lần push `main`).
Sao lưu database: GitHub Actions `sao-luu` 01:00 giờ VN → nhánh `sao-luu`.
Dọn ảnh lớp: GitHub Actions `don-anh` 01:30 ngày 2 hằng tháng → ảnh cũ hơn 3 tháng lên Release `anh-YYYY-MM` rồi xoá
khỏi Supabase; release cũ hơn 6 tháng bị xoá hẳn. Cần secret `SUPABASE_SECRET_KEY`.
Video hướng dẫn: `public/huong-dan/*.mp4` (quay bằng `tests/video/chuong.py`), trang Hướng dẫn trong app.

## Lệnh chạy

| Việc | Lệnh |
|------|------|
| Chạy dev | `npm run dev` |
| Test (unit) | `npm test` |
| Test toàn bộ | `npm run test:all`: unit + tsc + build + E2E Chromium 412px + kiểm RLS/khoá sổ qua API. Cần dev server `npx vite --host 127.0.0.1 --port 5180`. Chỉ tạo dữ liệu "TEST …", tự dọn và so số dòng với lúc đầu |
| Build | `npm run build` |
| Đẩy migration | `set -a; . ./.env; set +a; npx supabase db push --db-url "$SUPABASE_DB_URL"` |
| Deploy Edge Function | `SUPABASE_ACCESS_TOKEN=… npx supabase functions deploy tai-khoan --project-ref yfwgavfznjnjwpvjacjf --use-api` |
| Tạo/đặt lại admin break-glass | `npm run tao-admin` (mật khẩu từ `BREAK_GLASS_PASSWORD` trong `.env`) |
| Tạo dữ liệu demo | `npm run tao-demo`: 3 lớp, 15 học sinh, 3 tháng tính tới hôm nay; thêm bên cạnh dữ liệu đang có, không tạo tài khoản mới (dùng `tg01`, phụ huynh `0356998740`); có lớp demo rồi thì từ chối |
| Làm sạch như app mới | `npm run lam-moi`: gõ `XOA HET`; sao lưu JSON vào `sao-luu-may/` trước, xoá mọi dữ liệu và ảnh, mở khoá sổ, **giữ mọi tài khoản**. Người dùng tự chạy (auto mode chặn lệnh này) |

`.env` (không commit) chứa URL, publishable key, secret key, mật khẩu DB, access token, mật khẩu break-glass.

## Triển khai

- Push `main` → Vercel **chỉ build lại frontend**. Migration và Edge Function **không** tự lên: đổi
  `supabase/migrations/` thì `db push`, đổi `supabase/functions/` thì `functions deploy` (lệnh ở bảng trên).
  Thứ tự an toàn: đẩy migration trước, push frontend dùng cột/hàm mới sau.
- Vercel (gói Hobby) **chặn deploy** nếu email commit không khớp tài khoản GitHub `tu0n9`. Repo này đặt riêng
  `git config user.email 267404147+tu0n9@users.noreply.github.com` (email chung của máy là email công ty, bị chặn).
  Clone ở máy khác thì đặt lại dòng này trước khi commit.
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
