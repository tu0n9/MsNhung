"""Kiểm RLS và khoá sổ ở tầng database (không qua giao diện). Chạy sau all.py, dùng dữ liệu TEST nó tạo."""
import json, os, sys, urllib.request, urllib.error
from datetime import date, timedelta

env = dict(l.split("=", 1) for l in open(r"C:\Users\TIENTUONG\MsNhung\.env", encoding="utf-8").read().splitlines() if "=" in l and not l.startswith("#"))
U, K, S = env["VITE_SUPABASE_URL"].strip(), env["VITE_SUPABASE_PUBLISHABLE_KEY"].strip(), env["SUPABASE_SECRET_KEY"].strip()
KQ = []
HN = date.today().isoformat()  # all.py điểm danh, tạo buổi bù vào hôm nay


def goi(method, path, token=None, body=None, key=K, prefer=None):
    h = {"apikey": key, "Content-Type": "application/json"}
    if token:
        h["Authorization"] = "Bearer " + token
    if prefer:
        h["Prefer"] = prefer
    req = urllib.request.Request(U + path, method=method, headers=h, data=json.dumps(body).encode() if body is not None else None)
    try:
        with urllib.request.urlopen(req) as r:
            t = r.read().decode()
            return r.status, json.loads(t) if t else None
    except urllib.error.HTTPError as e:
        t = e.read().decode()
        return e.code, json.loads(t) if t else None


def tok(dinh_danh, mk):
    _, email = goi("POST", "/rest/v1/rpc/email_dang_nhap", body={"dinh_danh": dinh_danh})
    _, r = goi("POST", "/auth/v1/token?grant_type=password", body={"email": email, "password": mk})
    return r["access_token"]


def ok(ten, dung):
    KQ.append(("PASS" if dung else "FAIL", ten))


A = tok("admin", env["BREAK_GLASS_PASSWORD"].strip())
T = tok("testlan", "trogiang123")
P = tok("0922000002", "phuhuynh123")
SV = lambda m, p, b=None: goi(m, p, S, b, key=S)

ok("chưa đăng nhập: không đọc được học sinh", goi("GET", "/rest/v1/hoc_sinh?select=id")[0] in (401, 403))
ok("trợ giảng: chi_phi ra rỗng", goi("GET", "/rest/v1/chi_phi?select=id", T) == (200, []))
ok("trợ giảng: phiếu thu ra rỗng", goi("GET", "/rest/v1/phieu_thu?select=id", T) == (200, []))
ok("trợ giảng: gói học ra rỗng", goi("GET", "/rest/v1/goi_hoc?select=id", T) == (200, []))
ok("trợ giảng: không đọc được cột đơn giá trợ giảng", goi("GET", "/rest/v1/tro_giang_buoi?select=don_gia", T)[0] in (401, 403))
ok("trợ giảng: gọi hàm lương bị từ chối", goi("POST", "/rest/v1/rpc/luong_tro_giang", T, {"tu": "2026-11-01", "den": "2026-12-01"})[0] >= 400)
ok("trợ giảng: không sửa được học sinh (0 dòng)", goi("PATCH", "/rest/v1/hoc_sinh?ho_ten=like.TEST*", T, {"ghi_chu": "x"}, prefer="return=representation") == (200, []))
_, con = goi("GET", "/rest/v1/hoc_sinh?select=ho_ten", P)
ok(f"phụ huynh: chỉ thấy con mình ({[c['ho_ten'] for c in con]})", [c["ho_ten"] for c in con] == ["TEST Nguyễn Bảo An"])
_, tk = goi("GET", "/rest/v1/tai_khoan?select=vai_tro", P)
ok("phụ huynh: chỉ thấy tài khoản của chính mình", tk == [{"vai_tro": "phu_huynh"}])
goi("PATCH", "/rest/v1/diem_danh?sticker=gt.0", P, {"sticker": 99})
ok("phụ huynh: không sửa được điểm danh", SV("GET", "/rest/v1/diem_danh?select=sticker&sticker=eq.99") == (200, []))
ok("phụ huynh: không gọi được hàm tạo tài khoản",
   goi("POST", "/functions/v1/tai-khoan", P, {"hanh_dong": "tao", "vai_tro": "tro_giang", "ho_ten": "x", "ten_dang_nhap": "x"})[0] == 403)

# --- các lỗ do review pha R tìm ra (migration sua_sau_review) ---
_, ds_hs = SV("GET", "/rest/v1/hoc_sinh?select=id&ho_ten=like.TEST%20Nguy*B*An")
hs_id = ds_hs[0]["id"]
_, ds_goi = SV("GET", f"/rest/v1/goi_hoc?select=thang_bat_dau,so_thang&hoc_sinh_id=eq.{hs_id}")
g0 = ds_goi[0]  # gói 3 tháng từ 11/2026 do all.py tạo
c, r = goi("POST", "/rest/v1/goi_hoc", A, {"hoc_sinh_id": hs_id, "thang_bat_dau": "2026-12-01", "so_thang": 1, "don_gia": 100000, "buoi_du_kien": {"2026-12": 1}})
ok(f"gói chồng tháng bị database từ chối (gói có sẵn {g0['thang_bat_dau']} x{g0['so_thang']})", c == 400 and "gói" in json.dumps(r, ensure_ascii=False))
# trợ giảng đánh "Lớp nghỉ" và thêm buổi phụ được (chốt 2026-11-16); chỉ đụng lớp TEST vì database dùng chung với bản thật
_, lop_t = SV("GET", "/rest/v1/lop?select=id&ten=eq.TEST%20L%E1%BB%9Bp%20Starters")
_, buoi11 = SV("GET", f"/rest/v1/buoi_hoc?select=id,lop_nghi&lop_id=eq.{lop_t[0]['id']}&ngay=eq.{HN}&loai=eq.lich")
bid = buoi11[0]["id"]
c, r = goi("PATCH", f"/rest/v1/buoi_hoc?id=eq.{bid}", T, {"lop_nghi": True}, prefer="return=representation")
ok("trợ giảng đánh được \"Lớp nghỉ\"", c == 200 and len(r) == 1 and r[0]["lop_nghi"] is True)
goi("PATCH", f"/rest/v1/buoi_hoc?id=eq.{bid}", T, {"lop_nghi": False})
ok("trợ giảng tắt lại được \"Lớp nghỉ\"", SV("GET", f"/rest/v1/buoi_hoc?select=lop_nghi&id=eq.{bid}")[1][0]["lop_nghi"] is False)
c, r = goi("POST", "/rest/v1/buoi_hoc", T, {"lop_id": lop_t[0]["id"], "ngay": HN, "loai": "phu"}, prefer="return=representation")
ok("trợ giảng thêm được buổi phụ", c == 201 and len(r) == 1)
if c == 201:
    _, r2 = goi("DELETE", f"/rest/v1/buoi_hoc?id=eq.{r[0]['id']}", T, prefer="return=representation")
    ok("trợ giảng không xoá được buổi (0 dòng)", r2 == [] and len(SV("GET", f"/rest/v1/buoi_hoc?select=id&id=eq.{r[0]['id']}")[1]) == 1)
    SV("DELETE", f"/rest/v1/buoi_hoc?id=eq.{r[0]['id']}")

# lương theo ca (chốt 2026-11-16): buổi cùng ngày + cùng giờ bắt đầu là một ca, khác giờ thì thêm ca
_, tl = SV("GET", "/rest/v1/tai_khoan?select=id&ten_dang_nhap=eq.testlan")
tg_id = tl[0]["id"]
_, bl = SV("GET", f"/rest/v1/buoi_hoc?select=bat_dau,ket_thuc&id=eq.{bid}")
y, m = int(HN[:4]), int(HN[5:7])
khoang = {"tu": f"{y}-{m:02d}-01", "den": f"{y + m // 12}-{m % 12 + 1:02d}-01"}
so_ca = lambda: next((x["so_buoi"] for x in goi("POST", "/rest/v1/rpc/luong_tro_giang", A, khoang)[1] if x["tro_giang_id"] == tg_id), 0)
goi("POST", "/rest/v1/tro_giang_buoi", S, {"buoi_id": bid, "tro_giang_id": tg_id}, key=S, prefer="resolution=ignore-duplicates")
ca0 = so_ca()
them_buoi = lambda bd, kt: goi("POST", "/rest/v1/buoi_hoc", S, {"lop_id": lop_t[0]["id"], "ngay": HN, "loai": "phu", "bat_dau": bd, "ket_thuc": kt},
                               key=S, prefer="return=representation")[1][0]["id"]
b_cung = them_buoi(bl[0]["bat_dau"], bl[0]["ket_thuc"])
b_khac = them_buoi("05:00", "06:00")
try:
    SV("POST", "/rest/v1/tro_giang_buoi", {"buoi_id": b_cung, "tro_giang_id": tg_id})
    ok(f"lương: thêm lớp gộp cùng giờ {bl[0]['bat_dau']} không thêm ca ({ca0} ca)", bl[0]["bat_dau"] is not None and so_ca() == ca0)
    SV("POST", "/rest/v1/tro_giang_buoi", {"buoi_id": b_khac, "tro_giang_id": tg_id})
    ok("lương: buổi khác giờ thêm 1 ca", so_ca() == ca0 + 1)
finally:
    SV("DELETE", f"/rest/v1/tro_giang_buoi?buoi_id=in.({b_cung},{b_khac})")
    SV("DELETE", f"/rest/v1/buoi_hoc?id=in.({b_cung},{b_khac})")

# ảnh lớp gộp được chép sang từng buổi: trợ giảng phải chép được file
_, anh_t = SV("GET", f"/rest/v1/anh_buoi?select=duong_dan&buoi_id=eq.{bid}&limit=1")
if anh_t:
    dich = f"buoi/{bid}/test-chep.jpg"
    c, _ = goi("POST", "/storage/v1/object/copy", T, {"bucketId": "anh", "sourceKey": anh_t[0]["duong_dan"], "destinationKey": dich})
    ok("trợ giảng chép được ảnh lớp (ảnh chung cho lớp gộp)", c == 200)
    goi("DELETE", "/storage/v1/object/anh", S, {"prefixes": [dich]}, key=S)
_, anh = SV("GET", "/rest/v1/anh_buoi?select=id,duong_dan&limit=1")
if anh:
    c, r = goi("DELETE", f"/rest/v1/anh_buoi?id=eq.{anh[0]['id']}", T, prefer="return=representation")
    ok("trợ giảng không xoá được ảnh lớp (0 dòng)", r == [] and len(SV("GET", f"/rest/v1/anh_buoi?select=id&id=eq.{anh[0]['id']}")[1]) == 1)
    req = urllib.request.Request(f"{U}/storage/v1/object/anh/{anh[0]['duong_dan']}", method="DELETE", headers={"apikey": K, "Authorization": "Bearer " + T})
    try:
        urllib.request.urlopen(req)
    except urllib.error.HTTPError:
        pass
    c2 = urllib.request.urlopen(urllib.request.Request(f"{U}/storage/v1/object/authenticated/anh/{anh[0]['duong_dan']}", headers={"apikey": S, "Authorization": "Bearer " + S})).status
    ok("trợ giảng không xoá được file ảnh trong Storage", c2 == 200)
# đặt lại mật khẩu phụ huynh về số điện thoại, rồi thử bỏ cờ "bắt đổi" mà không đổi mật khẩu
_, ph = SV("GET", "/rest/v1/tai_khoan?select=id&so_dien_thoai=eq.0922000002")
goi("POST", "/functions/v1/tai-khoan", A, {"hanh_dong": "dat_lai", "id": ph[0]["id"]})
P2 = tok("0922000002", "0922000002")
ok("không bỏ được cờ bắt đổi mật khẩu khi mật khẩu vẫn là số điện thoại", goi("POST", "/rest/v1/rpc/da_doi_mat_khau", P2, {})[0] == 400)

_, bu = SV("GET", f"/rest/v1/buoi_hoc?select=id&loai=eq.bu&ngay=eq.{HN}")
ok("buổi bù riêng: chọn Không đến thì không còn dòng điểm danh nào", bool(bu) and SV("GET", f"/rest/v1/diem_danh?select=hoc_sinh_id&buoi_id=eq.{bu[0]['id']}")[1] == [])

# --- phiếu đánh giá (anon gọi qua hàm; database dùng chung nên link thật của tháng thì dùng lại, không đổi mã) ---
thang_nay = date.today().replace(day=1).isoformat()
_, lk = SV("GET", f"/rest/v1/link_danh_gia?select=ma&thang=eq.{thang_nay}")
tao_lk = not lk
MA = lk[0]["ma"] if lk else "testlinkdanhgia"
if tao_lk:
    SV("POST", "/rest/v1/link_danh_gia", {"thang": thang_nay, "ma": MA})
SV("POST", "/rest/v1/link_danh_gia", {"thang": "2020-01-01", "ma": "testhethan2020"})
try:
    PDG = lambda ma: goi("POST", "/rest/v1/rpc/phieu_danh_gia", body={"p_ma": ma})
    c, pd = PDG(MA)
    lop_dg = next((l["id"] for l in pd["lops"] if l["ten"] == "TEST Lớp Starters"), None) if c == 200 else None
    tg_dg = next((t["id"] for t in pd["tro_giangs"] if t["ho_ten"] == "TEST Trợ giảng Lan"), None) if c == 200 else None
    ok("phiếu: chưa đăng nhập mở link đúng thấy lớp, học sinh, trợ giảng TEST",
       bool(lop_dg and tg_dg) and any(h["id"] == hs_id and h["lop_id"] == lop_dg for h in pd["hoc_sinhs"]))
    ok("phiếu: mã sai bị từ chối", PDG("khongcomanay")[0] == 400)
    ok("phiếu: link tháng đã quá hạn bị từ chối", PDG("testhethan2020")[0] == 400)
    # all.py đã gửi phiếu cho em An: giáo viên xoá để thử lại từ đầu (cũng là thử quyền xoá của giáo viên)
    ok("phiếu: giáo viên xoá được phiếu", goi("DELETE", f"/rest/v1/danh_gia?hoc_sinh_id=eq.{hs_id}", A)[0] == 204)
    x = {"id": tg_dg, "kien_thuc": 5, "tuong_tac": 4, "ho_tro": 3}
    D = lambda **k: {"p_ma": MA, "p_lop": lop_dg, "p_hoc_sinh": hs_id, "p_khoa_hoc": "TEST", "p_kho_khan": "", "p_tro_giang": [x], **k}
    G = lambda body: goi("POST", "/rest/v1/rpc/gui_danh_gia", body=body)[0]
    ok("phiếu: điểm 6 bị từ chối", G(D(p_tro_giang=[{**x, "kien_thuc": 6}])) == 400)
    ok("phiếu: thiếu điểm bị từ chối", G(D(p_tro_giang=[{"id": tg_dg, "kien_thuc": 5}])) == 400)
    ok("phiếu: trợ giảng chọn trùng bị từ chối", G(D(p_tro_giang=[x, x])) == 400)
    ok("phiếu: id không phải trợ giảng bị từ chối", G(D(p_tro_giang=[{**x, "id": hs_id}])) == 400)
    ok("phiếu: học sinh không thuộc lớp bị từ chối", G(D(p_lop="00000000-0000-0000-0000-000000000000")) == 400)
    ok("phiếu: mã sai không gửi được", G(D(p_ma="khongcomanay")) == 400)
    ok("phiếu: gửi hợp lệ", G(D()) == 204)
    ok("phiếu: cùng em gửi lần 2 bị từ chối", G(D()) == 400)
    ok("phiếu: em đã gửi hiện da_gui", any(h["id"] == hs_id and h["da_gui"] for h in PDG(MA)[1]["hoc_sinhs"]))
    ok("phiếu: chưa đăng nhập không đọc được bảng", goi("GET", "/rest/v1/danh_gia?select=id")[0] in (401, 403))
    ok("phiếu: chưa đăng nhập không ghi thẳng vào bảng",
       goi("POST", "/rest/v1/danh_gia", body={"thang": thang_nay, "ten_lop": "TEST x", "ten_hoc_sinh": "x"})[0] in (401, 403))
    ok("phiếu: trợ giảng đọc bảng ra rỗng", goi("GET", "/rest/v1/danh_gia?select=id", T) == (200, []))
    goi("DELETE", f"/rest/v1/danh_gia?hoc_sinh_id=eq.{hs_id}", T)
    ok("phiếu: trợ giảng không xoá được phiếu", len(SV("GET", f"/rest/v1/danh_gia?select=id&hoc_sinh_id=eq.{hs_id}")[1]) == 1)
    ok("phiếu: trợ giảng không đọc được link", goi("GET", "/rest/v1/link_danh_gia?select=ma", T) == (200, []))
    _, dg = goi("GET", f"/rest/v1/danh_gia?select=ten_hoc_sinh,ten_lop,tro_giang&hoc_sinh_id=eq.{hs_id}", A)
    ok("phiếu: giáo viên đọc được, tên lấy từ database",
       dg and dg[0]["ten_hoc_sinh"] == "TEST Nguyễn Bảo An" and dg[0]["tro_giang"][0]["ten"] == "TEST Trợ giảng Lan")
    # tóm tắt AI: chỉ kiểm quyền và trường hợp không có phiếu, không gọi Gemini (khỏi phụ thuộc mạng ngoài, tốn lượt free)
    TT = lambda tk, thang: goi("POST", "/functions/v1/tom-tat-danh-gia", tk, {"thang": thang, "lop_id": lop_dg})
    ok("tóm tắt AI: chưa đăng nhập bị từ chối", TT(None, thang_nay[:7])[0] == 401)
    ok("tóm tắt AI: trợ giảng bị từ chối", TT(T, thang_nay[:7])[0] == 403)
    c, r = TT(A, "2020-01")
    ok("tóm tắt AI: lớp chưa có phiếu thì báo, không gọi Gemini", c == 400 and r.get("loi") == "Lớp chưa có phiếu")
    ok("tóm tắt AI: trợ giảng đọc bảng tóm tắt ra rỗng", goi("GET", "/rest/v1/tom_tat_danh_gia?select=lop_id", T) == (200, []))
finally:
    if tao_lk:
        SV("DELETE", f"/rest/v1/link_danh_gia?thang=eq.{thang_nay}")
    SV("DELETE", "/rest/v1/link_danh_gia?thang=eq.2020-01-01")

# --- cộng/trừ sticker ngoài buổi (migration sticker_cong_tru) ---
R = "return=representation"
c, st = goi("POST", "/rest/v1/sticker_cong_tru", T, {"hoc_sinh_id": hs_id, "so": 3, "ly_do": "Thưởng", "ten_nguoi": "Giả mạo"}, prefer=R)
ok("sticker: trợ giảng cộng được, người ghi lấy từ phiên đăng nhập (tên gửi lên bị bỏ)",
   c == 201 and st[0]["ten_nguoi"] == "TEST Trợ giảng Lan" and st[0]["ngay"] == HN)
st_id = st[0]["id"] if c == 201 else None
ok("sticker: trừ không lý do bị từ chối", goi("POST", "/rest/v1/sticker_cong_tru", T, {"hoc_sinh_id": hs_id, "so": -2, "ly_do": " "})[0] == 400)
ok("sticker: số 0 bị từ chối", goi("POST", "/rest/v1/sticker_cong_tru", T, {"hoc_sinh_id": hs_id, "so": 0})[0] == 400)
# ngày mai: tháng chưa chốt, nên bị chặn là do luật "chỉ hôm nay" chứ không phải khoá sổ
ok("sticker: ghi cho ngày khác hôm nay bị từ chối", goi("POST", "/rest/v1/sticker_cong_tru", T,
   {"hoc_sinh_id": hs_id, "so": 1, "ngay": (date.today() + timedelta(days=1)).isoformat()})[0] >= 400)
ok("sticker: phụ huynh không ghi được", goi("POST", "/rest/v1/sticker_cong_tru", P, {"hoc_sinh_id": hs_id, "so": 5})[0] >= 400)
goi("DELETE", f"/rest/v1/sticker_cong_tru?id=eq.{st_id}", P)
ok("sticker: phụ huynh không xoá được, đọc được của con", {"id": st_id} in goi("GET", "/rest/v1/sticker_cong_tru?select=id", P)[1])
c, st2 = goi("POST", "/rest/v1/sticker_cong_tru", T, {"hoc_sinh_id": hs_id, "so": -1, "ly_do": "Sửa sai"}, prefer=R)
ok("sticker: trợ giảng xoá được lần cộng/trừ", c == 201 and goi("DELETE", f"/rest/v1/sticker_cong_tru?id=eq.{st2[0]['id']}", T, prefer=R)[1] == st2)
_, h0 = SV("GET", f"/rest/v1/hoc_sinh?select=sticker_dau_ky&id=eq.{hs_id}")
_, dd0 = SV("GET", f"/rest/v1/diem_danh?select=sticker&hoc_sinh_id=eq.{hs_id}")
_, ct0 = SV("GET", f"/rest/v1/sticker_cong_tru?select=so&hoc_sinh_id=eq.{hs_id}")  # gồm cả lần all.py để lại
mong = h0[0]["sticker_dau_ky"] + sum(x["sticker"] for x in dd0) + sum(x["so"] for x in ct0)
_, tg_p = goi("GET", "/rest/v1/tong_sticker?select=hoc_sinh_id,tong", P)
ok(f"sticker: tong_sticker đúng ({mong}) và phụ huynh chỉ thấy con mình", tg_p == [{"hoc_sinh_id": hs_id, "tong": mong}])

# --- lớp nghỉ xoá điểm danh + trợ giảng của buổi (migration lop_nghi_xoa_diem_danh) ---
mai = (date.today() + timedelta(days=1)).isoformat()
_, bm = SV("GET", f"/rest/v1/buoi_hoc?select=id,lop_id&ngay=eq.{mai}&lop_id=eq.{SV('GET', f'/rest/v1/hoc_sinh?select=lop_id&id=eq.{hs_id}')[1][0]['lop_id']}")
if bm:
    b_id = bm[0]["id"]
    _, tlan = SV("GET", "/rest/v1/tai_khoan?select=id&ten_dang_nhap=eq.testlan")
    goi("POST", "/rest/v1/diem_danh", A, {"buoi_id": b_id, "hoc_sinh_id": hs_id, "trang_thai": "co_mat", "sticker": 2})
    goi("POST", "/rest/v1/tro_giang_buoi", A, {"buoi_id": b_id, "tro_giang_id": tlan[0]["id"]})
    goi("PATCH", f"/rest/v1/buoi_hoc?id=eq.{b_id}", A, {"lop_nghi": True})
    ok("lớp nghỉ: xoá hết điểm danh và trợ giảng của buổi",
       SV("GET", f"/rest/v1/diem_danh?select=hoc_sinh_id&buoi_id=eq.{b_id}")[1] == [] and
       SV("GET", f"/rest/v1/tro_giang_buoi?select=tro_giang_id&buoi_id=eq.{b_id}")[1] == [])
    ok("lớp nghỉ: không điểm danh được vào buổi đang nghỉ",
       goi("POST", "/rest/v1/diem_danh", T, {"buoi_id": b_id, "hoc_sinh_id": hs_id, "trang_thai": "co_mat"})[0] == 400)
    goi("PATCH", f"/rest/v1/buoi_hoc?id=eq.{b_id}", A, {"lop_nghi": False})
else:
    ok(f"lớp nghỉ: không có buổi ngày {mai} để kiểm (chạy ngày cuối tháng?)", False)

# --- nhật ký thao tác (migration nhat_ky) ---
_, nk1 = goi("GET", f"/rest/v1/nhat_ky?select=ten_nguoi,doi_tuong,thay_doi&bang=eq.sticker_cong_tru&hanh_dong=eq.them&order=id.desc&limit=1", A)
ok("nhật ký: lần trợ giảng cộng sticker có dòng, đúng người ghi và tên học sinh",
   nk1 and nk1[0]["ten_nguoi"] == "TEST Trợ giảng Lan" and nk1[0]["doi_tuong"] == "TEST Nguyễn Bảo An")
goi("PATCH", f"/rest/v1/hoc_sinh?id=eq.{hs_id}", A, {"ghi_chu": "TEST nhật ký"})
_, nk2 = goi("GET", f"/rest/v1/nhat_ky?select=thay_doi&bang=eq.hoc_sinh&hanh_dong=eq.sua&order=id.desc&limit=1", A)
ok("nhật ký: sửa học sinh chỉ ghi cột đổi", nk2 and list(nk2[0]["thay_doi"]) == ["ghi_chu"] and nk2[0]["thay_doi"]["ghi_chu"][1] == "TEST nhật ký")
ok("nhật ký: trợ giảng đọc ra rỗng", goi("GET", "/rest/v1/nhat_ky?select=id&limit=1", T) == (200, []))
ok("nhật ký: phụ huynh đọc ra rỗng", goi("GET", "/rest/v1/nhat_ky?select=id&limit=1", P) == (200, []))
ok("nhật ký: không ai ghi thẳng được", goi("POST", "/rest/v1/nhat_ky", A, {"bang": "x", "hanh_dong": "them"})[0] >= 400)
c, xoa_nk = goi("DELETE", "/rest/v1/nhat_ky?id=gt.0", A, prefer=R)
ok("nhật ký: giáo viên không xoá được", c >= 400 or xoa_nk == [])
ok("nhật ký: ghi đăng nhập", goi("POST", "/rest/v1/rpc/ghi_dang_nhap", T)[0] == 204 and
   goi("GET", "/rest/v1/nhat_ky?select=ten_nguoi&hanh_dong=eq.dang_nhap&order=id.desc&limit=1", A)[1] == [{"ten_nguoi": "TEST Trợ giảng Lan"}])

_, khoa_truoc = SV("GET", "/rest/v1/khoa_so?select=khoa_den")
# chỉ xoá nhật ký do test ghi: lọc theo id, không theo tháng (người dùng có thể đã chốt / mở khoá thật tháng 11)
_, nk = SV("GET", "/rest/v1/nhat_ky_chot_so?select=id&order=id.desc&limit=1")
nk_cuoi = nk[0]["id"] if nk else 0
# dòng điểm danh tháng 11 có thật của em TEST (không đoán theo số sticker: trúng 0 dòng thì PATCH trả 204, test báo sai)
_, dd_t11 = SV("GET", f"/rest/v1/diem_danh?select=buoi_id,sticker,buoi_hoc!inner(ngay)&hoc_sinh_id=eq.{hs_id}&buoi_hoc.ngay=gte.2026-11-01&buoi_hoc.ngay=lt.2026-12-01&limit=1")
dd_khoa = f"/rest/v1/diem_danh?buoi_id=eq.{dd_t11[0]['buoi_id']}&hoc_sinh_id=eq.{hs_id}" if dd_t11 else None
try:
    ok("chốt sổ tháng 11", goi("POST", "/rest/v1/rpc/chot_so", A, {"thang": "2026-11-01"})[0] == 204)
    ok("khoá: không thêm chi phí tháng 11", goi("POST", "/rest/v1/chi_phi", A, {"ngay": "2026-11-20", "danh_muc": "x", "so_tien": 1, "ghi_chu": "TEST e2e"})[0] == 400)
    ok("khoá: không sửa điểm danh tháng 11", bool(dd_khoa) and goi("PATCH", dd_khoa, A, {"sticker": dd_t11[0]["sticker"] + 1})[0] == 400)
    ok("khoá: không xoá phiếu thu tháng 11", goi("DELETE", "/rest/v1/phieu_thu?so_tien=eq.2000000", A)[0] == 400)
    ok("khoá: không cộng sticker tháng 11", goi("POST", "/rest/v1/sticker_cong_tru", T, {"hoc_sinh_id": hs_id, "so": 1})[0] == 400)
    ok("khoá: không xoá lần cộng sticker tháng 11", goi("DELETE", f"/rest/v1/sticker_cong_tru?id=eq.{st_id}", T)[0] == 400)
    ok("khoá: trợ giảng không mở khoá được", goi("POST", "/rest/v1/rpc/mo_khoa", T, {"thang": "2026-11-01", "ly_do": "x"})[0] == 400)
    ok("mở khoá thiếu lý do bị từ chối", goi("POST", "/rest/v1/rpc/mo_khoa", A, {"thang": "2026-11-01", "ly_do": " "})[0] == 400)
    ok("mở khoá có lý do", goi("POST", "/rest/v1/rpc/mo_khoa", A, {"thang": "2026-11-01", "ly_do": "TEST"})[0] == 204)
    ok("sau mở khoá sửa lại được", bool(dd_khoa) and goi("PATCH", dd_khoa, A, {"sticker": dd_t11[0]["sticker"]}, prefer="return=representation")[1] not in (None, []))
    goi("POST", "/rest/v1/rpc/chot_so", A, {"thang": "2026-11-01"})
    _, lop_st = SV("GET", "/rest/v1/lop?select=id&ten=eq.TEST%20L%E1%BB%9Bp%20Starters")
    c, _ = goi("POST", "/rest/v1/rpc/xoa_lop", A, {"p_lop": lop_st[0]["id"], "p_ten": "TEST Lớp Starters"})
    ok("khoá: xoá lớp có dữ liệu tháng đã chốt bị từ chối, không mất dòng nào",
       c == 400 and len(SV("GET", f"/rest/v1/buoi_hoc?select=id&lop_id=eq.{lop_st[0]['id']}")[1]) > 0)
finally:
    # trả khoá sổ về như trước test, xoá nhật ký do test ghi
    SV("PATCH", "/rest/v1/khoa_so?id=eq.true", {"khoa_den": khoa_truoc[0]["khoa_den"]})
    SV("DELETE", f"/rest/v1/nhat_ky_chot_so?id=gt.{nk_cuoi}")
    ok("khoá sổ đã trả về như trước", SV("GET", "/rest/v1/khoa_so?select=khoa_den")[1] == khoa_truoc)

# xoá hẳn lớp TEST Lớp Starters (có học sinh, điểm danh, gói, phiếu thu, trợ giảng, ảnh): phải sạch ở mọi bảng
lop_id = lop_st[0]["id"]
ok("trợ giảng không xoá được lớp", goi("POST", "/rest/v1/rpc/xoa_lop", T, {"p_lop": lop_id, "p_ten": "TEST Lớp Starters"})[0] == 400)
_, buoi_st = SV("GET", f"/rest/v1/buoi_hoc?select=id&lop_id=eq.{lop_id}")
bids = ",".join(b["id"] for b in buoi_st)
c, anh_xoa = goi("POST", "/rest/v1/rpc/xoa_lop", A, {"p_lop": lop_id, "p_ten": "TEST Lớp Starters"})
con_lai = {
    "lop": SV("GET", f"/rest/v1/lop?select=id&id=eq.{lop_id}")[1],
    "hoc_sinh": SV("GET", f"/rest/v1/hoc_sinh?select=id&id=eq.{hs_id}")[1],
    "buoi_hoc": SV("GET", f"/rest/v1/buoi_hoc?select=id&lop_id=eq.{lop_id}")[1],
    "diem_danh": SV("GET", f"/rest/v1/diem_danh?select=buoi_id&buoi_id=in.({bids})")[1],
    "goi_hoc": SV("GET", f"/rest/v1/goi_hoc?select=id&hoc_sinh_id=eq.{hs_id}")[1],
    "anh_buoi": SV("GET", f"/rest/v1/anh_buoi?select=id&buoi_id=in.({bids})")[1],
    "sticker_cong_tru": SV("GET", f"/rest/v1/sticker_cong_tru?select=id&hoc_sinh_id=eq.{hs_id}")[1],
}
ok(f"xoá lớp có dữ liệu: sạch mọi bảng, trả {len(anh_xoa) if c == 200 else '?'} đường dẫn ảnh",
   c == 200 and not any(con_lai.values()) and len(anh_xoa) >= 2)
_, dg = SV("GET", "/rest/v1/danh_gia?select=lop_id,hoc_sinh_id&ten_lop=eq.TEST%20L%E1%BB%9Bp%20Starters")
ok("xoá lớp: phiếu đánh giá của lớp vẫn giữ, chỉ bỏ liên kết", len(dg) == 1 and dg[0] == {"lop_id": None, "hoc_sinh_id": None})
# client xoá file theo danh sách trả về; ở đây làm thay để Storage không sót file test
if c == 200 and anh_xoa:
    goi("DELETE", "/storage/v1/object/anh", S, {"prefixes": anh_xoa}, key=S)

for k, t in KQ:
    print(k, "|", t)
