"""Kiểm RLS và khoá sổ ở tầng database (không qua giao diện). Chạy sau all.py, dùng dữ liệu TEST nó tạo."""
import json, os, sys, urllib.request, urllib.error

env = dict(l.split("=", 1) for l in open(r"C:\Users\TIENTUONG\MsNhung\.env", encoding="utf-8").read().splitlines() if "=" in l and not l.startswith("#"))
U, K, S = env["VITE_SUPABASE_URL"].strip(), env["VITE_SUPABASE_PUBLISHABLE_KEY"].strip(), env["SUPABASE_SECRET_KEY"].strip()
KQ = []


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
_, buoi11 = SV("GET", "/rest/v1/buoi_hoc?select=id,lop_nghi&ngay=eq.2026-11-15&limit=1")
c, r = goi("PATCH", f"/rest/v1/buoi_hoc?id=eq.{buoi11[0]['id']}", T, {"lop_nghi": True}, prefer="return=representation")
ok("trợ giảng không đánh được \"Lớp nghỉ\" (0 dòng đổi)", r == [] and SV("GET", f"/rest/v1/buoi_hoc?select=lop_nghi&id=eq.{buoi11[0]['id']}")[1][0]["lop_nghi"] is False)
ok("trợ giảng không thêm được buổi phụ", goi("POST", "/rest/v1/buoi_hoc", T, {"lop_id": None, "ngay": "2026-11-16", "loai": "phu"})[0] >= 400)
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

_, khoa_truoc = SV("GET", "/rest/v1/khoa_so?select=khoa_den")
try:
    ok("chốt sổ tháng 11", goi("POST", "/rest/v1/rpc/chot_so", A, {"thang": "2026-11-01"})[0] == 204)
    ok("khoá: không thêm chi phí tháng 11", goi("POST", "/rest/v1/chi_phi", A, {"ngay": "2026-11-20", "danh_muc": "x", "so_tien": 1, "ghi_chu": "TEST e2e"})[0] == 400)
    ok("khoá: không sửa điểm danh tháng 11", goi("PATCH", "/rest/v1/diem_danh?sticker=eq.3", A, {"sticker": 4})[0] == 400)
    ok("khoá: không xoá phiếu thu tháng 11", goi("DELETE", "/rest/v1/phieu_thu?so_tien=eq.2000000", A)[0] == 400)
    ok("khoá: trợ giảng không mở khoá được", goi("POST", "/rest/v1/rpc/mo_khoa", T, {"thang": "2026-11-01", "ly_do": "x"})[0] == 400)
    ok("mở khoá thiếu lý do bị từ chối", goi("POST", "/rest/v1/rpc/mo_khoa", A, {"thang": "2026-11-01", "ly_do": " "})[0] == 400)
    ok("mở khoá có lý do", goi("POST", "/rest/v1/rpc/mo_khoa", A, {"thang": "2026-11-01", "ly_do": "TEST"})[0] == 204)
    ok("sau mở khoá sửa lại được", goi("PATCH", "/rest/v1/diem_danh?sticker=eq.3", A, {"sticker": 3})[0] == 204)
finally:
    # trả khoá sổ về như trước test, xoá nhật ký do test ghi
    SV("PATCH", "/rest/v1/khoa_so?id=eq.true", {"khoa_den": khoa_truoc[0]["khoa_den"]})
    SV("DELETE", "/rest/v1/nhat_ky_chot_so?ly_do=is.null&thang=eq.2026-11-01")
    SV("DELETE", "/rest/v1/nhat_ky_chot_so?ly_do=eq.TEST")
    ok("khoá sổ đã trả về như trước", SV("GET", "/rest/v1/khoa_so?select=khoa_den")[1] == khoa_truoc)

for k, t in KQ:
    print(k, "|", t)
