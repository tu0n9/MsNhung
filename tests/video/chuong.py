"""Kịch bản 8 video hướng dẫn. Chạy: python -I -X utf8 tests/video/chuong.py [số video ...]
Cần dev server http://127.0.0.1:5180. Các video nối tiếp nhau trên cùng một bộ dữ liệu mẫu (du_lieu_mau.tao),
xoá sạch sau khi quay. Video ra public/huong-dan/NN-ten.mp4 (trang Hướng dẫn trong app)."""
import os, re, subprocess, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import du_lieu_mau as dl
from khung import REPO, TAM, Quay
from playwright.sync_api import expect

GV, MK = "conhung", dl.MK_GV
E2E = os.path.join(REPO, "tests", "e2e")


def nav(v, ten):
    v.bam(v.p.locator("nav").get_by_text(ten, exact=True), 1.5)


def modal(v):
    return v.p.locator(".ant-modal:visible")


def v1_dang_nhap():
    with Quay("01-dang-nhap", "Đăng nhập và làm quen") as v:
        p = v.p
        p.goto("http://127.0.0.1:5180/")
        p.wait_for_timeout(1500)
        v.noi("Xin chào. Đây là app quản lý lớp của Anh ngữ Ms.Nhung. Video này hướng dẫn đăng nhập và làm quen với màn hình.")
        v.noi("Mỗi người có một tài khoản. Giáo viên, trợ giảng đăng nhập bằng tên đăng nhập. Phụ huynh đăng nhập bằng số điện thoại.")
        cho = v.noi_trong_khi("Ví dụ trợ giảng Lan đăng nhập lần đầu: gõ tên đăng nhập, mật khẩu ban đầu là số điện thoại của cô.")
        v.go(p.get_by_label("Tên đăng nhập hoặc số điện thoại", exact=True), "colan")
        v.go(p.get_by_label("Mật khẩu", exact=True), "0900100009")
        cho()
        v.bam(p.get_by_role("button", name="Đăng nhập"), 2.5)
        v.noi("Lần đầu đăng nhập, app bắt đặt mật khẩu mới. Mật khẩu mới không được trùng số điện thoại.")
        v.go(p.get_by_label("Mật khẩu mới", exact=True), "Lan@2026")
        v.go(p.get_by_label("Nhập lại", exact=True), "Lan@2026")
        v.bam(p.get_by_role("button", name="Lưu"), 2.5)
        v.noi("Đã vào app. Thanh dưới cùng là các mục chính. Trợ giảng chỉ thấy Điểm danh, Lớp và Tài khoản, không thấy tiền.")
        v.chi(p.locator("nav"))
        v.bam(p.get_by_role("button", name="Thoát"), 2)
        cho = v.noi_trong_khi("Giáo viên đăng nhập thì thấy đủ năm mục: Điểm danh, Lớp, Học phí, Chi phí và Tài khoản.")
        v.dang_nhap(GV, MK)
        cho()
        for ten in ["Điểm danh", "Lớp", "Học phí", "Chi phí", "Tài khoản"]:
            v.chi(p.locator("nav").get_by_text(ten, exact=True))
            p.wait_for_timeout(700)
        v.noi("Nút Hướng dẫn ở góc trên mở lại các video này bất cứ lúc nào.")
        v.chi(p.get_by_role("button", name="Hướng dẫn"))
        p.wait_for_timeout(1200)
        v.noi("Muốn đổi mật khẩu thì vào Tài khoản, bấm Đổi mật khẩu của tôi.")
        nav(v, "Tài khoản")
        v.chi(p.get_by_role("button", name="Đổi mật khẩu của tôi"))
        p.wait_for_timeout(1500)
        v.noi("Mẹo: trên điện thoại, mở trang bằng Chrome, bấm menu ba chấm, chọn Thêm vào màn hình chính. App sẽ có biểu tượng như một ứng dụng.", 1)


def v2_lop_hoc_sinh():
    with Quay("02-lop-va-hoc-sinh", "Lớp và học sinh") as v:
        p = v.p
        v.dang_nhap(GV, MK)
        v.noi("Video này hướng dẫn tạo lớp và thêm học sinh. Vào mục Lớp ở thanh dưới.")
        nav(v, "Lớp")
        v.noi("Bấm Thêm lớp. Nhập tên lớp, đơn giá một buổi, và đánh dấu những ngày trong tuần lớp có học.")
        v.bam(p.get_by_role("button", name="Thêm lớp"))
        m = modal(v)
        v.go(m.get_by_label("Tên lớp", exact=True), "Flyers A")
        v.go(m.get_by_label("Đơn giá một buổi (đ)", exact=True), "180000")
        for t in ["T7", "CN"]:
            v.bam(m.get_by_text(t, exact=True), 0.4)
        v.noi("Lịch tuần rất quan trọng: app dựa vào đó để tự tạo các buổi học và tính số buổi trong học phí.")
        v.noi("Ô Giờ học ghi giờ lớp học để phụ huynh xem. Lớp học khác giờ giữa các thứ thì ghi rõ từng thứ.")
        v.go(m.get_by_label("Giờ học", exact=True), "T7 8:00, CN 9:30")
        v.bam(m.get_by_role("button", name="Lưu"), 2)
        v.noi("Tiếp theo, bấm Thêm học sinh. Nhập họ tên và chọn lớp.")
        v.bam(p.get_by_role("button", name="Thêm học sinh"))
        m = modal(v)
        v.go(m.get_by_label("Họ tên", exact=True), "Đỗ Hải Yến")
        v.bam(m.get_by_label("Lớp", exact=True), 0.6)
        v.bam(p.locator(".ant-select-dropdown:visible .ant-select-item-option", has_text="Flyers A"), 0.6)
        v.noi("Bấm Chụp hoặc chọn ảnh để thêm ảnh đại diện, giúp nhận mặt khi điểm danh.")
        m.locator("input[type=file]").set_input_files(os.path.join(E2E, "avatar.jpg"))
        p.wait_for_timeout(800)
        cho = v.noi_trong_khi("Nhập tên và số điện thoại phụ huynh. App tự tạo tài khoản cho phụ huynh, mật khẩu ban đầu là số điện thoại.")
        v.go(m.get_by_label("Tên phụ huynh", exact=True), "Chị Mai")
        v.go(m.get_by_label(re.compile("SĐT phụ huynh")), "0900100005")
        cho()
        v.noi("Nếu em đã có sticker từ sổ giấy, nhập vào ô Sticker đã có. Rồi bấm Lưu.")
        v.go(m.get_by_label(re.compile("Sticker đã có")), "4")
        v.bam(m.get_by_role("button", name="Lưu"), 3)
        v.noi("Học sinh đã nằm trong lớp. Bấm Sửa để sửa thông tin. Bấm Ngừng khi em nghỉ học hẳn: em ẩn khỏi điểm danh nhưng vẫn giữ lịch sử và công nợ.")
        row = p.locator(".ant-list-item", has_text="Đỗ Hải Yến")
        v.chi(row.get_by_text("Sửa", exact=True))
        p.wait_for_timeout(1200)
        v.chi(row.get_by_text("Ngừng", exact=True))
        p.wait_for_timeout(1200)
        v.noi("Nút Xoá chỉ dùng cho học sinh nhập nhầm, chưa có dữ liệu nào. Em đã đi học thì app không cho xoá để sổ sách không bị sai.", 1)


def v3_import():
    with Quay("03-import-excel", "Import lớp và học sinh bằng Excel") as v:
        p = v.p
        v.dang_nhap(GV, MK)
        v.noi("Nếu có nhiều học sinh, nhập một lần bằng file Excel. Vào mục Lớp, bấm Import Excel.")
        nav(v, "Lớp")
        v.bam(p.get_by_role("button", name="Import Excel"), 1.5)
        v.noi("Bước một: bấm Tải file mẫu. File có ba trang: Hướng dẫn, Lớp và Học sinh. Các lớp đang có đã điền sẵn.")
        with p.expect_download() as dl_:
            v.bam(p.get_by_role("button", name="Tải file mẫu"), 1)
        mau = os.path.join(TAM, "mau.xlsx")
        dl_.value.save_as(mau)
        da_dien = os.path.join(TAM, "da-dien.xlsx")
        subprocess.run(["node", "tests/video/dien-mau-video.mjs", mau, da_dien], cwd=REPO, check=True)
        v.noi("Mở file bằng Excel, điền mỗi dòng một học sinh. Cột Lớp chọn trong ô thả xuống. Cột có dấu sao là bắt buộc.")
        v.noi("Bước hai: lưu file rồi bấm vào ô Chọn file và chọn file vừa điền.")
        p.locator("input[type=file]").set_input_files(da_dien)
        p.wait_for_timeout(2500)
        v.noi("Bước ba: app kiểm tra từng dòng. Dòng nào sai được báo ở khung đỏ phía trên, kèm lý do.")
        v.chi(p.locator("[role=alert]"))
        p.wait_for_timeout(1500)
        v.noi("Dòng màu xanh là dòng mới sẽ được thêm. Dòng Đã có là học sinh đã có trong app, sẽ được bỏ qua, không bị nhập trùng.")
        v.bam(p.locator(".ant-segmented").get_by_text(re.compile("^Đã có")), 1.5)
        v.bam(p.locator(".ant-segmented").get_by_text(re.compile("^Tất cả")), 1)
        v.noi("Bấm nút Nhập để thêm các dòng mới. Dòng lỗi thì sửa trong file rồi import lại chính file đó, những dòng đã nhập sẽ tự bỏ qua.")
        v.bam(p.get_by_role("button", name=re.compile(r"^Nhập \d+ dòng mới$")), 1)
        expect(p.get_by_text(re.compile("^Đã thêm"))).to_be_visible(timeout=60000)
        v.noi("Xong. App báo đã thêm bao nhiêu lớp, bao nhiêu học sinh và đã tạo tài khoản cho phụ huynh.", 1)


def v4_diem_danh():
    with Quay("04-diem-danh", "Điểm danh, sticker, ảnh lớp, học bù") as v:
        p = v.p
        v.dang_nhap(GV, MK)
        v.noi("Video này hướng dẫn điểm danh. Mục Điểm danh hiện các buổi học của ngày đang chọn, theo lịch của từng lớp.")
        v.noi("Bấm Điểm danh ở lớp cần điểm danh.")
        v.bam(p.locator(".ant-list-item", has_text="Movers 2").get_by_role("button", name="Điểm danh"), 2)
        v.noi("Đầu tiên tích tên trợ giảng có mặt buổi này. App dùng thông tin này để tính lương trợ giảng cuối tháng.")
        v.bam(p.get_by_text("Cô Lan", exact=True), 1)
        v.noi("Với từng em: chọn Có mặt hoặc Vắng. Em nào vắng sẽ được tính một buổi chưa học bù, học phí không bị trừ.")
        for ten in ["Nguyễn Minh Anh", "Trần Gia Bảo", "Lê Khánh Linh"]:
            v.bam(p.locator(".ant-list-item", has_text=ten).get_by_text("Có mặt", exact=True), 0.5)
        v.bam(p.locator(".ant-list-item", has_text="Phạm Đức Huy").get_by_text("Vắng", exact=True), 0.8)
        v.noi("Ô có ngôi sao là số sticker em đạt trong buổi. Dòng dưới tên hiện tổng sticker tích luỹ từ trước đến nay.")
        o = p.locator(".ant-list-item", has_text="Nguyễn Minh Anh").locator(".ant-input-number input")
        o.evaluate("e => e.select()")
        v.go(o, "3")
        p.keyboard.press("Tab")
        p.wait_for_timeout(1200)
        v.noi("Cuối buổi, bấm Chụp hoặc chọn ảnh để lưu ảnh cả lớp làm minh chứng. Chụp được nhiều ảnh, phụ huynh của em có mặt sẽ xem được.")
        p.locator("input[type=file]").last.set_input_files(os.path.join(E2E, "lop.jpg"))
        p.wait_for_timeout(4000)
        v.noi("Nếu cả lớp được nghỉ, như ngày lễ, bật công tắc Lớp nghỉ. Buổi lớp nghỉ được tính thành tiền dư, trừ vào gói học sau.")
        v.chi(p.get_by_text("Lớp nghỉ", exact=True))
        p.wait_for_timeout(1500)
        v.noi("Mọi thứ được lưu ngay khi bấm, không cần nút Lưu. Giờ ta xem cách cho em Huy học bù.")
        v.bam(p.get_by_role("button", name="← Quay lại"), 1.5)
        v.noi("Bấm Thêm buổi phụ hoặc bù. Chọn Buổi bù riêng và chọn lớp, rồi bấm Đồng ý.")
        v.bam(p.get_by_role("button", name="Thêm buổi phụ / bù"))
        m = modal(v)
        v.bam(m.get_by_text("Buổi bù riêng"), 0.6)
        v.bam(m.locator(".ant-select"), 0.6)
        v.bam(p.locator(".ant-select-dropdown:visible .ant-select-item-option", has_text="Movers 2"), 0.6)
        v.bam(m.get_by_role("button", name=re.compile("^(OK|Đồng ý)$")), 2)
        v.bam(p.locator(".ant-list-item", has_text="Buổi bù").get_by_role("button", name="Điểm danh"), 2)
        v.noi("Trong buổi bù, em nào đến thì chọn Học bù, số buổi chưa bù giảm đi một. Em không đến thì để Không đến, không bị tính gì.")
        v.bam(p.locator(".ant-list-item", has_text="Phạm Đức Huy").get_by_text("Học bù", exact=True), 1.2)
        v.noi("Nếu em đi học bù cùng một lớp khác, mở buổi của lớp đó và dùng ô Thêm học sinh lớp khác học bù buổi này.")
        v.bam(p.get_by_role("button", name="← Quay lại"), 1.5)
        v.noi("Muốn xem cả tháng của một em, vào Lớp và bấm tên em đó.")
        nav(v, "Lớp")
        v.bam(p.get_by_text("Phạm Đức Huy"), 2)
        luoi = p.locator(".ant-card", has_text="Điểm danh tháng")
        luoi.scroll_into_view_if_needed()
        v.noi("Lưới Điểm danh tháng tô màu từng ngày: xanh lá là có mặt, đỏ là vắng, xanh dương có chữ bù là học bù, xám gạch ngang là lớp nghỉ.")
        v.noi("Ô nền vàng viền vàng là buổi đã qua mà chưa điểm danh, nhìn vào là biết buổi nào còn quên. Ô viền đen là hôm nay.")
        v.noi("Chạm vào một ngày để xem chi tiết. Hôm nay em Huy vắng buổi chính nhưng đã học bù ở buổi bù riêng.")
        v.bam(p.locator('[data-ngay="2026-11-15"]'), 1.5)
        v.chi(p.locator("[data-chi-tiet-ngay]"))
        p.wait_for_timeout(1500)
        v.noi("Phụ huynh cũng thấy đúng lưới này trên trang của con mình.", 1)


def v5_thu_hoc_phi():
    with Quay("05-thu-hoc-phi", "Ghi học phí và thu tiền") as v:
        p = v.p
        v.dang_nhap(GV, MK)
        v.noi("Video này hướng dẫn ghi học phí cần thu và ghi số tiền phụ huynh đã đóng. Cả hai đều làm ở nút Thu tiền.")
        nav(v, "Lớp")
        v.noi("Bước một: vào Lớp, bấm vào tên học sinh.")
        v.bam(p.get_by_text("Nguyễn Minh Anh"), 2)
        p.get_by_role("button", name="Thu tiền").scroll_into_view_if_needed()
        v.noi("Kéo xuống phần Học phí. Em chưa có gói học nào nên học phí đang là không đồng.")
        v.noi("Bước hai: bấm Thu tiền, chọn Đóng gói mới.")
        v.bam(p.get_by_role("button", name="Thu tiền"), 1.5)
        m = modal(v)
        v.bam(m.get_by_text("Đóng gói mới"))
        v.noi("Gói là khoá học đóng trước một, hai hoặc ba tháng. Chọn số tháng và tháng bắt đầu. Ví dụ gói một tháng, từ tháng mười một.")
        v.bam(m.get_by_text("1 tháng", exact=True))
        v.chi(m.locator("p", has_text="Tổng gói"))
        v.noi("App tự đếm số buổi theo lịch lớp rồi nhân với đơn giá. Dòng Tổng gói chính là học phí cần thu.")
        v.noi("Nếu học sinh còn tiền dư từ gói trước, do lớp được nghỉ, app tự điền vào ô Trừ tiền dư. Giảm giá thì nhập số âm ở ô Điều chỉnh.")
        o = p.get_by_label(re.compile("Số tiền thu lần này"))
        o.scroll_into_view_if_needed()
        v.noi("Bước ba: phụ huynh chưa đóng tiền thì để Số tiền thu lần này bằng không, rồi bấm Lưu. App ghi học phí và tính là còn nợ.")
        v.bam(m.get_by_role("button", name="Lưu"), 2.5)
        p.locator(".ant-descriptions").scroll_into_view_if_needed()
        v.noi("Học phí tháng này đã có. Còn phải thu bằng đúng tổng gói.")
        v.noi("Bước bốn: phụ huynh đóng đợt một, năm trăm nghìn. Bấm Thu tiền lần nữa, chọn Trả gói đang nợ.")
        v.bam(p.get_by_role("button", name="Thu tiền"), 1.5)
        m = modal(v)
        v.bam(m.get_by_text("Trả gói đang nợ"), 1)
        v.noi("App chọn sẵn gói đang nợ và cho biết còn nợ bao nhiêu. Nhập số tiền, chọn ngày thu và hình thức: tiền mặt hay chuyển khoản.")
        v.go(p.get_by_label(re.compile("Số tiền thu lần này")), "500000")
        v.bam(m.get_by_role("button", name="Lưu"), 2.5)
        p.locator(".ant-descriptions").scroll_into_view_if_needed()
        v.noi("Đã thu năm trăm nghìn. Còn phải thu giảm tương ứng, và bảng Các lần thu ghi lại từng đợt.")
        v.noi("Bước năm: đợt sau đóng nốt phần còn lại, làm lại y như bước bốn.")
        v.bam(p.get_by_role("button", name="Thu tiền"), 1.5)
        m = modal(v)
        v.bam(m.get_by_text("Trả gói đang nợ"), 1)
        con = int(re.sub(r"\D", "", m.locator(".ant-select").first.inner_text().split("còn nợ")[-1]))
        v.go(p.get_by_label(re.compile("Số tiền thu lần này")), str(con))
        v.bam(m.get_by_role("button", name="Lưu"), 2.5)
        p.locator(".ant-descriptions").scroll_into_view_if_needed()
        v.noi("Còn phải thu bằng không: em đã đóng đủ tháng này.")
        v.noi("Mẹo: phụ huynh đóng hai hay ba tháng một lần thì chọn gói hai hoặc ba tháng ở bước hai. Các tháng sau sẽ hiện Đã đủ, đóng trước.", 1)


def v6_chi_phi():
    with Quay("06-chi-phi", "Chi phí và lương trợ giảng") as v:
        p = v.p
        v.dang_nhap(GV, MK)
        v.noi("Video này hướng dẫn ghi chi phí của trung tâm. Vào mục Chi phí.")
        nav(v, "Chi phí")
        v.noi("Lương trợ giảng được app tự tính từ các buổi trợ giảng có mặt, nhân đơn giá một buổi. Không cần nhập tay.")
        v.chi(p.locator(".ant-card", has_text="Lương trợ giảng"))
        p.wait_for_timeout(1500)
        v.noi("Các khoản chi khác thì bấm Thêm khoản chi. Chọn mục có sẵn hoặc gõ tên mục mới, nhập số tiền và ngày chi.")
        v.bam(p.get_by_role("button", name="Thêm khoản chi"))
        m = modal(v)
        v.go(m.get_by_label(re.compile("^Mục")), "Thuê phòng")
        p.keyboard.press("Escape")
        v.go(m.get_by_label("Số tiền", exact=True), "2000000")
        v.go(m.get_by_label("Ghi chú", exact=True), "video mẫu")
        v.bam(m.get_by_role("button", name="Lưu"), 2)
        v.noi("Khi hoàn học phí cho học sinh nghỉ hẳn, chọn mục Hoàn học phí và chọn tên học sinh. App sẽ trừ khoản này khỏi tiền dư của em đó.")
        v.noi("Tổng chi ở trên cùng gồm cả lương trợ giảng. Con số này được dùng để tính chênh lệch thu chi ở tab Học phí.", 1)
        v.chi(p.get_by_text(re.compile("^Tổng chi")).first)
        p.wait_for_timeout(1500)


def v7_hoc_phi():
    with Quay("07-hoc-phi-chot-so-excel", "Tab Học phí, nhắn phụ huynh, chốt sổ, xuất Excel") as v:
        p = v.p
        v.dang_nhap(GV, MK)
        v.noi("Tab Học phí là sổ thu chi của trung tâm theo tháng. Chọn tháng ở ô trên cùng.")
        nav(v, "Học phí")
        p.wait_for_timeout(1500)
        v.noi("Khối số liệu cho biết: phải thu, nợ kỳ trước, đã thu, thực thu trong tháng, tổng chi, chênh lệch thu chi, và tổng số tiền còn phải thu.")
        v.noi("Bên dưới là danh sách học sinh theo lớp. Bấm Còn nợ để chỉ xem các em chưa đóng đủ.")
        v.bam(p.locator(".ant-segmented").get_by_text(re.compile("^Còn nợ")), 1.5)
        v.bam(p.locator(".ant-segmented").get_by_text("Tất cả", exact=True), 1)
        v.noi("Em nào đóng trước nhiều tháng sẽ hiện Đã đủ, đóng trước.")
        v.chi(p.get_by_text("Đã đủ (đóng trước)").first)
        p.wait_for_timeout(1500)
        v.noi("Bấm vào một em còn nợ để nhắn phụ huynh. Nút Sao chép tin nhắn soạn sẵn học phí tháng này, nợ cũ, đã thu và số cần nộp, để dán vào Zalo.")
        v.bam(p.locator("button", has_text="Trần Gia Bảo"), 2)
        v.bam(p.get_by_role("button", name="Sao chép tin nhắn"), 2)
        v.bam(p.get_by_role("button", name="← Quay lại"), 2)
        v.noi("Bấm Xuất Excel để tải sổ học phí của tháng: tổng hợp, từng lớp, điểm danh, sổ thu, chi phí, công nợ và trợ giảng.")
        with p.expect_download():
            v.bam(p.get_by_role("button", name="Xuất Excel"), 2)
        v.noi("Cuối tháng, khi đã thu chi xong, bấm Chốt sổ tháng. Sau khi chốt, số liệu của tháng không sửa được nữa, tránh sửa nhầm.")
        v.bam(p.get_by_role("button", name="Chốt sổ tháng"), 1)
        v.bam(p.locator(".ant-modal-confirm").get_by_role("button", name=re.compile("^(OK|Đồng ý)$")), 2)
        v.noi("App hỏi có tải bản sao lưu không. Nên bấm Tải sao lưu và cất file vào máy. Ở đây ta bỏ qua.")
        v.bam(p.locator(".ant-modal-confirm").get_by_role("button", name=re.compile("^(Cancel|Huỷ|Hủy)$")), 1.5)
        v.noi("Cần sửa lại tháng đã chốt thì bấm Mở khoá và ghi lý do. App ghi lại ai mở khoá và vì sao.")
        v.bam(p.get_by_role("button", name="Mở khoá"), 1)
        v.go(p.locator(".ant-modal-confirm input"), "Sửa phiếu thu nhập nhầm")
        v.bam(p.locator(".ant-modal-confirm").get_by_role("button", name=re.compile("^(OK|Đồng ý)$")), 2)
        v.noi("Ngoài ra, nút Sao lưu toàn bộ tải toàn bộ dữ liệu về máy. Hệ thống cũng tự sao lưu mỗi đêm.", 1)


def v8_phu_huynh():
    with Quay("08-phu-huynh", "Phụ huynh xem thông tin của con") as v:
        p = v.p
        p.goto("http://127.0.0.1:5180/")
        p.wait_for_timeout(1200)
        v.noi("Video này dành cho phụ huynh. Phụ huynh mở đường link app, đăng nhập bằng số điện thoại đã đăng ký với trung tâm.")
        v.go(p.get_by_label("Tên đăng nhập hoặc số điện thoại", exact=True), "0900100001")
        v.noi("Lần đầu, mật khẩu chính là số điện thoại.")
        v.go(p.get_by_label("Mật khẩu", exact=True), "0900100001")
        v.bam(p.get_by_role("button", name="Đăng nhập"), 2.5)
        v.noi("App bắt đặt mật khẩu mới. Lần sau đăng nhập bằng mật khẩu mới này.")
        v.go(p.get_by_label("Mật khẩu mới", exact=True), "MinhAnh@2026")
        v.go(p.get_by_label("Nhập lại", exact=True), "MinhAnh@2026")
        v.bam(p.get_by_role("button", name="Lưu"), 3)
        v.noi("Phụ huynh thấy thông tin của con: số buổi đi học trong tháng, tổng sticker, số buổi chưa học bù và số tiền cần nộp.")
        v.noi("Dưới tên con là lớp và giờ học. Lưới Điểm danh tháng tô màu từng ngày: xanh lá là con có mặt, đỏ là vắng, xanh dương có chữ bù là học bù, xám là lớp nghỉ.")
        luoi = p.locator(".ant-card", has_text="Điểm danh tháng")
        luoi.scroll_into_view_if_needed()
        v.chi(luoi)
        p.wait_for_timeout(1000)
        v.noi("Chạm vào một ngày để xem buổi đó con có mặt không và được mấy sticker. Ví dụ ngày năm con vắng, ngày sáu con đã học bù ở lớp khác.")
        v.bam(p.locator('[data-ngay="2026-11-05"]'), 1.5)
        v.bam(p.locator('[data-ngay="2026-11-06"]'), 1.5)
        v.noi("Kéo xuống nữa để xem ảnh lớp các buổi con có mặt, và chi tiết học phí.")
        for nhan in ["Ảnh lớp", "Học phí"]:
            loc = p.get_by_text(re.compile("^" + nhan)).first
            if loc.count():
                v.chi(loc)
                p.wait_for_timeout(1500)
        v.noi("Nhà có nhiều con học ở trung tâm thì mỗi con là một thẻ ở trên cùng. Quên mật khẩu thì nhờ trung tâm đặt lại. Liên kết Xem hướng dẫn ở cuối trang mở lại video này.", 1)


CHUONG = [v1_dang_nhap, v2_lop_hoc_sinh, v3_import, v4_diem_danh, v5_thu_hoc_phi, v6_chi_phi, v7_hoc_phi, v8_phu_huynh]

if __name__ == "__main__":
    chon = [int(x) for x in sys.argv[1:]] or list(range(1, 9))
    os.makedirs(TAM, exist_ok=True)
    dl.xoa()
    dl.tao()
    try:
        for i in chon:
            print("quay video", i)
            CHUONG[i - 1]()
    finally:
        dl.xoa()
