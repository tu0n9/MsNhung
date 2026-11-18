import os, re, sys, subprocess, json
from datetime import date, timedelta
from playwright.sync_api import sync_playwright, expect

D = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(D, "out")
os.makedirs(OUT, exist_ok=True)
URL = "http://127.0.0.1:5180/"
PW = sys.argv[1]
REPO = r"C:\Users\TIENTUONG\MsNhung"
KQ = []
THANG_TEST = []  # tháng có link do test tạo, để xoá khi xong


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

    def huong_dan(vao, so_video):
        vao()
        expect(p.locator("video")).to_have_count(so_video, timeout=10000)
        # readyState >= 1: đã đọc được metadata, tức file mp4 có thật và được phục vụ đúng kiểu
        p.wait_for_function("[...document.querySelectorAll('video')].every(v => v.readyState >= 1)", timeout=20000)
        p.get_by_role("button", name="← Quay lại").click()

    def b_admin():
        dang_nhap(p, "admin", PW)
        expect(p.get_by_text("Thoát")).to_be_visible(timeout=20000)
        huong_dan(lambda: p.get_by_role("button", name="Hướng dẫn").click(), 8)
    buoc("admin đăng nhập, trang Hướng dẫn đủ 8 video phát được", b_admin)

    def b_tao_tg():
        nav("Tài khoản")
        p.get_by_role("button", name="Tạo tài khoản").click()
        lab(p, "Họ tên").fill("TEST Trợ giảng Lan")
        lab(p, "Tên đăng nhập").fill("testlan")
        lab(p, "Số điện thoại").fill("0911000001")
        lab(p, "Đơn giá một ca").fill("80000")
        p.get_by_role("button", name="Tạo", exact=True).click()
        expect(p.get_by_text("TEST Trợ giảng Lan")).to_be_visible(timeout=15000)
    buoc("tạo trợ giảng", b_tao_tg)

    def b_lop_hs():
        nav("Lớp")
        p.get_by_role("button", name="Thêm lớp").click()
        lab(p, "Tên lớp").fill("TEST Lớp Starters")
        lab(p, "Đơn giá một buổi (đ)").fill("100000")
        m = p.locator(".ant-modal")
        m.get_by_text("T2", exact=True).click()
        m.get_by_label("T2 bắt đầu").fill("16:45")
        expect(m.get_by_label("T2 kết thúc")).to_have_value("18:45")  # ca mặc định 2 tiếng
        m.get_by_label("T2 kết thúc").fill("18:15")
        for t in ["T3", "T4", "T5", "T6", "T7", "CN"]:  # tick thêm thứ thì chép giờ vừa nhập
            m.get_by_text(t, exact=True).click()
        expect(m.get_by_label("CN bắt đầu")).to_have_value("16:45")
        p.locator(".ant-modal").get_by_role("button", name="Lưu").click()
        expect(p.get_by_text("TEST Lớp Starters")).to_be_visible(timeout=15000)
        expect(p.get_by_text(re.compile("16:45–18:15"))).to_be_visible()
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
    buoc("tạo lớp (có giờ học) + học sinh (avatar, SĐT phụ huynh, sticker đã có 5), Enter + bấm Lưu không tạo trùng", b_lop_hs)

    def b_diem_danh():
        nav("Điểm danh")
        p.locator(".ant-list-item", has_text="TEST Lớp Starters").get_by_role("button", name="Điểm danh").click()
        p.get_by_text("TEST Trợ giảng Lan").click()
        row = p.locator(".ant-list-item", has_text="TEST Nguyễn Bảo An")
        row.get_by_text("Có mặt", exact=True).click()
        # chỉ bấm "Có mặt" (chưa nhập sticker) đã phải lưu: lỗi cũ Segmented nuốt cú bấm ô đầu tiên
        expect(p.locator(".ant-card-head-title", has_text="Học sinh")).to_contain_text("(1/1 có mặt)", timeout=8000)
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
        # khác giờ buổi theo lịch (16:45) để không bị gộp chung một ca
        m.get_by_label("Giờ bắt đầu").fill("19:30")
        m.get_by_label("Giờ kết thúc").fill("21:00")
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

    # lưới lịch: hôm nay có mặt (bước điểm danh), hôm qua vắng, hôm kia có mặt + học bù ở buổi bù riêng (ô ra học bù),
    # các ngày trước đó chưa điểm danh. Lớp TEST học cả 7 ngày, em vào học 01/11.
    HN = date.today()
    NG = {k: (HN - timedelta(days=n)).isoformat() for k, n in [("nay", 0), ("qua", 1), ("kia", 2), ("truoc", 3)]}

    def mo_ngay(d):
        p.locator(".ant-picker").first.click()
        p.locator(f'.ant-picker-dropdown:visible .ant-picker-cell[title="{d}"]').click()
        p.wait_for_timeout(1500)

    def diem_danh_ngay(d, tt):
        mo_ngay(d)
        p.locator(".ant-list-item", has_text="Theo lịch").filter(has_text="TEST Lớp Starters").get_by_role("button", name="Điểm danh").click()
        p.locator(".ant-list-item", has_text="TEST Nguyễn Bảo An").get_by_text(tt, exact=True).click()
        expect(p.locator(".ant-card-head-title", has_text="Học sinh")).to_contain_text("(1/1 có mặt)" if tt == "Có mặt" else "(0/1 có mặt)", timeout=8000)
        p.get_by_role("button", name="← Quay lại").click()

    def kiem_luoi():
        o = lambda k: p.locator(f'[data-ngay="{NG[k]}"]')
        expect(o("nay")).to_have_attribute("data-trang-thai", "co_mat", timeout=15000)
        expect(o("qua")).to_have_attribute("data-trang-thai", "vang")
        expect(o("kia")).to_have_attribute("data-trang-thai", "hoc_bu")
        if NG["truoc"] >= HN.replace(day=1).isoformat():
            expect(o("truoc")).to_have_attribute("data-trang-thai", "chua_diem_danh")
        ct = p.locator("[data-chi-tiet-ngay]")
        # hôm nay được chọn sẵn: dòng chi tiết phải theo dữ liệu đã tải, không kẹt ở "Không có buổi học"
        expect(ct).to_contain_text("Có mặt")
        o("kia").click()
        expect(ct).to_contain_text("Buổi bù: Học bù")
        expect(ct).to_contain_text("Có mặt")

    def b_luoi():
        assert NG["kia"][:7] == NG["nay"][:7], "bước này cần chạy từ ngày 3 của tháng"
        diem_danh_ngay(NG["qua"], "Vắng")
        diem_danh_ngay(NG["kia"], "Có mặt")
        p.get_by_role("button", name="Thêm buổi phụ / bù").click()
        m = p.locator(".ant-modal")
        m.get_by_text("Buổi bù riêng").click()
        m.locator(".ant-select").click()
        p.locator(".ant-select-dropdown:visible .ant-select-item-option", has_text="TEST Lớp Starters").click()
        # khác giờ buổi theo lịch (16:45) để không bị gộp chung một ca
        m.get_by_label("Giờ bắt đầu").fill("19:30")
        m.get_by_label("Giờ kết thúc").fill("21:00")
        m.get_by_role("button", name=re.compile("^(OK|Đồng ý)$")).click()
        p.locator(".ant-list-item", has_text="Buổi bù").get_by_role("button", name="Điểm danh").click()
        p.locator(".ant-list-item", has_text="TEST Nguyễn Bảo An").get_by_text("Học bù", exact=True).click()
        p.wait_for_timeout(1500)
        p.get_by_role("button", name="← Quay lại").click()
        nav("Lớp")
        p.get_by_text("TEST Nguyễn Bảo An").click()
        kiem_luoi()
        p.screenshot(path=os.path.join(OUT, "a-luoi-giao-vien.png"), full_page=True)
        p.get_by_role("button", name="← Quay lại").click()
    buoc("lưới điểm danh tháng (giáo viên): có mặt / vắng / học bù / chưa điểm danh, chạm ô hiện chi tiết", b_luoi)

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
        expect(p.locator("[data-dung-luong-anh]")).to_contain_text("MB / 1 GB")  # hàm dung_luong_anh() chạy được
        p.screenshot(path=os.path.join(OUT, "a-hoc-phi.png"), full_page=True)
        # bộ lọc báo gia hạn: TEST An có gói 3 tháng từ tháng này nên không nằm trong danh sách
        p.locator(".ant-segmented-item", has_text="Sắp hết gói").click()
        expect(p.locator(".ant-card", has_text="TEST Lớp Starters")).to_have_count(0)
        p.screenshot(path=os.path.join(OUT, "a-sap-het-goi.png"), full_page=True)
        p.locator(".ant-segmented-item", has_text="Tất cả").click()
        with p.expect_download() as dl:
            p.get_by_role("button", name="Xuất Excel").click()
        f = os.path.join(OUT, "all-hoc-phi.xlsx")
        dl.value.save_as(f)
        js = ("const E=require('exceljs');const w=new E.Workbook();w.xlsx.readFile(process.argv[1]).then(()=>{"
              "const s=w.getWorksheet('TEST Lớp Starters');"
              "console.log(JSON.stringify({ten:w.worksheets.map(x=>x.name),goi:s&&[s.getCell('L1').value,s.getCell('L2').value]}))})")
        kq = json.loads(subprocess.run(["node", "-e", js, f], cwd=REPO, capture_output=True, text=True, encoding="utf-8").stdout)
        ten = kq["ten"]
        # trang "Đánh giá" chỉ có khi tháng có phiếu (database dùng chung nên có thể đã có phiếu thật)
        ten = [x for x in ten if x != "Đánh giá"]
        assert ten[0] == "Tổng hợp" and ten[-5:] == ["Điểm danh", "Sổ thu", "Chi phí", "Công nợ", "Trợ giảng"] and "TEST Lớp Starters" in ten, ten
        # cột Gói ở cuối sheet lớp (gói TEST 3 tháng từ tháng này)
        assert kq["goi"][0] == "Gói" and str(kq["goi"][1]).startswith("3 tháng · "), kq["goi"]
    buoc("tab Học phí đúng số + dung lượng ảnh + Excel đủ trang đúng thứ tự", b_hoc_phi)

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

    def b_xoa_lop():
        nav("Lớp")
        p.locator(".ant-collapse-item", has_text="TEST Movers 2").get_by_role("button", name="Sửa lớp", exact=True).click()
        p.locator(".ant-modal").get_by_role("button", name="Xoá lớp").click()
        hop = p.locator(".ant-modal-confirm")
        expect(hop.get_by_role("button", name="Xoá hẳn")).to_be_disabled()
        hop.get_by_label("Gõ lại tên lớp").fill("TEST Movers")
        expect(hop.get_by_role("button", name="Xoá hẳn")).to_be_disabled()
        hop.get_by_label("Gõ lại tên lớp").fill("TEST Movers 2")
        hop.get_by_role("button", name="Xoá hẳn").click()
        expect(p.get_by_text("Đã xoá lớp TEST Movers 2")).to_be_visible(timeout=15000)
        expect(p.locator(".ant-collapse-item", has_text="TEST Movers 2")).to_have_count(0)
        assert p.get_by_text("TEST Lê Minh Châu").count() == 0, "học sinh của lớp đã xoá vẫn còn"
    buoc("xoá lớp có học sinh: gõ sai tên thì nút Xoá hẳn bị khoá, gõ đúng thì lớp + học sinh biến mất", b_xoa_lop)

    def b_danh_gia():
        nav("Học phí")
        p.get_by_role("button", name="Đánh giá học sinh").click()
        p.wait_for_timeout(2000)
        # database dùng chung với bản thật: tháng này đã có link thật thì dùng lại, không đổi mã
        tao = p.get_by_role("button", name=re.compile("^Tạo link tháng")).count() > 0
        if tao:
            p.get_by_role("button", name=re.compile("^Tạo link tháng")).click()
        link = p.locator("[data-link-danh-gia]")
        expect(link).to_be_visible(timeout=10000)
        url = link.inner_text()
        THANG_TEST.append(None if not tao else date.today().replace(day=1).isoformat())
        try:
            p.goto(url)
            chon(p, "Em học lớp nào?", "TEST Lớp Starters")
            chon(p, "Tên em", "TEST Nguyễn Bảo An")
            p.get_by_label("Nhận xét chung về khoá học", exact=False).fill("TEST nhận xét khoá học")
            p.get_by_label("TEST Trợ giảng Lan").check()
            the = p.locator(".ant-card", has_text="Đánh giá TEST Trợ giảng Lan")
            for i in range(3):
                the.locator(".ant-radio-group").nth(i).get_by_text("4", exact=True).click()
            p.screenshot(path=os.path.join(OUT, "a-phieu-danh-gia.png"), full_page=True)
            p.get_by_role("button", name="Gửi phiếu").click()
            expect(p.get_by_text("Cảm ơn em đã đánh giá!")).to_be_visible(timeout=15000)
            p.reload()
            chon(p, "Em học lớp nào?", "TEST Lớp Starters")
            lab(p, "Tên em").click()
            expect(p.locator(".ant-select-item-option-disabled", has_text="TEST Nguyễn Bảo An (đã gửi)")).to_be_visible(timeout=5000)
            p.goto(URL + "#/danh-gia")
            expect(p.locator(".ant-table", has_text="TEST Trợ giảng Lan")).to_contain_text("4", timeout=15000)
            expect(p.get_by_text("TEST nhận xét khoá học")).to_be_visible()
            p.get_by_text(re.compile(r"^Từng phiếu")).click()
            expect(p.locator(".ant-collapse", has_text="TEST Nguyễn Bảo An")).to_be_visible()
            p.screenshot(path=os.path.join(OUT, "a-danh-gia.png"), full_page=True)
            p.get_by_role("button", name="Chuyển sang giao diện tối").click()
            p.screenshot(path=os.path.join(OUT, "a-danh-gia-toi.png"), full_page=True)
            p.get_by_role("button", name="Chuyển sang giao diện sáng").click()
        finally:
            p.goto(URL)
    buoc("đánh giá: tạo link, học sinh chọn lớp + tên gửi phiếu, tên mờ 'đã gửi', giáo viên thấy điểm + nhận xét", b_danh_gia)
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
        # ô "chưa điểm danh" chỉ có khi phụ huynh đọc được buoi_hoc của lớp con (RLS), ô học bù khi đọc được buổi bù
        kiem_luoi()
        expect(p.get_by_text(re.compile("16:45–18:15")).first).to_be_visible()
        expect(p.locator("[data-goi-hien-tai]").first).to_contain_text("Gói: 3 tháng · ")
        p.screenshot(path=os.path.join(OUT, "a-phu-huynh.png"), full_page=True)
        huong_dan(lambda: p.get_by_text("Xem hướng dẫn").click(), 1)
        thoat()
    buoc("phụ huynh: SĐT, bắt đổi mật khẩu, thấy con + ảnh lớp + lưới tháng + giờ học + 1 video hướng dẫn, không có tab quản lý", b_phu_huynh)

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
        huong_dan(lambda: p.get_by_role("button", name="Hướng dẫn").click(), 2)
        thoat()
    buoc("trợ giảng: không có tab tiền, chỉ thấy tài khoản mình + phụ huynh, 2 video hướng dẫn", b_tro_giang)

    # link do test tạo thì xoá (phiếu TEST do don-test.mjs dọn), để số dòng database về như trước
    if THANG_TEST and THANG_TEST[0]:
        subprocess.run(["node", "--env-file=.env", "-e",
            "const{createClient}=require('@supabase/supabase-js');createClient(process.env.VITE_SUPABASE_URL,process.env.SUPABASE_SECRET_KEY)"
            ".from('link_danh_gia').delete().eq('thang',process.argv[1]).then(r=>{if(r.error)process.exit(1)})", THANG_TEST[0]], cwd=REPO, check=True)

    KQ.append(("PASS" if not loi else "FAIL", f"không lỗi JS ({len(loi)})" + (": " + loi[0][:150] if loi else "")))
    b.close()

sys.stdout.reconfigure(encoding="utf-8")
with open(os.path.join(OUT, "ket-qua.txt"), "w", encoding="utf-8") as f:
    for k, t in KQ:
        f.write(f"{k} | {t}\n")
        print(k, "|", t)
