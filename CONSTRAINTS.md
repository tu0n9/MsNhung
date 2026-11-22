# Constraints — MsNhung (Nhánh `feat/hoc-sinh-nhieu-lop`)

Last reviewed: 2026-11-22 (áp dụng cho đợt thay đổi trên nhánh `feat/hoc-sinh-nhieu-lop`)

## Ngưỡng sàn (Floor — luôn ép, không ngoại lệ)

- Không thêm `@ts-ignore`, `@ts-expect-error` hay suppression comment để lách lỗi kiểu.
- Không để stub chưa hoàn thiện (`throw new Error('Not implemented')`, `TODO` thay cho logic chính) hoặc `catch {}` nuốt lỗi im lặng.
- Không `.skip` hoặc xoá bất kỳ test cũ nào đang có; không sửa lỏng assertion để vượt kiểm tra.
- Không commit `.env`, thư mục `sao-luu-may/` hay bất kỳ secret/key nào vào Git.
- Không tự hạ ngưỡng hoặc chỉnh lỏng ràng buộc trong file này để làm bài kiểm tra xanh.

## An toàn dữ liệu, Database & Kiến trúc (đặc thù MsNhung)

- **Cô lập môi trường tuyệt đối:** Chỉ thao tác trên nhánh `feat/hoc-sinh-nhieu-lop` và Supabase local Docker (`http://127.0.0.1:54321`). Tuyệt đối không chạm nhánh `main`, không chạy migration hay sửa dữ liệu trên DB thật.
- **Bảo toàn dữ liệu cũ khi migrate:** Migration phải bảo toàn 100% dữ liệu hiện có (`hoc_sinh.don_gia = coalesce(don_gia_rieng, lop.don_gia)`), không `DROP` các cột dữ liệu lịch sử của phụ huynh (`ten_phu_huynh`, `sdt_phu_huynh`, `phu_huynh_id`, `don_gia_rieng`), không làm sai số liệu các tháng đã chốt sổ (`khoa_so`).
- **Quy ước Postgres của project:** Mọi bảng, sequence, view, hàm RPC mới phải `GRANT` tường minh (kể cả `service_role`) và `REVOKE` quyền mặc định `PUBLIC` đối với hàm mới; mọi câu lệnh `UPDATE` phải có `WHERE` (`pg_safeupdate`); giữ chặt RLS cho 3 vai trò đang dùng (`admin`, `giao_vien`, `tro_giang`).
- **Tính tiền & kế toán:** Tiền là số nguyên VND (không dùng số thực); tổng doanh thu sổ Học phí và công thức trong file Excel tuyệt đối không cộng trùng học sinh học nhiều lớp.
- **Chỉnh sửa tối thiểu:** Giữ nguyên tối đa code, schema, hàm thuần và bố cục giao diện cũ đang chạy ổn; không đập đi xây lại ngoài phạm vi `SPEC-hoc-sinh-nhieu-lop.md`.

## Ràng buộc kiểm chứng (Enforced Gates)

| Dimension | Rule | Checked by | Runs at |
|---|---|---|---|
| Types | 0 lỗi kiểu TypeScript | `npx tsc --noEmit` | Cuối mỗi task UI/TS và mọi Checkpoint |
| Build | Build frontend sạch không lỗi | `npm run build` | Checkpoint 3 và Checkpoint 4 |
| Unit tests | 100% test cũ (52 tests) + toàn bộ unit test mới pass | `npm test` | Mỗi task Phase 2 và mọi Checkpoint |
| Migration & DB local | Migrate sạch trên bản clone 128 học sinh, 0 dòng mất, đúng `don_gia` & RLS/RPC | Kiểm tra SQL trực tiếp trên container `supabase_db_msnhung-local` | Checkpoint 1 |
| E2E 412px & API/RLS | 100% PASS kịch bản 412px + RLS/khoá sổ, số dòng DB trước và sau test bằng nhau | `npm run test:all` (hoặc chạy `all.py` + `api.py` + `dem.mjs` trên local) | Checkpoint 4 |

## Chỉ số Baseline hiện tại (Measured, must not regress)

| Metric | Today (2026-11-22) | Direction |
|---|---|---|
| Unit test suite | 5 file test / 52 tests pass | Không giảm, chỉ tăng thêm test cho logic mới |
| TypeScript check | `npx tsc --noEmit` 0 lỗi | Giữ nguyên 0 lỗi |
| Dữ liệu clone trên DB local | 13 `lop`, 128 `hoc_sinh`, 66 `buoi_hoc`, 95 `diem_danh`, 52 `nhat_ky`, 10 `tai_khoan`, 1 `khoa_so` | Bảo toàn 100% khi migrate |

## Ngoại lệ (Exceptions)

| ID | Rule | Path / Scope | Reason | Owner | Expires |
|---|---|---|---|---|---|
| E1 | Chạy script Node qua `NODE_OPTIONS="--experimental-websocket"` | Các script dùng `@supabase/supabase-js` (`scripts/*.mjs`, `tests/e2e/dem.mjs`, `tests/e2e/don-test.mjs`) | Máy đang dùng Node `v20.20.2` chưa bật sẵn `WebSocket` mặc định mà `@supabase/supabase-js@2.119.0` yêu cầu | Chủ repo | Khi nâng Node lên `>= 22.0.0` |
