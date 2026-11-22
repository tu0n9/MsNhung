// Nạp mọi thứ tab Học phí và file Excel cần cho một tháng. Quy mô một trung tâm (vài trăm học sinh)
// nên tải hết về rồi tính trên máy cho gọn.
// ponytail: tải toàn bộ goi_hoc/phieu_thu (theo trang 1000); khi lên hàng chục nghìn phiếu thì chuyển sang view tổng hợp trong Postgres.
import { congThang, hocPhiGocThang, tongCong, tongHopHocSinh, type Goi, type PhieuThu, type Thang, type TongHopThang } from './hoc-phi'
import { hsDangHoc, lopCuaHs, q, sb, taiHet, type GhiDanh, type HocSinh, type Lop, type TaiKhoan } from './supabase'
import type { PhieuDanhGia } from './danh-gia'

export interface ChiPhi { id: string; ngay: string; danh_muc: string; so_tien: number; ghi_chu: string | null }
export interface DongHs extends TongHopThang {
  hs: HocSinh; ghiDanh: GhiDanh[]; lopIds: string[]; tenLops: string; soBuoi: number; dieuChinh: number
}
export interface DuLieuThang {
  thang: Thang; lops: Lop[]; dong: DongHs[]
  hocSinh: HocSinh[]  // mọi học sinh kể cả đã ngừng: dong lọc bớt em ngừng không phát sinh tiền tháng này
  ghiDanh: GhiDanh[]
  phieu: (PhieuThu & { id: string; hinh_thuc: string; ghi_chu: string | null })[]
  chi: ChiPhi[]; luongTg: { tg: Pick<TaiKhoan, 'id' | 'ho_ten'>; soBuoi: number; thanhTien: number }[]
  diemDanh: { hoc_sinh_id: string; trang_thai: string; sticker: number; ngay: string; lop_id: string }[]
  // tách khỏi diemDanh vì không gắn buổi nào: lọc theo ngày ghi, không theo ngày buổi
  stickerNgoai: { hoc_sinh_id: string; so: number }[]
  goi: Goi[]
  danhGia: PhieuDanhGia[]
}

export async function taiDuLieuThang(thang: Thang): Promise<DuLieuThang> {
  const dau = `${thang}-01`, sau = `${congThang(thang, 1)}-01`
  const [lops, hs, gd, goi, phieu, chi, luong, dd, dg, sn] = await Promise.all([
    q(sb.from('lop').select('*').order('ten')),
    taiHet((a, b) => sb.from('hoc_sinh').select('*').order('ho_ten').order('id').range(a, b)),
    taiHet((a, b) => sb.from('ghi_danh').select('*').order('id').range(a, b)),
    taiHet((a, b) => sb.from('goi_hoc').select('*').order('id').range(a, b)),
    taiHet((a, b) => sb.from('phieu_thu').select('*').order('ngay_thu').order('id').range(a, b)),
    q(sb.from('chi_phi').select('*').gte('ngay', dau).lt('ngay', sau).order('ngay')),
    // cột đơn giá của tro_giang_buoi không cấp cho client; lương tính trong hàm chỉ giáo viên gọi được
    q(sb.rpc('luong_tro_giang', { tu: dau, den: sau })),
    taiHet((a, b) => sb.from('diem_danh').select('hoc_sinh_id, trang_thai, sticker, buoi_hoc!inner(ngay, lop_id)')
      .gte('buoi_hoc.ngay', dau).lt('buoi_hoc.ngay', sau).order('buoi_id').order('hoc_sinh_id').range(a, b)),
    q(sb.from('danh_gia').select('*').eq('thang', dau).order('gui_luc')),
    taiHet((a, b) => sb.from('sticker_cong_tru').select('hoc_sinh_id, so').gte('ngay', dau).lt('ngay', sau).order('id').range(a, b)),
  ])
  const lopL = lops as Lop[], gdL = gd as GhiDanh[]
  const tenLopMap = new Map(lopL.map((l) => [l.id, l.ten]))
  const goiL = goi as Goi[], phieuL = phieu as DuLieuThang['phieu']
  const diemDanh = (dd as unknown as { hoc_sinh_id: string; trang_thai: string; sticker: number; buoi_hoc: { ngay: string; lop_id: string } }[])
    .map((x) => ({ hoc_sinh_id: x.hoc_sinh_id, trang_thai: x.trang_thai, sticker: x.sticker, ngay: x.buoi_hoc.ngay, lop_id: x.buoi_hoc.lop_id }))

  const dong = (hs as HocSinh[]).map((h) => {
    const g = goiL.filter((x) => x.hoc_sinh_id === h.id)
    const th = tongHopHocSinh(g, phieuL, thang)
    const gds = lopCuaHs(gdL, h.id)
    const dangHoc = gds.filter((x) => x.trang_thai === 'dang_hoc')
    const hien = dangHoc.length ? dangHoc : gds
    const tenLops = hien.map((x) => tenLopMap.get(x.lop_id)).filter((t): t is string => !!t).sort((a, b) => a.localeCompare(b)).join(', ')
    return {
      ...th, hs: h, ghiDanh: gds, lopIds: hien.map((x) => x.lop_id), tenLops,
      soBuoi: diemDanh.filter((x) => x.hoc_sinh_id === h.id && x.trang_thai !== 'vang').length,
      // phần chênh giữa phải thu và học phí gốc (tiền dư trừ, điều chỉnh, phần âm tràn sang) để Excel hiện cột "Điều chỉnh"
      dieuChinh: th.phaiThu - hocPhiGocThang(g, thang),
    }
  // học sinh ngừng hết mọi lớp vẫn hiện nếu còn tiền liên quan tháng này
  }).filter((d) => hsDangHoc(gdL, d.hs.id) || d.phaiThu || d.noKyTruoc || d.thucThu || d.conPhaiThu)

  const luongTg = (luong as { tro_giang_id: string; ho_ten: string; so_buoi: number; thanh_tien: number }[])
    .map((x) => ({ tg: { id: x.tro_giang_id, ho_ten: x.ho_ten }, soBuoi: Number(x.so_buoi), thanhTien: Number(x.thanh_tien) }))

  return { thang, lops: lopL, dong, hocSinh: hs as HocSinh[], ghiDanh: gdL, phieu: phieuL.filter((p) => p.ngay_thu >= dau && p.ngay_thu < sau), chi: chi as ChiPhi[], luongTg, diemDanh, goi: goiL, danhGia: dg as PhieuDanhGia[],
    stickerNgoai: sn as DuLieuThang['stickerNgoai'] }
}

export { tongCong }
