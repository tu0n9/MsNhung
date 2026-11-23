"""Kiểm RLS, khoá sổ và nghiệp vụ học sinh nhiều lớp ở tầng database. Chạy độc lập hoặc sau all.py (tự tạo dữ liệu TEST nếu thiếu)."""
import http.client, json, os, re, sys, time, urllib.request, urllib.error, uuid
from datetime import date, timedelta

D = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(D))
env = dict(l.split("=", 1) for l in open(os.path.join(REPO, ".env"), encoding="utf-8").read().splitlines() if "=" in l and not l.startswith("#"))
U, K, S = env["VITE_SUPABASE_URL"].strip(), env["VITE_SUPABASE_PUBLISHABLE_KEY"].strip(), env["SUPABASE_SECRET_KEY"].strip()
KQ = []
HN = date.today().isoformat()
thang_nay_dt = date.today().replace(day=1)
thang_nay = thang_nay_dt.isoformat()
thang_sau = (thang_nay_dt + timedelta(days=32)).replace(day=1).isoformat()
THANG_MA = thang_nay[:7]


def goi(method, path, token=None, body=None, key=K, prefer=None):
    h = {"apikey": key, "Content-Type": "application/json"}
    if token:
        h["Authorization"] = "Bearer " + token
    if prefer:
        h["Prefer"] = prefer
    req = urllib.request.Request(U + path, method=method, headers=h, data=json.dumps(body).encode() if body is not None else None)
    # mạng tới Supabase hay bị ngắt giữa chừng: thử lại lệnh đọc / sửa / xoá (chạy lại vẫn cùng kết quả).
    # POST không thử lại vì có thể đã ghi xong mà mất phản hồi, thử lại sẽ tạo trùng.
    lan = 3 if method in ("GET", "PATCH", "DELETE") else 1
    for i in range(lan):
        try:
            with urllib.request.urlopen(req) as r:
                t = r.read().decode()
                return r.status, json.loads(t) if t else None
        except urllib.error.HTTPError as e:
            t = e.read().decode()
            return e.code, json.loads(t) if t else None
        except (urllib.error.URLError, http.client.RemoteDisconnected, ConnectionError):
            if i == lan - 1:
                raise
            time.sleep(1.5)


def tai_anh_len(duong_dan, tep_local):
    with open(os.path.join(D, tep_local), "rb") as f:
        du_lieu = f.read()
    req = urllib.request.Request(
        f"{U}/storage/v1/object/anh/{duong_dan}", method="POST", data=du_lieu,
        headers={"apikey": S, "Authorization": "Bearer " + S, "Content-Type": "image/jpeg", "x-upsert": "true"},
    )
    with urllib.request.urlopen(req) as r:
        return r.status


def tok(dinh_danh, mk):
    _, email = goi("POST", "/rest/v1/rpc/email_dang_nhap", body={"dinh_danh": dinh_danh})
    _, r = goi("POST", "/auth/v1/token?grant_type=password", body={"email": email, "password": mk})
    return r["access_token"]


def ok(ten, dung):
    KQ.append(("PASS" if dung else "FAIL", ten))


A = tok("admin", env["BREAK_GLASS_PASSWORD"].strip())
SV = lambda m, p, b=None, prefer=None: goi(m, p, S, b, key=S, prefer=prefer)


def chuan_bi_neu_thieu():
    # Tự tạo dữ liệu TEST Starters nếu api.py được chạy độc lập (không chạy all.py trước)
    if not SV("GET", "/rest/v1/tai_khoan?select=id&ten_dang_nhap=eq.testlan")[1]:
        c, _ = goi("POST", "/functions/v1/tai-khoan", A, {
            "hanh_dong": "tao", "vai_tro": "tro_giang", "ho_ten": "TEST Trợ giảng Lan",
            "ten_dang_nhap": "testlan", "so_dien_thoai": "0911000001", "don_gia_buoi": 80000,
        })
        assert c == 200, f"không tạo được testlan ({c})"
        t0 = tok("testlan", "0911000001")
        goi("PUT", "/auth/v1/user", t0, {"password": "trogiang123"})
        goi("POST", "/rest/v1/rpc/da_doi_mat_khau", t0, {})

    lop_st = SV("GET", "/rest/v1/lop?select=id&ten=eq.TEST%20L%E1%BB%9Bp%20Starters")[1]
    if not lop_st:
        gio = {str(d): {"bd": "16:45", "kt": "18:15"} for d in range(7)}
        _, res = SV("POST", "/rest/v1/lop", {"ten": "TEST Lớp Starters", "don_gia": 100000, "lich": [0, 1, 2, 3, 4, 5, 6], "gio_thu": gio}, prefer="return=representation")
        lop_st = res
    lop_st_id = lop_st[0]["id"]

    ds_hs = SV("GET", "/rest/v1/hoc_sinh?select=id,avatar,ma_hs,don_gia&ho_ten=eq.TEST%20Nguy%E1%BB%85n%20B%E1%BA%A3o%20An")[1]
    if not ds_hs:
        _, res = SV("POST", "/rest/v1/hoc_sinh", {
            "ho_ten": "TEST Nguyễn Bảo An", "don_gia": 100000, "ngay_vao": thang_nay,
            "ten_phu_huynh": "TEST Chị Hoa", "sdt_phu_huynh": "0922000002", "sticker_dau_ky": 5,
        }, prefer="return=representation")
        ds_hs = res
        SV("POST", "/rest/v1/ghi_danh", {"hoc_sinh_id": ds_hs[0]["id"], "lop_id": lop_st_id, "ngay_vao": thang_nay, "trang_thai": "dang_hoc"})
    hs_id = ds_hs[0]["id"]
    if not ds_hs[0].get("avatar"):
        av = f"avatar/{hs_id}-test.jpg"
        tai_anh_len(av, "avatar.jpg")
        SV("PATCH", f"/rest/v1/hoc_sinh?id=eq.{hs_id}", {"avatar": av})

    mai = (date.today() + timedelta(days=1)).isoformat()
    if not SV("GET", f"/rest/v1/buoi_hoc?select=id&lop_id=eq.{lop_st_id}&ngay=eq.{HN}&loai=eq.lich")[1]:
        SV("POST", "/rest/v1/buoi_hoc", {"lop_id": lop_st_id, "ngay": HN, "loai": "lich", "bat_dau": "16:45", "ket_thuc": "18:15"})
    if not SV("GET", f"/rest/v1/buoi_hoc?select=id&lop_id=eq.{lop_st_id}&ngay=eq.{mai}&loai=eq.lich")[1]:
        SV("POST", "/rest/v1/buoi_hoc", {"lop_id": lop_st_id, "ngay": mai, "loai": "lich", "bat_dau": "16:45", "ket_thuc": "18:15"})
    if not SV("GET", f"/rest/v1/buoi_hoc?select=id&lop_id=eq.{lop_st_id}&ngay=eq.{HN}&loai=eq.bu")[1]:
        SV("POST", "/rest/v1/buoi_hoc", {"lop_id": lop_st_id, "ngay": HN, "loai": "bu", "bat_dau": "19:30", "ket_thuc": "21:00"})

    bid_hn = SV("GET", f"/rest/v1/buoi_hoc?select=id&lop_id=eq.{lop_st_id}&ngay=eq.{HN}&loai=eq.lich")[1][0]["id"]
    # Buổi phụ riêng trong tháng để giữ 1 dòng điểm danh kiểm khoá sổ (tránh bị xoá khi test bật "Lớp nghỉ" trên bid_hn)
    buoi_phu = SV("GET", f"/rest/v1/buoi_hoc?select=id&lop_id=eq.{lop_st_id}&ngay=eq.{HN}&loai=eq.phu")[1]
    if not buoi_phu:
        _, buoi_phu = SV("POST", "/rest/v1/buoi_hoc", {"lop_id": lop_st_id, "ngay": HN, "loai": "phu", "bat_dau": "14:00", "ket_thuc": "15:30"}, prefer="return=representation")
    bid_dd = buoi_phu[0]["id"]
    if not SV("GET", f"/rest/v1/diem_danh?select=buoi_id&buoi_id=eq.{bid_dd}&hoc_sinh_id=eq.{hs_id}")[1]:
        SV("POST", "/rest/v1/diem_danh", {"buoi_id": bid_dd, "hoc_sinh_id": hs_id, "trang_thai": "co_mat", "sticker": 3})
    if not SV("GET", f"/rest/v1/anh_buoi?select=id&buoi_id=eq.{bid_hn}")[1]:
        duong_anh = f"buoi/{bid_hn}/test-api.jpg"
        tai_anh_len(duong_anh, "lop.jpg")
        SV("POST", "/rest/v1/anh_buoi", {"buoi_id": bid_hn, "duong_dan": duong_anh})
    if not SV("GET", f"/rest/v1/goi_hoc?select=id&hoc_sinh_id=eq.{hs_id}")[1]:
        _, goi_moi = SV("POST", "/rest/v1/goi_hoc", {
            "hoc_sinh_id": hs_id, "thang_bat_dau": thang_nay, "so_thang": 3, "don_gia": 100000, "buoi_du_kien": {THANG_MA: 30},
        }, prefer="return=representation")
        SV("POST", "/rest/v1/phieu_thu", {"goi_id": goi_moi[0]["id"], "so_tien": 2000000, "ngay_thu": HN, "hinh_thuc": "tien_mat"})


chuan_bi_neu_thieu()
T = tok("testlan", "trogiang123")

ok("chưa đăng nhập: không đọc được học sinh", goi("GET", "/rest/v1/hoc_sinh?select=id")[0] in (401, 403))
ok("chưa đăng nhập: không đọc được ghi_danh", goi("GET", "/rest/v1/ghi_danh?select=id")[0] in (401, 403))
ok("phụ huynh: không còn tài khoản phu_huynh đang hoạt động", SV("GET", "/rest/v1/tai_khoan?select=id&vai_tro=eq.phu_huynh&hoat_dong=eq.true") == (200, []))
ok("tài khoản: admin không tạo được vai trò phu_huynh (403)",
   goi("POST", "/functions/v1/tai-khoan", A, {"hanh_dong": "tao", "vai_tro": "phu_huynh", "ho_ten": "TEST PH", "so_dien_thoai": "0933000003"})[0] == 403)

# --- Guard RBAC: tài khoản phụ huynh & tài khoản bị khoá (hoat_dong = false) ---
_rbac_uids = []
try:
    def _tao_tam(ho_ten, vai_tro, sdt):
        email = f"test-{uuid.uuid4().hex[:10]}@msnhung.local"
        mk = "TestRbac123!"
        c_u, u_res = goi("POST", "/auth/v1/admin/users", S, {"email": email, "password": mk, "email_confirm": True}, key=S)
        assert c_u in (200, 201), f"tạo auth user tạm lỗi ({c_u}): {u_res}"
        uid = u_res["id"]
        _rbac_uids.append(uid)
        c_tk, tk_res = SV("POST", "/rest/v1/tai_khoan", {
            "id": uid, "email": email, "ten_dang_nhap": f"test_{uuid.uuid4().hex[:8]}",
            "so_dien_thoai": sdt, "ho_ten": ho_ten, "vai_tro": vai_tro,
            "hoat_dong": False, "phai_doi_mat_khau": True, "don_gia_buoi": 0,
        })
        assert c_tk == 201, f"tạo tai_khoan tạm lỗi ({c_tk}): {tk_res}"
        _, tok_res = goi("POST", "/auth/v1/token?grant_type=password", body={"email": email, "password": mk})
        return uid, tok_res["access_token"]

    ph_sdt_tam = f"0998{uuid.uuid4().int % 1000000:06d}"
    ph_uid, ph_tok = _tao_tam("TEST Phụ huynh khoá", "phu_huynh", ph_sdt_tam)
    tg_khoa_sdt = f"0997{uuid.uuid4().int % 1000000:06d}"
    tg_khoa_uid, tg_khoa_tok = _tao_tam("TEST Trợ giảng khoá", "tro_giang", tg_khoa_sdt)

    ok("phụ huynh: admin gọi dat_lai mật khẩu bị từ chối (403)",
       goi("POST", "/functions/v1/tai-khoan", A, {"hanh_dong": "dat_lai", "id": ph_uid})[0] == 403)
    ok("phụ huynh: email_dang_nhap trả None",
       goi("POST", "/rest/v1/rpc/email_dang_nhap", body={"dinh_danh": ph_sdt_tam}) == (200, None))
    ok("phụ huynh: tự PATCH tai_khoan hoat_dong=true bị RLS chặn (0 dòng)",
       goi("PATCH", f"/rest/v1/tai_khoan?id=eq.{ph_uid}", ph_tok, {"hoat_dong": True}, prefer="return=representation") == (200, []))
    ok("phụ huynh: đọc học sinh ra rỗng",
       goi("GET", "/rest/v1/hoc_sinh?select=id", ph_tok) == (200, []))
    ok("tài khoản khoá (hoat_dong=false): email_dang_nhap trả None",
       goi("POST", "/rest/v1/rpc/email_dang_nhap", body={"dinh_danh": tg_khoa_sdt}) == (200, None))
    ok("tài khoản khoá: tự PATCH tai_khoan hoat_dong=true bị RLS chặn (0 dòng)",
       goi("PATCH", f"/rest/v1/tai_khoan?id=eq.{tg_khoa_uid}", tg_khoa_tok, {"hoat_dong": True}, prefer="return=representation") == (200, []))
    ok("tài khoản khoá: đọc học sinh ra rỗng",
       goi("GET", "/rest/v1/hoc_sinh?select=id", tg_khoa_tok) == (200, []))
finally:
    for _uid in _rbac_uids:
        goi("DELETE", f"/auth/v1/admin/users/{_uid}", S, key=S)
ok("trợ giảng: không gọi được hàm tạo tài khoản (403)",
   goi("POST", "/functions/v1/tai-khoan", T, {"hanh_dong": "tao", "vai_tro": "phu_huynh", "ho_ten": "TEST PH", "so_dien_thoai": "0933000003"})[0] == 403)
ok("trợ giảng: chi_phi ra rỗng", goi("GET", "/rest/v1/chi_phi?select=id", T) == (200, []))
ok("trợ giảng: phiếu thu ra rỗng", goi("GET", "/rest/v1/phieu_thu?select=id", T) == (200, []))
ok("trợ giảng: gói học ra rỗng", goi("GET", "/rest/v1/goi_hoc?select=id", T) == (200, []))
ok("trợ giảng: không đọc được cột đơn giá trợ giảng", goi("GET", "/rest/v1/tro_giang_buoi?select=don_gia", T)[0] in (401, 403))
ok("trợ giảng: gọi hàm lương bị từ chối", goi("POST", "/rest/v1/rpc/luong_tro_giang", T, {"tu": thang_nay, "den": thang_sau})[0] >= 400)
ok("trợ giảng: không sửa được học sinh (0 dòng)", goi("PATCH", "/rest/v1/hoc_sinh?ho_ten=like.TEST*", T, {"ghi_chu": "x"}, prefer="return=representation") == (200, []))

# --- RLS ghi_danh & ma_hs / don_gia ---
_, ds_hs = SV("GET", "/rest/v1/hoc_sinh?select=id,ma_hs,don_gia&ho_ten=like.TEST%20Nguy*B*An")
hs_id = ds_hs[0]["id"]
ok("học sinh mới: tự sinh ma_hs (HSxxx) và có don_gia cố định", bool(re.match(r"^HS\d{3,}$", ds_hs[0]["ma_hs"])) and ds_hs[0]["don_gia"] == 100000)
ok("ma_hs_tu_stt: 1 -> HS001", goi("POST", "/rest/v1/rpc/ma_hs_tu_stt", A, {"n": 1}) == (200, "HS001"))
ok("ma_hs_tu_stt: 999 -> HS999", goi("POST", "/rest/v1/rpc/ma_hs_tu_stt", A, {"n": 999}) == (200, "HS999"))
ok("ma_hs_tu_stt: 1000 -> HS1000", goi("POST", "/rest/v1/rpc/ma_hs_tu_stt", A, {"n": 1000}) == (200, "HS1000"))
ok("ma_hs_tu_stt: 12345 -> HS12345", goi("POST", "/rest/v1/rpc/ma_hs_tu_stt", A, {"n": 12345}) == (200, "HS12345"))
ok("ma_hs_tu_stt: chưa đăng nhập (anon) bị từ chối", goi("POST", "/rest/v1/rpc/ma_hs_tu_stt", body={"n": 1})[0] >= 400)
ok("sinh_ma_hs: chưa đăng nhập (anon) bị từ chối", goi("POST", "/rest/v1/rpc/sinh_ma_hs")[0] >= 400)
_, gd_tg = goi("GET", f"/rest/v1/ghi_danh?select=id,lop_id&hoc_sinh_id=eq.{hs_id}", T)
ok("ghi_danh: trợ giảng đọc được", bool(gd_tg))
ok("ghi_danh: trợ giảng không thêm được", goi("POST", "/rest/v1/ghi_danh", T, {"hoc_sinh_id": hs_id, "lop_id": gd_tg[0]["lop_id"]})[0] >= 400)
ok("ghi_danh: trợ giảng không sửa được (0 dòng)", goi("PATCH", f"/rest/v1/ghi_danh?id=eq.{gd_tg[0]['id']}", T, {"trang_thai": "ngung"}, prefer="return=representation") == (200, []))
ok("ghi_danh: trợ giảng không xoá được (0 dòng)", goi("DELETE", f"/rest/v1/ghi_danh?id=eq.{gd_tg[0]['id']}", T, prefer="return=representation") == (200, []))

# --- các luật database cốt lõi ---
_, ds_goi = SV("GET", f"/rest/v1/goi_hoc?select=id,thang_bat_dau,so_thang&hoc_sinh_id=eq.{hs_id}")
g0 = ds_goi[0]
c, r = goi("POST", "/rest/v1/goi_hoc", A, {"hoc_sinh_id": hs_id, "thang_bat_dau": thang_sau, "so_thang": 1, "don_gia": 100000, "buoi_du_kien": {thang_sau[:7]: 1}})
ok(f"gói chồng tháng bị database từ chối (gói có sẵn {g0['thang_bat_dau']} x{g0['so_thang']})", c == 400 and "gói" in json.dumps(r, ensure_ascii=False))

# kiểm tra goi_hoc.lop_gia lưu & đọc được đúng snapshot lớp + giá
lop_gia_mau = [{"lop_id": gd_tg[0]["lop_id"], "ngay_vao": thang_nay, "don_gia": 150000}]
c_lg, r_lg = goi("POST", "/rest/v1/goi_hoc", A, {
    "hoc_sinh_id": hs_id, "thang_bat_dau": "2030-01-01", "so_thang": 1, "don_gia": 150000,
    "buoi_du_kien": {"2030-01": 4}, "lop_gia": lop_gia_mau,
}, prefer="return=representation")
lg_id = r_lg[0]["id"] if c_lg == 201 and r_lg else None
try:
    _, doc_lg = goi("GET", f"/rest/v1/goi_hoc?select=lop_gia&id=eq.{lg_id}", A) if lg_id else (0, None)
    ok("goi_hoc: giáo viên lưu và đọc được cột lop_gia", c_lg == 201 and doc_lg == [{"lop_gia": lop_gia_mau}])
finally:
    if lg_id:
        SV("DELETE", f"/rest/v1/goi_hoc?id=eq.{lg_id}")

# kiểm tra database chặn gói học có tổng tiền âm (tien_du_tru hoặc dieu_chinh âm vượt tổng học phí gốc), vẫn cho phép gói 0đ
c_am1, r_am1 = goi("POST", "/rest/v1/goi_hoc", A, {
    "hoc_sinh_id": hs_id, "thang_bat_dau": "2030-02-01", "so_thang": 1, "don_gia": 100000,
    "buoi_du_kien": {"2030-02": 4}, "tien_du_tru": 1500000,
}, prefer="return=representation")
c_am2, r_am2 = goi("POST", "/rest/v1/goi_hoc", A, {
    "hoc_sinh_id": hs_id, "thang_bat_dau": "2030-03-01", "so_thang": 1, "don_gia": 100000,
    "buoi_du_kien": {"2030-03": 4}, "dieu_chinh": -500000, "ly_do_dieu_chinh": "TEST giảm quá mức",
}, prefer="return=representation")
c_0d, r_0d = goi("POST", "/rest/v1/goi_hoc", A, {
    "hoc_sinh_id": hs_id, "thang_bat_dau": "2030-04-01", "so_thang": 1, "don_gia": 0,
    "buoi_du_kien": {"2030-04": 4},
}, prefer="return=representation")
try:
    ok("goi_hoc: chặn gói âm do tien_du_tru vượt học phí gốc (400)", c_am1 == 400)
    ok("goi_hoc: chặn gói âm do dieu_chinh âm vượt học phí gốc (400)", c_am2 == 400)
    ok("goi_hoc: cho phép gói 0đ có tổng bằng 0 (201)", c_0d == 201)
finally:
    SV("DELETE", f"/rest/v1/goi_hoc?hoc_sinh_id=eq.{hs_id}&thang_bat_dau=gte.2030-02-01")

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

# lương theo ca: buổi cùng ngày + cùng giờ bắt đầu là một ca, khác giờ thì thêm ca
_, tl = SV("GET", "/rest/v1/tai_khoan?select=id&ten_dang_nhap=eq.testlan")
tg_id = tl[0]["id"]
_, bl = SV("GET", f"/rest/v1/buoi_hoc?select=bat_dau,ket_thuc&id=eq.{bid}")
khoang = {"tu": thang_nay, "den": thang_sau}
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
_, anh = SV("GET", f"/rest/v1/anh_buoi?select=id,duong_dan&buoi_id=eq.{bid}&limit=1")
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

_, bu = SV("GET", f"/rest/v1/buoi_hoc?select=id&loai=eq.bu&ngay=eq.{HN}")
ok("buổi bù riêng: chọn Không đến thì không còn dòng điểm danh nào", bool(bu) and SV("GET", f"/rest/v1/diem_danh?select=hoc_sinh_id&buoi_id=eq.{bu[0]['id']}")[1] == [])

# --- phiếu đánh giá qua ghi_danh (anon gọi qua hàm; giữ 1 phiếu/em/tháng kể cả khi học nhiều lớp) ---
_, lk = SV("GET", f"/rest/v1/link_danh_gia?select=ma&thang=eq.{thang_nay}")
tao_lk = not lk
MA = lk[0]["ma"] if lk else "testlinkdanhgia"
if tao_lk:
    SV("POST", "/rest/v1/link_danh_gia", {"thang": thang_nay, "ma": MA})
SV("POST", "/rest/v1/link_danh_gia", {"thang": "2020-01-01", "ma": "testhethan2020"})
_, lop_b_res = SV("POST", "/rest/v1/lop", {"ten": "TEST Lớp Phụ API", "don_gia": 150000, "lich": [2, 4], "gio_thu": {}}, prefer="return=representation")
lop_b_id = lop_b_res[0]["id"]
_, gd_b_tam = SV("POST", "/rest/v1/ghi_danh", {"hoc_sinh_id": hs_id, "lop_id": lop_b_id, "ngay_vao": thang_nay, "trang_thai": "dang_hoc"}, prefer="return=representation")
try:
    PDG = lambda ma: goi("POST", "/rest/v1/rpc/phieu_danh_gia", body={"p_ma": ma})
    c, pd = PDG(MA)
    lop_dg = next((l["id"] for l in pd["lops"] if l["ten"] == "TEST Lớp Starters"), None) if c == 200 else None
    tg_dg = next((t["id"] for t in pd["tro_giangs"] if t["ho_ten"] == "TEST Trợ giảng Lan"), None) if c == 200 else None
    ok("phiếu: chưa đăng nhập mở link đúng thấy lớp, học sinh, trợ giảng TEST",
       bool(lop_dg and tg_dg) and any(h["id"] == hs_id and h["lop_id"] == lop_dg for h in pd["hoc_sinhs"])
       and any(h["id"] == hs_id and h["lop_id"] == lop_b_id for h in pd["hoc_sinhs"]))
    ok("phiếu: mã sai bị từ chối", PDG("khongcomanay")[0] == 400)
    ok("phiếu: link tháng đã quá hạn bị từ chối", PDG("testhethan2020")[0] == 400)
    goi("DELETE", f"/rest/v1/danh_gia?hoc_sinh_id=eq.{hs_id}", A)
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
    ok("phiếu: em học 2 lớp chỉ gửi tối đa 1 phiếu/tháng (từ chối ở lớp thứ 2)", G(D(p_lop=lop_b_id)) == 400)
    pd2 = PDG(MA)[1]["hoc_sinhs"]
    ok("phiếu: em đã gửi hiện da_gui ở cả 2 lớp",
       any(h["id"] == hs_id and h["lop_id"] == lop_dg and h["da_gui"] for h in pd2)
       and any(h["id"] == hs_id and h["lop_id"] == lop_b_id and h["da_gui"] for h in pd2))
    ok("phiếu: giáo viên xoá được phiếu rồi gửi lại để test xoa_lop giữ lịch sử",
       goi("DELETE", f"/rest/v1/danh_gia?hoc_sinh_id=eq.{hs_id}", A)[0] == 204 and G(D()) == 204)
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
    # tóm tắt AI: chỉ kiểm quyền và trường hợp không có phiếu, không gọi Gemini
    TT = lambda tk, thang: goi("POST", "/functions/v1/tom-tat-danh-gia", tk, {"thang": thang, "lop_id": lop_dg})
    ok("tóm tắt AI: chưa đăng nhập bị từ chối", TT(None, THANG_MA)[0] == 401)
    ok("tóm tắt AI: trợ giảng bị từ chối", TT(T, THANG_MA)[0] == 403)
    c, r = TT(A, "2020-01")
    ok("tóm tắt AI: lớp chưa có phiếu thì báo, không gọi Gemini", c == 400 and r.get("loi") == "Lớp chưa có phiếu")
    ok("tóm tắt AI: trợ giảng đọc bảng tóm tắt ra rỗng", goi("GET", "/rest/v1/tom_tat_danh_gia?select=lop_id", T) == (200, []))
finally:
    SV("DELETE", f"/rest/v1/ghi_danh?id=eq.{gd_b_tam[0]['id']}")
    if tao_lk:
        SV("DELETE", f"/rest/v1/link_danh_gia?thang=eq.{thang_nay}")
    SV("DELETE", "/rest/v1/link_danh_gia?thang=eq.2020-01-01")

# --- cộng/trừ sticker ngoài buổi ---
R = "return=representation"
c, st = goi("POST", "/rest/v1/sticker_cong_tru", T, {"hoc_sinh_id": hs_id, "so": 3, "ly_do": "Thưởng", "ten_nguoi": "Giả mạo"}, prefer=R)
ok("sticker: trợ giảng cộng được, người ghi lấy từ phiên đăng nhập (tên gửi lên bị bỏ)",
   c == 201 and st[0]["ten_nguoi"] == "TEST Trợ giảng Lan" and st[0]["ngay"] == HN)
st_id = st[0]["id"] if c == 201 else None
ok("sticker: trừ không lý do bị từ chối", goi("POST", "/rest/v1/sticker_cong_tru", T, {"hoc_sinh_id": hs_id, "so": -2, "ly_do": " "})[0] == 400)
ok("sticker: số 0 bị từ chối", goi("POST", "/rest/v1/sticker_cong_tru", T, {"hoc_sinh_id": hs_id, "so": 0})[0] == 400)
ok("sticker: ghi cho ngày khác hôm nay bị từ chối", goi("POST", "/rest/v1/sticker_cong_tru", T,
   {"hoc_sinh_id": hs_id, "so": 1, "ngay": (date.today() + timedelta(days=1)).isoformat()})[0] >= 400)
c, st2 = goi("POST", "/rest/v1/sticker_cong_tru", T, {"hoc_sinh_id": hs_id, "so": -1, "ly_do": "Sửa sai"}, prefer=R)
ok("sticker: trợ giảng xoá được lần cộng/trừ", c == 201 and goi("DELETE", f"/rest/v1/sticker_cong_tru?id=eq.{st2[0]['id']}", T, prefer=R)[1] == st2)
_, h0 = SV("GET", f"/rest/v1/hoc_sinh?select=sticker_dau_ky&id=eq.{hs_id}")
_, dd0 = SV("GET", f"/rest/v1/diem_danh?select=sticker&hoc_sinh_id=eq.{hs_id}")
_, ct0 = SV("GET", f"/rest/v1/sticker_cong_tru?select=so&hoc_sinh_id=eq.{hs_id}")
mong = h0[0]["sticker_dau_ky"] + sum(x["sticker"] for x in dd0) + sum(x["so"] for x in ct0)
_, tg_a = goi("GET", f"/rest/v1/tong_sticker?select=hoc_sinh_id,tong&hoc_sinh_id=eq.{hs_id}", A)
ok(f"sticker: tong_sticker đúng ({mong})", tg_a == [{"hoc_sinh_id": hs_id, "tong": mong}])

# --- gop_hoc_sinh RPC ---
_, hs_giu_res = SV("POST", "/rest/v1/hoc_sinh", {"ho_ten": "TEST Gộp Giữ", "don_gia": 100000, "sticker_dau_ky": 2, "ngay_vao": thang_nay, "avatar": "avatar/test-gop-giu.jpg"}, prefer=R)
_, hs_bo_res = SV("POST", "/rest/v1/hoc_sinh", {"ho_ten": "TEST Gộp Bỏ", "don_gia": 120000, "sticker_dau_ky": 4, "ngay_vao": thang_nay, "avatar": "avatar/test-gop-bo.jpg"}, prefer=R)
hs_giu, hs_bo = hs_giu_res[0]["id"], hs_bo_res[0]["id"]
khoa_truoc_gop = SV("GET", "/rest/v1/khoa_so?select=khoa_den")[1][0]["khoa_den"]
b_chot_1 = SV("POST", "/rest/v1/buoi_hoc", {"lop_id": lop_t[0]["id"], "ngay": "2025-05-10", "loai": "phu", "bat_dau": "07:00", "ket_thuc": "08:30"}, prefer=R)[1][0]["id"]
b_chot_2 = SV("POST", "/rest/v1/buoi_hoc", {"lop_id": lop_t[0]["id"], "ngay": "2025-05-12", "loai": "phu", "bat_dau": "07:00", "ket_thuc": "08:30"}, prefer=R)[1][0]["id"]
b_mo = SV("POST", "/rest/v1/buoi_hoc", {"lop_id": lop_t[0]["id"], "ngay": HN, "loai": "phu", "bat_dau": "07:00", "ket_thuc": "08:30"}, prefer=R)[1][0]["id"]
try:
    SV("POST", "/rest/v1/ghi_danh", {"hoc_sinh_id": hs_giu, "lop_id": lop_t[0]["id"], "ngay_vao": thang_nay, "trang_thai": "dang_hoc"})
    SV("POST", "/rest/v1/ghi_danh", {"hoc_sinh_id": hs_bo, "lop_id": lop_b_id, "ngay_vao": thang_nay, "trang_thai": "dang_hoc"})
    SV("POST", "/rest/v1/sticker_cong_tru", {"hoc_sinh_id": hs_giu, "so": 3, "ly_do": "TEST thưởng", "ten_nguoi": "Admin"})
    SV("POST", "/rest/v1/sticker_cong_tru", {"hoc_sinh_id": hs_bo, "so": 1, "ly_do": "TEST thưởng 2", "ten_nguoi": "Admin"})
    _, g_giu = SV("POST", "/rest/v1/goi_hoc", {"hoc_sinh_id": hs_giu, "thang_bat_dau": thang_nay, "so_thang": 1, "don_gia": 100000, "buoi_du_kien": {THANG_MA: 4}}, prefer=R)
    _, g_bo = SV("POST", "/rest/v1/goi_hoc", {"hoc_sinh_id": hs_bo, "thang_bat_dau": thang_nay, "so_thang": 1, "don_gia": 120000, "buoi_du_kien": {THANG_MA: 4}}, prefer=R)
    ok("gop_hoc_sinh: trợ giảng bị từ chối", goi("POST", "/rest/v1/rpc/gop_hoc_sinh", T, {"p_giu": hs_giu, "p_bo": hs_bo})[0] == 400)
    ok("gop_hoc_sinh: từ chối khi p_giu trùng p_bo hoặc thiếu tham số",
       goi("POST", "/rest/v1/rpc/gop_hoc_sinh", A, {"p_giu": hs_giu, "p_bo": hs_giu})[0] == 400
       and goi("POST", "/rest/v1/rpc/gop_hoc_sinh", A, {"p_giu": hs_giu, "p_bo": None})[0] == 400)
    ok("gop_hoc_sinh: từ chối khi UUID không tồn tại",
       goi("POST", "/rest/v1/rpc/gop_hoc_sinh", A, {"p_giu": hs_giu, "p_bo": "00000000-0000-0000-0000-000000000000"})[0] == 400)
    c_trung, _ = goi("POST", "/rest/v1/rpc/gop_hoc_sinh", A, {"p_giu": hs_giu, "p_bo": hs_bo})
    ok("gop_hoc_sinh: từ chối khi 2 hồ sơ đều có gói chồng tháng", c_trung == 400 and bool(SV("GET", f"/rest/v1/hoc_sinh?select=id&id=eq.{hs_bo}")[1]))
    SV("DELETE", f"/rest/v1/goi_hoc?id=eq.{g_bo[0]['id']}")

    SV("POST", "/rest/v1/diem_danh", [
        {"buoi_id": b_chot_1, "hoc_sinh_id": hs_giu, "trang_thai": "vang", "sticker": 1},
        {"buoi_id": b_chot_1, "hoc_sinh_id": hs_bo, "trang_thai": "co_mat", "sticker": 2},
        {"buoi_id": b_chot_2, "hoc_sinh_id": hs_bo, "trang_thai": "co_mat", "sticker": 1},
        {"buoi_id": b_mo, "hoc_sinh_id": hs_giu, "trang_thai": "vang", "sticker": 1},
        {"buoi_id": b_mo, "hoc_sinh_id": hs_bo, "trang_thai": "co_mat", "sticker": 2},
    ])
    SV("PATCH", "/rest/v1/khoa_so?id=eq.true", {"khoa_den": "2025-05-01"})
    c_chot_trung, _ = goi("POST", "/rest/v1/rpc/gop_hoc_sinh", A, {"p_giu": hs_giu, "p_bo": hs_bo})
    ok("gop_hoc_sinh: từ chối khi 2 hồ sơ có điểm danh trùng buổi ở tháng đã chốt sổ",
       c_chot_trung == 400 and len(SV("GET", f"/rest/v1/diem_danh?select=hoc_sinh_id&buoi_id=eq.{b_chot_1}")[1]) == 2)
    if c_chot_trung == 400:
        SV("PATCH", "/rest/v1/khoa_so?id=eq.true", {"khoa_den": khoa_truoc_gop})
        SV("DELETE", f"/rest/v1/diem_danh?buoi_id=eq.{b_chot_1}&hoc_sinh_id=eq.{hs_bo}")
        SV("PATCH", "/rest/v1/khoa_so?id=eq.true", {"khoa_den": "2025-05-01"})
    c_gop, anh_gop = goi("POST", "/rest/v1/rpc/gop_hoc_sinh", A, {"p_giu": hs_giu, "p_bo": hs_bo})
    _, gds_sau = SV("GET", f"/rest/v1/ghi_danh?select=lop_id,don_gia_rieng&hoc_sinh_id=eq.{hs_giu}")
    _, dd_mo = SV("GET", f"/rest/v1/diem_danh?select=trang_thai,sticker&buoi_id=eq.{b_mo}&hoc_sinh_id=eq.{hs_giu}")
    _, dd_chot = SV("GET", f"/rest/v1/diem_danh?select=buoi_id,sticker&buoi_id=in.({b_chot_1},{b_chot_2})&hoc_sinh_id=eq.{hs_giu}")
    _, tong_gop = SV("GET", f"/rest/v1/tong_sticker?select=tong&hoc_sinh_id=eq.{hs_giu}")
    ok("gop_hoc_sinh: gộp qua tháng đã chốt khi không trùng buổi và gộp điểm danh trùng ở tháng mở (co_mat, sticker 1+2=3)",
       c_gop == 200 and dd_mo == [{"trang_thai": "co_mat", "sticker": 3}] and len(dd_chot) == 2)
    gd_map_sau = {x["lop_id"]: x["don_gia_rieng"] for x in gds_sau}
    ok("gop_hoc_sinh: gộp ghi_danh (giữ bo.don_gia=120000 vào don_gia_rieng), sticker (15), xoá hồ sơ bỏ & trả avatar thừa",
       c_gop == 200 and anh_gop == "avatar/test-gop-bo.jpg"
       and not SV("GET", f"/rest/v1/hoc_sinh?select=id&id=eq.{hs_bo}")[1]
       and set(gd_map_sau) == {lop_t[0]["id"], lop_b_id}
       and gd_map_sau.get(lop_b_id) == 120000 and gd_map_sau.get(lop_t[0]["id"]) is None
       and tong_gop == [{"tong": 15}])
    # Kiểm tra đồng bộ hoc_sinh.trang_thai khi các ghi_danh sau gộp đều ngưng học
    hs_ng_1 = SV("POST", "/rest/v1/hoc_sinh", {"ho_ten": "TEST Gộp Ngưng 1", "don_gia": 100000, "ngay_vao": thang_nay, "trang_thai": "dang_hoc"}, prefer=R)[1][0]["id"]
    hs_ng_2 = SV("POST", "/rest/v1/hoc_sinh", {"ho_ten": "TEST Gộp Ngưng 2", "don_gia": 120000, "ngay_vao": thang_nay, "trang_thai": "ngung"}, prefer=R)[1][0]["id"]
    try:
        SV("POST", "/rest/v1/ghi_danh", [
            {"hoc_sinh_id": hs_ng_1, "lop_id": lop_t[0]["id"], "ngay_vao": thang_nay, "trang_thai": "ngung"},
            {"hoc_sinh_id": hs_ng_2, "lop_id": lop_b_id, "ngay_vao": thang_nay, "trang_thai": "ngung"},
        ])
        c_ng, _ = goi("POST", "/rest/v1/rpc/gop_hoc_sinh", A, {"p_giu": hs_ng_1, "p_bo": hs_ng_2})
        _, hs_ng_sau = SV("GET", f"/rest/v1/hoc_sinh?select=trang_thai&id=eq.{hs_ng_1}")
        ok("gop_hoc_sinh: đồng bộ hoc_sinh.trang_thai='ngung' khi toàn bộ ghi_danh sau gộp đều ngưng",
           c_ng == 200 and hs_ng_sau == [{"trang_thai": "ngung"}])
    finally:
        SV("DELETE", f"/rest/v1/ghi_danh?hoc_sinh_id=in.({hs_ng_1},{hs_ng_2})")
        SV("DELETE", f"/rest/v1/hoc_sinh?id=in.({hs_ng_1},{hs_ng_2})")
finally:
    SV("PATCH", "/rest/v1/khoa_so?id=eq.true", {"khoa_den": khoa_truoc_gop})
    SV("DELETE", f"/rest/v1/diem_danh?buoi_id=in.({b_chot_1},{b_chot_2},{b_mo})")
    SV("DELETE", f"/rest/v1/buoi_hoc?id=in.({b_chot_1},{b_chot_2},{b_mo})")
    SV("DELETE", f"/rest/v1/goi_hoc?hoc_sinh_id=in.({hs_giu},{hs_bo})")
    SV("DELETE", f"/rest/v1/sticker_cong_tru?hoc_sinh_id=in.({hs_giu},{hs_bo})")
    SV("DELETE", f"/rest/v1/ghi_danh?hoc_sinh_id=in.({hs_giu},{hs_bo})")
    SV("DELETE", f"/rest/v1/hoc_sinh?id=in.({hs_giu},{hs_bo})")

# --- lớp nghỉ xoá điểm danh + trợ giảng của buổi ---
mai = (date.today() + timedelta(days=1)).isoformat()
_, gd_an = SV("GET", f"/rest/v1/ghi_danh?select=lop_id&hoc_sinh_id=eq.{hs_id}")
_, bm = SV("GET", f"/rest/v1/buoi_hoc?select=id,lop_id&ngay=eq.{mai}&lop_id=eq.{gd_an[0]['lop_id']}")
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
    ok(f"lớp nghỉ: không có buổi ngày {mai} để kiểm", False)

# --- nhật ký thao tác ---
_, nk1 = goi("GET", f"/rest/v1/nhat_ky?select=ten_nguoi,doi_tuong,thay_doi&bang=eq.sticker_cong_tru&hanh_dong=eq.them&doi_tuong=eq.TEST%20Nguy%E1%BB%85n%20B%E1%BA%A3o%20An&order=id.desc&limit=1", A)
ok("nhật ký: lần trợ giảng cộng sticker có dòng, đúng người ghi và tên học sinh",
   nk1 and nk1[0]["ten_nguoi"] == "TEST Trợ giảng Lan" and nk1[0]["doi_tuong"] == "TEST Nguyễn Bảo An")
goi("PATCH", f"/rest/v1/hoc_sinh?id=eq.{hs_id}", A, {"ghi_chu": "TEST nhật ký"})
_, nk2 = goi("GET", f"/rest/v1/nhat_ky?select=thay_doi&bang=eq.hoc_sinh&hanh_dong=eq.sua&order=id.desc&limit=1", A)
ok("nhật ký: sửa học sinh chỉ ghi cột đổi", nk2 and list(nk2[0]["thay_doi"]) == ["ghi_chu"] and nk2[0]["thay_doi"]["ghi_chu"][1] == "TEST nhật ký")
ok("nhật ký: trợ giảng đọc ra rỗng", goi("GET", "/rest/v1/nhat_ky?select=id&limit=1", T) == (200, []))
ok("nhật ký: không ai ghi thẳng được", goi("POST", "/rest/v1/nhat_ky", A, {"bang": "x", "hanh_dong": "them"})[0] >= 400)
c, xoa_nk = goi("DELETE", "/rest/v1/nhat_ky?id=gt.0", A, prefer=R)
ok("nhật ký: giáo viên không xoá được", c >= 400 or xoa_nk == [])
ok("nhật ký: ghi đăng nhập", goi("POST", "/rest/v1/rpc/ghi_dang_nhap", T)[0] == 204 and
   goi("GET", "/rest/v1/nhat_ky?select=ten_nguoi&hanh_dong=eq.dang_nhap&order=id.desc&limit=1", A)[1] == [{"ten_nguoi": "TEST Trợ giảng Lan"}])

_, khoa_truoc = SV("GET", "/rest/v1/khoa_so?select=khoa_den")
_, nk = SV("GET", "/rest/v1/nhat_ky_chot_so?select=id&order=id.desc&limit=1")
nk_cuoi = nk[0]["id"] if nk else 0
_, dd_t = SV("GET", f"/rest/v1/diem_danh?select=buoi_id,sticker,buoi_hoc!inner(ngay)&hoc_sinh_id=eq.{hs_id}&buoi_hoc.ngay=gte.{thang_nay}&buoi_hoc.ngay=lt.{thang_sau}&limit=1")
dd_khoa = f"/rest/v1/diem_danh?buoi_id=eq.{dd_t[0]['buoi_id']}&hoc_sinh_id=eq.{hs_id}" if dd_t else None
goi_id = g0["id"]
try:
    ok(f"chốt sổ tháng {THANG_MA}", goi("POST", "/rest/v1/rpc/chot_so", A, {"thang": thang_nay})[0] == 204)
    ok("khoá: không thêm chi phí tháng đã chốt", goi("POST", "/rest/v1/chi_phi", A, {"ngay": HN, "danh_muc": "x", "so_tien": 1, "ghi_chu": "TEST e2e"})[0] == 400)
    ok("khoá: không sửa điểm danh tháng đã chốt", bool(dd_khoa) and goi("PATCH", dd_khoa, A, {"sticker": dd_t[0]["sticker"] + 1})[0] == 400)
    ok("khoá: không xoá phiếu thu tháng đã chốt", goi("DELETE", f"/rest/v1/phieu_thu?goi_id=eq.{goi_id}", A)[0] == 400)
    ok("khoá: không cộng sticker tháng đã chốt", goi("POST", "/rest/v1/sticker_cong_tru", T, {"hoc_sinh_id": hs_id, "so": 1})[0] == 400)
    ok("khoá: không xoá lần cộng sticker tháng đã chốt", goi("DELETE", f"/rest/v1/sticker_cong_tru?id=eq.{st_id}", T)[0] == 400)
    ok("khoá: trợ giảng không mở khoá được", goi("POST", "/rest/v1/rpc/mo_khoa", T, {"thang": thang_nay, "ly_do": "x"})[0] == 400)
    ok("mở khoá thiếu lý do bị từ chối", goi("POST", "/rest/v1/rpc/mo_khoa", A, {"thang": thang_nay, "ly_do": " "})[0] == 400)
    ok("mở khoá có lý do", goi("POST", "/rest/v1/rpc/mo_khoa", A, {"thang": thang_nay, "ly_do": "TEST"})[0] == 204)
    ok("sau mở khoá sửa lại được", bool(dd_khoa) and goi("PATCH", dd_khoa, A, {"sticker": dd_t[0]["sticker"]}, prefer=R)[1] not in (None, []))
    goi("POST", "/rest/v1/rpc/chot_so", A, {"thang": thang_nay})
    _, lop_st = SV("GET", "/rest/v1/lop?select=id&ten=eq.TEST%20L%E1%BB%9Bp%20Starters")
    c, _ = goi("POST", "/rest/v1/rpc/xoa_lop", A, {"p_lop": lop_st[0]["id"], "p_ten": "TEST Lớp Starters"})
    ok("khoá: xoá lớp có dữ liệu tháng đã chốt bị từ chối, không mất dòng nào",
       c == 400 and len(SV("GET", f"/rest/v1/buoi_hoc?select=id&lop_id=eq.{lop_st[0]['id']}")[1]) > 0)
finally:
    SV("PATCH", "/rest/v1/khoa_so?id=eq.true", {"khoa_den": khoa_truoc[0]["khoa_den"]})
    SV("DELETE", f"/rest/v1/nhat_ky_chot_so?id=gt.{nk_cuoi}")
    ok("khoá sổ đã trả về như trước", SV("GET", "/rest/v1/khoa_so?select=khoa_den")[1] == khoa_truoc)

# --- xoa_lop: giữ nguyên toàn bộ hồ sơ hoc_sinh, gói học, sticker; chỉ xoá lớp, buổi học, điểm danh, ảnh buổi và ghi_danh của lớp đó ---
lop_id = lop_st[0]["id"]
_, hs2_res = SV("POST", "/rest/v1/hoc_sinh", {"ho_ten": "TEST Em Hai Lớp", "don_gia": 100000, "ngay_vao": thang_nay}, prefer=R)
hs_da_lop = hs2_res[0]["id"]
_, hs_ng_res = SV("POST", "/rest/v1/hoc_sinh", {"ho_ten": "TEST HS Ngưng Giữ", "don_gia": 100000, "ngay_vao": thang_nay, "trang_thai": "dang_hoc"}, prefer=R)
hs_ngung_giu = hs_ng_res[0]["id"]
try:
    SV("POST", "/rest/v1/ghi_danh", [
        {"hoc_sinh_id": hs_da_lop, "lop_id": lop_id, "ngay_vao": thang_nay, "trang_thai": "dang_hoc"},
        {"hoc_sinh_id": hs_da_lop, "lop_id": lop_b_id, "ngay_vao": thang_nay, "trang_thai": "dang_hoc"},
        {"hoc_sinh_id": hs_ngung_giu, "lop_id": lop_id, "ngay_vao": thang_nay, "trang_thai": "dang_hoc"},
        {"hoc_sinh_id": hs_ngung_giu, "lop_id": lop_b_id, "ngay_vao": thang_nay, "trang_thai": "ngung"},
    ])
    ok("trợ giảng không xoá được lớp", goi("POST", "/rest/v1/rpc/xoa_lop", T, {"p_lop": lop_id, "p_ten": "TEST Lớp Starters"})[0] == 400)
    _, buoi_st = SV("GET", f"/rest/v1/buoi_hoc?select=id&lop_id=eq.{lop_id}")
    bids = ",".join(b["id"] for b in buoi_st)
    c, anh_xoa = goi("POST", "/rest/v1/rpc/xoa_lop", A, {"p_lop": lop_id, "p_ten": "TEST Lớp Starters"})
    con_lai = {
        "lop": SV("GET", f"/rest/v1/lop?select=id&id=eq.{lop_id}")[1],
        "ghi_danh_lop": SV("GET", f"/rest/v1/ghi_danh?select=id&lop_id=eq.{lop_id}")[1],
        "buoi_hoc": SV("GET", f"/rest/v1/buoi_hoc?select=id&lop_id=eq.{lop_id}")[1],
        "diem_danh": SV("GET", f"/rest/v1/diem_danh?select=buoi_id&buoi_id=in.({bids})")[1],
        "anh_buoi": SV("GET", f"/rest/v1/anh_buoi?select=id&buoi_id=in.({bids})")[1],
    }
    ok(f"xoá lớp có dữ liệu: xoá sạch lớp/buổi/điểm danh/ghi_danh/ảnh buổi, trả {len(anh_xoa) if c == 200 else '?'} ảnh buổi",
       c == 200 and not any(con_lai.values()) and len(anh_xoa) >= 1)
    ok("xoá lớp: em học 1 lớp vẫn giữ nguyên hồ sơ, gói học, sticker và chuyển về Chưa xếp lớp (0 ghi_danh, trang_thai='dang_hoc')",
       SV("GET", f"/rest/v1/hoc_sinh?select=trang_thai&id=eq.{hs_id}")[1] == [{"trang_thai": "dang_hoc"}]
       and SV("GET", f"/rest/v1/ghi_danh?select=id&hoc_sinh_id=eq.{hs_id}")[1] == []
       and len(SV("GET", f"/rest/v1/goi_hoc?select=id&hoc_sinh_id=eq.{hs_id}")[1]) >= 1
       and len(SV("GET", f"/rest/v1/sticker_cong_tru?select=id&hoc_sinh_id=eq.{hs_id}")[1]) >= 1)
    ok("xoá lớp: em học 2 lớp vẫn giữ nguyên hồ sơ và ghi_danh ở lớp còn lại (trang_thai='dang_hoc')",
       SV("GET", f"/rest/v1/hoc_sinh?select=trang_thai&id=eq.{hs_da_lop}")[1] == [{"trang_thai": "dang_hoc"}]
       and SV("GET", f"/rest/v1/ghi_danh?select=lop_id&hoc_sinh_id=eq.{hs_da_lop}")[1] == [{"lop_id": lop_b_id}])
    ok("xoá lớp: em chỉ còn lớp ngưng giữ lại được đồng bộ hoc_sinh.trang_thai='ngung'",
       SV("GET", f"/rest/v1/hoc_sinh?select=trang_thai&id=eq.{hs_ngung_giu}")[1] == [{"trang_thai": "ngung"}]
       and SV("GET", f"/rest/v1/ghi_danh?select=lop_id,trang_thai&hoc_sinh_id=eq.{hs_ngung_giu}")[1] == [{"lop_id": lop_b_id, "trang_thai": "ngung"}])
    _, dg = SV("GET", "/rest/v1/danh_gia?select=lop_id,hoc_sinh_id&ten_lop=eq.TEST%20L%E1%BB%9Bp%20Starters")
    ok("xoá lớp: phiếu đánh giá của lớp vẫn giữ (bỏ lop_id, giữ hoc_sinh_id vì hồ sơ HS còn)", len(dg) == 1 and dg[0] == {"lop_id": None, "hoc_sinh_id": hs_id})
    if c == 200 and anh_xoa:
        try:
            goi("DELETE", "/storage/v1/object/anh", S, {"prefixes": anh_xoa}, key=S)
        except OSError as e:
            print("cảnh báo | chưa xoá được ảnh TEST trên Storage:", e, anh_xoa)
finally:
    SV("DELETE", f"/rest/v1/ghi_danh?hoc_sinh_id=in.({hs_da_lop},{hs_ngung_giu})")
    SV("DELETE", f"/rest/v1/hoc_sinh?id=in.({hs_da_lop},{hs_ngung_giu})")
    SV("DELETE", f"/rest/v1/lop?id=eq.{lop_b_id}")

for k, t in KQ:
    print(k, "|", t)
