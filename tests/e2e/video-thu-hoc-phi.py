"""Quay video hướng dẫn: tạo học phí (gói) và ghi tiền phụ huynh đóng nhiều đợt.
Chạy: python -I -X utf8 tests/e2e/video-thu-hoc-phi.py <mật khẩu admin>  (cần dev server 127.0.0.1:5180)
Tạo lớp + học sinh mẫu qua API, quay, rồi xoá đúng những gì đã tạo. Video ra docs/huong-dan/."""
import json, os, re, shutil, sys, urllib.request
from playwright.sync_api import sync_playwright, expect

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
RA = os.path.join(REPO, "docs", "huong-dan")
os.makedirs(RA, exist_ok=True)
env = dict(l.split("=", 1) for l in open(os.path.join(REPO, ".env"), encoding="utf-8").read().splitlines() if "=" in l and not l.startswith("#"))
U, S = env["VITE_SUPABASE_URL"].strip(), env["SUPABASE_SECRET_KEY"].strip()


def api(method, path, body=None):
    req = urllib.request.Request(U + path, method=method, data=json.dumps(body).encode() if body is not None else None,
                                 headers={"apikey": S, "Authorization": "Bearer " + S, "Content-Type": "application/json", "Prefer": "return=representation"})
    with urllib.request.urlopen(req) as r:
        t = r.read().decode()
        return json.loads(t) if t else None


lop = api("POST", "/rest/v1/lop", {"ten": "Movers (lớp mẫu)", "don_gia": 150000, "lich": [2, 4]})[0]
hs = api("POST", "/rest/v1/hoc_sinh", {"ho_ten": "Nguyễn Minh Anh", "lop_id": lop["id"], "ngay_vao": "2026-11-01", "ten_phu_huynh": "Chị Hà"})[0]

CHU_THICH = """(t) => { let d = document.getElementById('chu-thich');
  if (!d) { d = document.createElement('div'); d.id = 'chu-thich'; document.body.appendChild(d);
    Object.assign(d.style, { position: 'fixed', left: '8px', right: '8px', top: '62px', zIndex: 9999, padding: '10px 12px',
      background: 'rgba(27,31,29,.92)', color: '#fff', borderRadius: '6px', fontSize: '15px', lineHeight: '1.45',
      fontFamily: 'Lexend Variable, sans-serif', boxShadow: '0 4px 12px rgba(0,0,0,.25)', pointerEvents: 'none' }) }
  d.textContent = t }"""
VIEN = """(el) => { el.style.outline = '3px solid #f5a623'; el.style.outlineOffset = '2px'; setTimeout(() => { el.style.outline = '' }, 1400) }"""

try:
    with sync_playwright() as pw:
        b = pw.chromium.launch(slow_mo=250)
        ctx = b.new_context(viewport={"width": 412, "height": 860}, record_video_dir=os.path.join(RA, "tam"), record_video_size={"width": 412, "height": 860})
        p = ctx.new_page()

        def noi(t, giay=3.0):
            p.evaluate(CHU_THICH, t)
            p.wait_for_timeout(int(giay * 1000))

        def bam(loc, giay=0.8):
            loc.scroll_into_view_if_needed()
            loc.evaluate(VIEN)
            p.wait_for_timeout(700)
            loc.click()
            p.wait_for_timeout(int(giay * 1000))

        def go(loc, chu):
            loc.scroll_into_view_if_needed()
            loc.evaluate(VIEN)
            loc.click()
            loc.press_sequentially(chu, delay=90)
            p.wait_for_timeout(600)

        p.goto("http://127.0.0.1:5180/")
        p.get_by_label("Tên đăng nhập hoặc số điện thoại", exact=True).fill("admin")
        p.get_by_label("Mật khẩu", exact=True).fill(sys.argv[1])
        p.get_by_role("button", name="Đăng nhập").click()
        expect(p.get_by_text("Thoát")).to_be_visible(timeout=20000)
        noi("Hướng dẫn: ghi học phí cần thu và số tiền phụ huynh đã đóng.", 3.5)

        bam(p.locator("nav").get_by_text("Lớp", exact=True), 1.5)
        noi("Bước 1. Vào tab Lớp, bấm vào tên học sinh cần thu tiền.")
        bam(p.get_by_text("Nguyễn Minh Anh"), 2)
        p.get_by_role("button", name="Thu tiền").scroll_into_view_if_needed()
        noi("Kéo xuống phần Học phí. Chưa có gói nào nên học phí đang là 0 đ.", 3.5)
        noi("Bước 2. Bấm Thu tiền.", 2)
        bam(p.get_by_role("button", name="Thu tiền"), 1.5)

        m = p.locator(".ant-modal")
        noi("Chọn \"Đóng gói mới\". Gói là khoá học đóng trước 1, 2 hoặc 3 tháng.", 3.5)
        bam(m.get_by_text("Đóng gói mới"))
        noi("Chọn số tháng và tháng bắt đầu. Ví dụ gói 1 tháng, từ tháng 11.", 3)
        bam(m.get_by_text("1 tháng", exact=True))
        p.locator(".ant-modal p", has_text="Tổng gói").scroll_into_view_if_needed()
        noi("App tự đếm số buổi theo lịch lớp (T3, T5) nhân đơn giá. Dòng \"Tổng gói\" chính là HỌC PHÍ CẦN THU.", 5)
        o_tien = p.get_by_label(re.compile("Số tiền thu lần này"))
        o_tien.scroll_into_view_if_needed()
        noi("Bước 3. Phụ huynh chưa đóng? Để Số tiền thu lần này = 0, bấm Lưu. App ghi học phí và tính là còn nợ.", 5)
        bam(m.get_by_role("button", name="Lưu"), 2.5)
        p.locator(".ant-descriptions").scroll_into_view_if_needed()
        noi("Học phí tháng này đã có, và hiện Còn phải thu bằng đúng tổng gói.", 4.5)

        noi("Bước 4. Phụ huynh đóng đợt 1 (500.000 đ): bấm Thu tiền lần nữa.", 3)
        bam(p.get_by_role("button", name="Thu tiền"), 1.5)
        noi("Chọn \"Trả gói đang nợ\". App chọn sẵn gói còn nợ và cho biết còn nợ bao nhiêu.", 4)
        bam(m.get_by_text("Trả gói đang nợ"), 1.2)
        go(p.get_by_label(re.compile("Số tiền thu lần này")), "500000")
        noi("Nhập số tiền, chọn ngày thu và hình thức (tiền mặt / chuyển khoản), rồi Lưu.", 4)
        bam(m.get_by_role("button", name="Lưu"), 2.5)
        p.locator(".ant-descriptions").scroll_into_view_if_needed()
        noi("Đã thu 500.000 đ, Còn phải thu giảm tương ứng. Danh sách Các lần thu ghi lại từng đợt.", 5)

        noi("Bước 5. Đợt 2 đóng nốt phần còn lại: làm lại như bước 4.", 3)
        bam(p.get_by_role("button", name="Thu tiền"), 1.5)
        bam(m.get_by_text("Trả gói đang nợ"), 1.2)
        con_no = int(re.sub(r"\D", "", m.locator(".ant-select-selection-item").inner_text().split("còn nợ")[-1]))
        go(p.get_by_label(re.compile("Số tiền thu lần này")), str(con_no))
        bam(m.get_by_role("button", name="Lưu"), 2.5)
        p.locator(".ant-descriptions").scroll_into_view_if_needed()
        noi("Còn phải thu = 0 đ: học sinh đã đóng đủ tháng này.", 4)

        bam(p.locator("nav").get_by_text("Học phí", exact=True), 2.5)
        noi("Tab Học phí tổng hợp cả trung tâm: Phải thu, Đã thu, Còn phải thu, ai còn nợ. Lọc \"Còn nợ\" để nhắc phụ huynh.", 5.5)
        noi("Mẹo: đóng 2–3 tháng một lần thì chọn gói 2 hoặc 3 tháng ở bước 2; các tháng sau tự hiện \"Đã đủ\".", 5.5)
        video = p.video
        ctx.close()
        b.close()
        dich = os.path.join(RA, "thu-hoc-phi.webm")
        shutil.move(video.path(), dich)
        shutil.rmtree(os.path.join(RA, "tam"), ignore_errors=True)
        print("video:", dich)
finally:
    goi = api("GET", f"/rest/v1/goi_hoc?select=id&hoc_sinh_id=eq.{hs['id']}")
    for g in goi:
        api("DELETE", f"/rest/v1/phieu_thu?goi_id=eq.{g['id']}")
    api("DELETE", f"/rest/v1/goi_hoc?hoc_sinh_id=eq.{hs['id']}")
    api("DELETE", f"/rest/v1/hoc_sinh?id=eq.{hs['id']}")
    api("DELETE", f"/rest/v1/buoi_hoc?lop_id=eq.{lop['id']}")
    api("DELETE", f"/rest/v1/lop?id=eq.{lop['id']}")
    print("đã xoá dữ liệu mẫu")
