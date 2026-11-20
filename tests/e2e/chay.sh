#!/usr/bin/env bash
# Chạy toàn bộ kiểm tra: unit test, type check, build, E2E Chromium (khung 412px), kiểm RLS/khoá sổ qua API.
# CẦN: dev server ở http://127.0.0.1:5180 (npx vite --host 127.0.0.1 --port 5180), Python + Playwright, .env đủ khoá.
# Database dùng chung với bản thật: test chỉ tạo dữ liệu tên "TEST …", dọn trước và sau, rồi so số dòng với lúc đầu.
set -e
cd "$(dirname "$0")/../.."
set -a; . ./.env; set +a
TRUOC=$(node --env-file=.env tests/e2e/dem.mjs)
npx vitest run
npx tsc --noEmit && echo "tsc sạch"
npm run build >/dev/null && echo "build OK"
node --env-file=.env tests/e2e/don-test.mjs
set +e
rm -f tests/e2e/out/ket-qua.txt  # all.py chết giữa chừng thì không in lại kết quả cũ thành PASS
python -I -X utf8 tests/e2e/all.py "$BREAK_GLASS_PASSWORD" > /dev/null 2>&1; cat tests/e2e/out/ket-qua.txt
python -I -X utf8 tests/e2e/api.py
node --env-file=.env tests/e2e/don-test.mjs
SAU=$(node --env-file=.env tests/e2e/dem.mjs)
[ "$TRUOC" = "$SAU" ] && echo "PASS | database về đúng như trước test" || { echo "FAIL | database khác trước test"; echo "trước: $TRUOC"; echo "sau:   $SAU"; }
