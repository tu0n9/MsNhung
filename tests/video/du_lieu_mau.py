"""Dữ liệu mẫu cho video: tạo qua API, ghi id vào tam/da-tao.json, xoá đúng những id đó sau khi quay.
Không đụng dữ liệu thật đang có (database dùng chung với bản thật)."""
import datetime, json, os, urllib.error, urllib.parse, urllib.request

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
env = dict(l.split("=", 1) for l in open(os.path.join(REPO, ".env"), encoding="utf-8").read().splitlines() if "=" in l and not l.startswith("#"))
U, K, S = env["VITE_SUPABASE_URL"].strip(), env["VITE_SUPABASE_PUBLISHABLE_KEY"].strip(), env["SUPABASE_SECRET_KEY"].strip()
MK_ADMIN = env["BREAK_GLASS_PASSWORD"].strip()
GHI = os.path.join(REPO, "tests", "video", "tam", "da-tao.json")
# lớp tạo ngay trong video (thêm tay, import Excel) và dải SĐT dùng cho mọi tài khoản mẫu
LOP_TAO_TRONG_VIDEO = ["Flyers A", "Kids 3"]
DAI_SDT_MAU = "090010%"


def api(method, path, body=None, token=S, key=S, raw=None, kieu="application/json"):
    h = {"apikey": key, "Authorization": "Bearer " + token, "Content-Type": kieu, "Prefer": "return=representation"}
    data = raw if raw is not None else (json.dumps(body).encode() if body is not None else None)
    # tên lớp có dấu cách / tiếng Việt trong bộ lọc: mã hoá, giữ nguyên cú pháp lọc của PostgREST
    req = urllib.request.Request(U + urllib.parse.quote(path, safe="/?=&(),.*:%-_"), method=method, data=data, headers=h)
    try:
        with urllib.request.urlopen(req) as r:
            t = r.read().decode()
            return json.loads(t) if t else None
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"{method} {path}: {e.code} {e.read().decode()[:300]}")


def token_admin():
    r = api("POST", "/auth/v1/token?grant_type=password", {"email": "admin@msnhung.local", "password": MK_ADMIN}, token=K, key=K)
    return r["access_token"]


def tao_tai_khoan(tk_admin, **b):
    return api("POST", "/functions/v1/tai-khoan", {"hanh_dong": "tao", **b}, token=tk_admin, key=K)["id"]


# ngày tương đối theo hôm nay để quay được bất kỳ hôm nào (buổi mẫu ngày 1-12 phải nằm trước hôm nay trong tháng)
HN = datetime.date.today()
THANG = HN.strftime("%Y-%m")
_THU = (HN.weekday() + 1) % 7  # getDay của JS: 0 = CN
LICH = sorted({_THU, (_THU + 2) % 7, (_THU + 4) % 7})


def cong_thang(t, n):
    y, m = map(int, t.split("-"))
    k = y * 12 + m - 1 + n
    return f"{k // 12}-{k % 12 + 1:02d}"


def tao():
    if HN.day < 13:
        raise SystemExit("Quay video từ ngày 13 của tháng trở đi: dữ liệu mẫu cần các buổi ngày 1-12 đã qua.")
    os.makedirs(os.path.dirname(GHI), exist_ok=True)
    A = token_admin()
    ds = {"lop": [], "hs": [], "tk": [], "anh": [], "khoa_den": api("GET", "/rest/v1/khoa_so?select=khoa_den")[0]["khoa_den"],
          "bat_dau": api("GET", "/rest/v1/nhat_ky_chot_so?select=id&order=id.desc&limit=1")}
    ds["bat_dau"] = ds["bat_dau"][0]["id"] if ds["bat_dau"] else 0
    luu = lambda: json.dump(ds, open(GHI, "w", encoding="utf-8"), ensure_ascii=False)
    # Movers 2 và Starters 1 học cùng lịch, cùng giờ, có buổi hôm nay: buổi hôm nay tự gộp thành một ca (video điểm danh)
    gio = {str(t): {"bd": "17:30", "kt": "19:00"} for t in LICH}
    movers = api("POST", "/rest/v1/lop", {"ten": "Movers 2", "don_gia": 150000, "lich": LICH, "gio_thu": gio})[0]
    starters = api("POST", "/rest/v1/lop", {"ten": "Starters 1", "don_gia": 120000, "lich": LICH, "gio_thu": gio})[0]
    ds["lop"] += [movers["id"], starters["id"]]
    luu()
    ds["tk"].append(tao_tai_khoan(A, vai_tro="tro_giang", ho_ten="Cô Lan", ten_dang_nhap="colan", so_dien_thoai="0900100009", don_gia_buoi=80000))
    luu()
    em = [("Nguyễn Minh Anh", "Chị Hà", "0900100001", 12), ("Trần Gia Bảo", "Anh Tuấn", "0900100002", 7),
          ("Lê Khánh Linh", "Chị Hằng", "0900100003", 20), ("Phạm Đức Huy", "Chị Hằng", "0900100003", 3)]
    anh = open(os.path.join(REPO, "tests", "e2e", "avatar.jpg"), "rb").read()
    ngay_vao = f"{cong_thang(THANG, -2)}-01"
    for i, (ten, ph, sdt, st) in enumerate(em):
        ph_id = tao_tai_khoan(A, vai_tro="phu_huynh", ho_ten=ph, so_dien_thoai=sdt)
        if ph_id not in ds["tk"]:
            ds["tk"].append(ph_id)
        h = api("POST", "/rest/v1/hoc_sinh", {"ho_ten": ten, "lop_id": movers["id"], "ten_phu_huynh": ph, "sdt_phu_huynh": sdt,
                                              "phu_huynh_id": ph_id, "ngay_vao": ngay_vao, "sticker_dau_ky": st})[0]
        ds["hs"].append(h["id"])
        if i < 2:
            duong = f"avatar/{h['id']}-mau.jpg"
            api("POST", f"/storage/v1/object/anh/{duong}", raw=anh, kieu="image/jpeg")
            api("PATCH", f"/rest/v1/hoc_sinh?id=eq.{h['id']}", {"avatar": duong})
            ds["anh"].append(duong)
        luu()
    # một em của Starters 1, chưa có gói: hiện ở bộ lọc "Sắp hết gói" với nhãn "Chưa có gói"
    ds["hs"].append(api("POST", "/rest/v1/hoc_sinh", {"ho_ten": "Hoàng Tuệ Nhi", "lop_id": starters["id"], "ngay_vao": ngay_vao})[0]["id"])
    luu()
    # tài khoản giáo viên mẫu dùng để quay (không lộ tài khoản admin trong video)
    gv = tao_tai_khoan(A, vai_tro="giao_vien", ho_ten="Cô Nhung", ten_dang_nhap="conhung", mat_khau=MK_GV)
    ds["tk"].append(gv)
    api("PATCH", f"/rest/v1/tai_khoan?id=eq.{gv}", {"phai_doi_mat_khau": False})
    luu()
    # điểm danh đầu tháng để lưới "Điểm danh tháng" không toàn ô "chưa điểm danh": Minh Anh vắng ngày 5 rồi học bù
    # ngày 6 ở Starters 1, Huy vắng ngày 10, còn lại có mặt
    buoi = {d: api("POST", "/rest/v1/buoi_hoc", {"lop_id": movers["id"], "ngay": f"{THANG}-{d:02d}", "bat_dau": "17:30", "ket_thuc": "19:00"})[0]["id"] for d in [1, 3, 5, 8, 10, 12]}
    bu = api("POST", "/rest/v1/buoi_hoc", {"lop_id": starters["id"], "ngay": f"{THANG}-06", "bat_dau": "18:00", "ket_thuc": "19:30"})[0]["id"]
    vang = {(0, 5), (3, 10)}
    api("POST", "/rest/v1/diem_danh", [
        {"buoi_id": b, "hoc_sinh_id": h, "trang_thai": "vang" if (i, d) in vang else "co_mat", "sticker": 0 if (i, d) in vang else (d + i) % 3 + 1}
        for i, h in enumerate(ds["hs"][:4]) for d, b in buoi.items()] + [{"buoi_id": bu, "hoc_sinh_id": ds["hs"][0], "trang_thai": "hoc_bu", "sticker": 1}])
    # vài gói học để tab Học phí có số: Bảo nợ cả tháng này, Huy đóng thiếu, Linh đóng trước 3 tháng
    bao, linh, huy = ds["hs"][1], ds["hs"][2], ds["hs"][3]
    g = lambda hs, bd, n: api("POST", "/rest/v1/goi_hoc", {"hoc_sinh_id": hs, "thang_bat_dau": f"{bd}-01", "so_thang": n, "don_gia": 150000,
                                                            "buoi_du_kien": {t: dem_buoi(LICH, t) for t in thang_lien(bd, n)}})[0]["id"]
    tong = lambda bd, n: sum(dem_buoi(LICH, t) for t in thang_lien(bd, n)) * 150000
    g(bao, THANG, 1)
    api("POST", "/rest/v1/phieu_thu", {"goi_id": g(huy, THANG, 1), "so_tien": 1000000, "ngay_thu": f"{THANG}-05", "hinh_thuc": "tien_mat"})
    bd_linh = cong_thang(THANG, -2)
    api("POST", "/rest/v1/phieu_thu", {"goi_id": g(linh, bd_linh, 3), "so_tien": tong(bd_linh, 3), "ngay_thu": f"{bd_linh}-02", "hinh_thuc": "chuyen_khoan"})
    # tiền dư cho video thu tiền: Bảo đóng đủ gói tháng trước, tháng đó lớp nghỉ 1 buổi -> dư 150.000 khi đóng gói mới
    truoc = cong_thang(THANG, -1)
    api("POST", "/rest/v1/phieu_thu", {"goi_id": g(bao, truoc, 1), "so_tien": tong(truoc, 1), "ngay_thu": f"{truoc}-02", "hinh_thuc": "tien_mat"})
    api("POST", "/rest/v1/buoi_hoc", {"lop_id": movers["id"], "ngay": f"{truoc}-15", "bat_dau": "17:30", "ket_thuc": "19:00", "lop_nghi": True})
    return ds


MK_GV = "CoNhung@2026"


def thang_lien(bd, n):
    return [cong_thang(bd, i) for i in range(n)]


def dem_buoi(lich, thang):
    """Số ngày trong tháng rơi vào lịch tuần (getDay của JS: 0 = CN), như demBuoiDuKien ở src/hoc-phi.ts."""
    import calendar
    y, m = map(int, thang.split("-"))
    return sum(1 for d in range(1, calendar.monthrange(y, m)[1] + 1) if (datetime.date(y, m, d).weekday() + 1) % 7 in lich)


def xoa():
    if not os.path.exists(GHI):
        return
    ds = json.load(open(GHI, encoding="utf-8"))
    # video chốt sổ chốt rồi mở khoá thật: trả mốc khoá về như trước TRƯỚC KHI xoá (tháng còn khoá thì trigger chặn xoá),
    # và xoá nhật ký ghi trong lúc quay
    api("PATCH", "/rest/v1/khoa_so?id=eq.true", {"khoa_den": ds["khoa_den"]})
    api("DELETE", f"/rest/v1/nhat_ky_chot_so?id=gt.{ds['bat_dau']}")
    ten = ",".join(f'"{t}"' for t in LOP_TAO_TRONG_VIDEO)
    ds["lop"] += [l["id"] for l in api("GET", f"/rest/v1/lop?select=id&ten=in.({ten})")]
    lop = ",".join(ds["lop"]) or "00000000-0000-0000-0000-000000000000"
    hs = ",".join(ds["hs"]) or "00000000-0000-0000-0000-000000000000"
    buoi = [b["id"] for b in api("GET", f"/rest/v1/buoi_hoc?select=id&lop_id=in.({lop})")]
    hs_moi = [h["id"] for h in api("GET", f"/rest/v1/hoc_sinh?select=id&lop_id=in.({lop})")]  # gồm cả em thêm trong video
    tat_ca_hs = ",".join(set(ds["hs"]) | set(hs_moi)) or hs
    for b in [buoi[i:i + 50] for i in range(0, len(buoi), 50)]:
        ids = ",".join(b)
        anh_buoi = api("GET", f"/rest/v1/anh_buoi?select=duong_dan&buoi_id=in.({ids})")
        ds["anh"] += [a["duong_dan"] for a in anh_buoi]
        for t in ["anh_buoi", "tro_giang_buoi", "diem_danh"]:
            api("DELETE", f"/rest/v1/{t}?buoi_id=in.({ids})")
    goi = [g["id"] for g in api("GET", f"/rest/v1/goi_hoc?select=id&hoc_sinh_id=in.({tat_ca_hs})")]
    if goi:
        api("DELETE", f"/rest/v1/phieu_thu?goi_id=in.({','.join(goi)})")
        api("DELETE", f"/rest/v1/goi_hoc?id=in.({','.join(goi)})")
    avatar = [h["avatar"] for h in api("GET", f"/rest/v1/hoc_sinh?select=avatar&id=in.({tat_ca_hs})") if h["avatar"]]
    api("DELETE", f"/rest/v1/diem_danh?hoc_sinh_id=in.({tat_ca_hs})")
    api("DELETE", f"/rest/v1/chi_phi?ghi_chu=eq.video mẫu")
    api("DELETE", f"/rest/v1/chi_phi?hoc_sinh_id=in.({tat_ca_hs})")
    api("DELETE", f"/rest/v1/hoc_sinh?id=in.({tat_ca_hs})")
    if buoi:
        for b in [buoi[i:i + 50] for i in range(0, len(buoi), 50)]:
            api("DELETE", f"/rest/v1/buoi_hoc?id=in.({','.join(b)})")
    api("DELETE", f"/rest/v1/lop?id=in.({lop})")
    tep = sorted(set(ds["anh"] + avatar))
    if tep:
        api("DELETE", "/storage/v1/object/anh", {"prefixes": tep})
    ds["tk"] += [t["id"] for t in api("GET", f"/rest/v1/tai_khoan?select=id&so_dien_thoai=like.{DAI_SDT_MAU}")]
    ds["tk"] += [t["id"] for t in api("GET", "/rest/v1/tai_khoan?select=id&ten_dang_nhap=in.(colan,conhung)")]
    for t in sorted(set(ds["tk"])):
        try:
            api("DELETE", f"/auth/v1/admin/users/{t}")
        except RuntimeError:
            pass
    os.remove(GHI)
    print("đã xoá dữ liệu mẫu video")
