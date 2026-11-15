import os, re, sys, subprocess, json
from playwright.sync_api import sync_playwright, expect

D = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(D, "out")
os.makedirs(OUT, exist_ok=True)
URL = "http://127.0.0.1:5180/"
PW = sys.argv[1]
REPO = r"C:\Users\TIENTUONG\MsNhung"
KQ = []


def buoc(ten, f):
    try:
        f()
        KQ.append(("PASS", ten))
    except Exception as e:
        KQ.append(("FAIL", ten + ": " + str(e).splitlines()[0][:200]))
        try:
            p.screenshot(path=os.path.join(OUT, f"loi-{len(KQ)}.png"), full_page=True)
        except Exception:
            pass


def lab(p, t):
    return p.get_by_label(t, exact=True)


def dang_nhap(p, ten, mk):
    p.goto(URL)
    lab(p, "Tên đăng nhập hoặc số điện thoại").fill(ten)
    lab(p, "Mật khẩu").fill(mk)
    p.get_by_role("button", name="Đăng nhập").click()


def chon(p, nhan, gt):
    lab(p, nhan).click()
    p.locator(".ant-select-dropdown:visible .ant-select-item-option", has_text=gt).first.click()


with sync_playwright() as pw:
    b = pw.chromium.launch()
    loi = []
    ctx = b.new_context(viewport={"width": 412, "height": 900}, accept_downloads=True)
    p = ctx.new_page()
    p.on("pageerror", lambda e: loi.append(str(e)))

    def nav(t):
        p.locator("nav").get_by_text(t, exact=True).click()

    def b_admin():
        dang_nhap(p, "admin", PW)
        expect(p.get_by_text("Thoát")).to_be_visible(timeout=20000)
    buoc("admin đăng nhập", b_admin)

    def b_tao_tg():
        nav("Tài khoản")
        p.get_by_role("button", name="Tạo tài khoản").click()
        lab(p, "Họ tên").fill("TEST Trợ giảng Lan")
        lab(p, "Tên đăng nhập").fill("testlan")
        lab(p, "Số điện thoại").fill("0911000001")
        lab(p, "Đơn giá một buổi").fill("80000")
        p.get_by_role("button", name="Tạo", exact=True).click()
        expect(p.get_by_text("TEST Trợ giảng Lan")).to_be_visible(timeout=15000)
    buoc("tạo trợ giảng", b_tao_tg)

    def b_lop_hs():
        nav("Lớp")
        p.get_by_role("button", name="Thêm lớp").click()
        lab(p, "Tên lớp").fill("TEST Lớp Starters")
        lab(p, "Đơn giá một buổi (đ)").fill("100000")
        for t in ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]:
            p.locator(".ant-modal").get_by_text(t, exact=True).click()
        p.locator(".ant-modal").get_by_role("button", name="Lưu").click()
        expect(p.get_by_text("TEST Lớp Starters")).to_be_visible(timeout=15000)
        p.get_by_role("button", name="Thêm học sinh").click()
        lab(p, "Họ tên").fill("TEST Nguyễn Bảo An")
        chon(p, "Lớp", "TEST Lớp Starters")
        p.locator(".ant-modal input[type=file]").set_input_files(os.path.join(D, "avatar.jpg"))
        lab(p, "Tên phụ huynh").fill("Chị Hoa")
        p.get_by_label(re.compile("SĐT phụ huynh")).fill("0922 000 002")
        p.get_by_label(re.compile("Sticker đã có")).fill("5")
        lab(p, "Ngày vào học").fill("01/11/2026")
        p.keyboard.press("Enter")  # Enter gửi form ngay; bấm Lưu thêm lần nữa phải không tạo trùng
        p.locator(".ant-modal").get_by_role("button", name="Lưu").click()
        expect(p.get_by_text("TEST Nguyễn Bảo An")).to_be_visible(timeout=20000)
        p.wait_for_timeout(2500)
        n = p.locator(".ant-list-item", has_text="TEST Nguyễn Bảo An").count()
        assert n == 1, f"học sinh bị tạo {n} lần"
    buoc("tạo lớp + học sinh (avatar, SĐT phụ huynh, sticker đã có 5), Enter + bấm Lưu không tạo trùng", b_lop_hs)

    def b_diem_danh():
        nav("Điểm danh")
        p.locator(".ant-list-item", has_text="TEST Lớp Starters").get_by_role("button", name="Điểm danh").click()
        p.get_by_text("TEST Trợ giảng Lan").click()
        row = p.locator(".ant-list-item", has_text="TEST Nguyễn Bảo An")
        row.get_by_text("Có mặt", exact=True).click()
        row.locator(".ant-input-number input").fill("3")
        p.keyboard.press("Tab")
        p.wait_for_timeout(1500)
        expect(row.get_by_text("8 sticker")).to_be_visible(timeout=8000)  # 5 đầu kỳ + 3 buổi này
        p.locator("input[type=file]").last.set_input_files(os.path.join(D, "lop.jpg"))
        expect(p.locator(".ant-image img")).to_have_count(1, timeout=15000)
        p.screenshot(path=os.path.join(OUT, "a-diem-danh.png"), full_page=True)
    buoc("điểm danh: trợ giảng, có mặt, sticker (tổng 8 = 5 + 3), ảnh lớp", b_diem_danh)

    def b_buoi_bu():
        p.get_by_role("button", name="← Quay lại").click()
        p.get_by_role("button", name="Thêm buổi phụ / bù").click()
        m = p.locator(".ant-modal")
        m.get_by_text("Buổi bù riêng").click()
        m.locator(".ant-select").click()
        p.locator(".ant-select-dropdown:visible .ant-select-item-option", has_text="TEST Lớp Starters").click()
        m.get_by_role("button", name=re.compile("^(OK|Đồng ý)$")).click()
        p.locator(".ant-list-item", has_text="Buổi bù").get_by_role("button", name="Điểm danh").click()
        row = p.locator(".ant-list-item", has_text="TEST Nguyễn Bảo An")
        expect(row.get_by_text("Không đến")).to_be_visible(timeout=10000)
        assert row.get_by_text("Có mặt", exact=True).count() == 0 and row.get_by_text("Vắng", exact=True).count() == 0
        expect(p.get_by_role("button", name="Tất cả có mặt")).to_have_count(0)
        row.get_by_text("Học bù", exact=True).click()
        p.wait_for_timeout(1200)
        row.get_by_text("Không đến", exact=True).click()
        p.wait_for_timeout(1200)
        p.get_by_role("button", name="← Quay lại").click()
    buoc("buổi bù riêng: chỉ có Học bù / Không đến, không có nút Tất cả có mặt", b_buoi_bu)

    def b_thu_tien():
        nav("Lớp")
        p.get_by_text("TEST Nguyễn Bảo An").click()
        p.get_by_role("button", name="Thu tiền").click()
        p.locator(".ant-modal").get_by_text("3 tháng").click()
        p.get_by_label(re.compile("Số tiền thu lần này")).fill("2000000")
        p.locator(".ant-modal").get_by_role("button", name="Lưu").click()
        p.wait_for_timeout(2500)
        expect(p.get_by_text("Còn phải thu")).to_be_visible()
        expect(p.locator(".ant-descriptions")).to_contain_text("1.000.000 đ")
        p.screenshot(path=os.path.join(OUT, "a-chi-tiet.png"), full_page=True)
    buoc("thu tiền gói 3 tháng 2 triệu → còn phải thu tháng 11 là 1.000.000", b_thu_tien)

    def b_chi_phi():
        nav("Chi phí")
        p.get_by_role("button", name="Thêm khoản chi").click()
        p.get_by_label(re.compile("Mục")).fill("Tài liệu")
        lab(p, "Số tiền").fill("150000")
        lab(p, "Ghi chú").fill("TEST e2e")
        p.locator(".ant-modal").get_by_role("button", name="Lưu").click()
        expect(p.get_by_text("TEST e2e")).to_be_visible(timeout=10000)
        expect(p.locator(".ant-card", has_text="Lương trợ giảng")).to_contain_text("TEST Trợ giảng Lan")
    buoc("chi phí + lương trợ giảng tự tính", b_chi_phi)

    def b_hoc_phi():
        nav("Học phí")
        p.wait_for_timeout(2500)
        expect(p.locator("button", has_text="TEST Nguyễn Bảo An")).to_contain_text("1.000.000 đ")
        p.screenshot(path=os.path.join(OUT, "a-hoc-phi.png"), full_page=True)
        with p.expect_download() as dl:
            p.get_by_role("button", name="Xuất Excel").click()
        f = os.path.join(OUT, "all-hoc-phi.xlsx")
        dl.value.save_as(f)
        js = "const E=require('exceljs');const w=new E.Workbook();w.xlsx.readFile(process.argv[1]).then(()=>console.log(JSON.stringify(w.worksheets.map(x=>x.name))))"
        ten = json.loads(subprocess.run(["node", "-e", js, f], cwd=REPO, capture_output=True, text=True, encoding="utf-8").stdout)
        assert ten[0] == "Tổng hợp" and ten[-5:] == ["Điểm danh", "Sổ thu", "Chi phí", "Công nợ", "Trợ giảng"] and "TEST Lớp Starters" in ten, ten
    buoc("tab Học phí đúng số + Excel đủ trang đúng thứ tự", b_hoc_phi)

    def b_import():
        nav("Lớp")
        p.get_by_role("button", name="Import Excel").click()
        with p.expect_download() as dl:
            p.get_by_role("button", name="Tải file mẫu").click()
        mau = os.path.join(OUT, "mau.xlsx")
        dl.value.save_as(mau)
        dien = os.path.join(OUT, "da-dien.xlsx")
        subprocess.run(["node", "tests/e2e/dien-mau.mjs", mau, dien], cwd=REPO, check=True, capture_output=True)
        p.locator("input[type=file]").set_input_files(dien)
        p.wait_for_timeout(2000)
        expect(p.locator("[role=alert]")).to_contain_text("4 dòng cần sửa")
        p.get_by_role("button", name="Nhập 3 dòng mới").click()
        expect(p.get_by_text("Đã thêm 1 lớp và 2 học sinh")).to_be_visible(timeout=60000)
        p.get_by_role("button", name="Về trang Lớp").click()
        p.get_by_role("button", name="Import Excel").click()
        p.locator("input[type=file]").set_input_files(dien)
        p.wait_for_timeout(2000)
        expect(p.locator(".ant-segmented")).to_contain_text("Mới 0")
    buoc("import Excel: 4 lỗi, nhập 1 lớp 2 học sinh, import lại → Mới 0", b_import)
    def thoat():
        p.get_by_text("Thoát").click()
        expect(lab(p, "Tên đăng nhập hoặc số điện thoại")).to_be_visible(timeout=15000)
    thoat()

    def b_phu_huynh():
        dang_nhap(p, "0922000002", "0922000002")
        expect(p.get_by_text("Lần đầu đăng nhập")).to_be_visible(timeout=15000)
        lab(p, "Mật khẩu mới").fill("phuhuynh123")
        lab(p, "Nhập lại").fill("phuhuynh123")
        p.get_by_role("button", name="Lưu").click()
        # phụ huynh chỉ có một trang nên trên điện thoại không có menu "Con tôi"
        expect(p.get_by_text("TEST Nguyễn Bảo An").first).to_be_visible(timeout=15000)
        p.wait_for_timeout(3000)
        expect(p.get_by_text("Tổng sticker")).to_be_visible()
        expect(p.get_by_text("Ảnh lớp")).to_be_visible()
        assert p.get_by_text("Học phí", exact=True).count() == 0 or p.locator("nav").count() == 0
        p.screenshot(path=os.path.join(OUT, "a-phu-huynh.png"), full_page=True)
        thoat()
    buoc("phụ huynh: SĐT, bắt đổi mật khẩu, thấy con + ảnh lớp, không có tab quản lý", b_phu_huynh)

    def b_tro_giang():
        dang_nhap(p, "testlan", "0911000001")
        expect(p.get_by_text("Lần đầu đăng nhập")).to_be_visible(timeout=15000)
        lab(p, "Mật khẩu mới").fill("trogiang123")
        lab(p, "Nhập lại").fill("trogiang123")
        p.get_by_role("button", name="Lưu").click()
        expect(p.get_by_text("Thoát")).to_be_visible(timeout=15000)
        assert p.locator("nav").get_by_text("Học phí", exact=True).count() == 0, "trợ giảng thấy tab Học phí"
        nav("Tài khoản")
        p.wait_for_timeout(2000)
        vai = p.locator(".ant-table-tbody .ant-tag").all_inner_texts()
        assert "Quản trị" not in vai and "Giáo viên" not in vai and vai.count("Trợ giảng") == 1, vai
        p.screenshot(path=os.path.join(OUT, "a-tro-giang.png"), full_page=True)
        thoat()
    buoc("trợ giảng: không có tab tiền, chỉ thấy tài khoản mình + phụ huynh", b_tro_giang)

    KQ.append(("PASS" if not loi else "FAIL", f"không lỗi JS ({len(loi)})" + (": " + loi[0][:150] if loi else "")))
    b.close()

sys.stdout.reconfigure(encoding="utf-8")
with open(os.path.join(OUT, "ket-qua.txt"), "w", encoding="utf-8") as f:
    for k, t in KQ:
        f.write(f"{k} | {t}\n")
        print(k, "|", t)
