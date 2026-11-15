// Nạp mọi thứ tab Học phí và file Excel cần cho một tháng. Quy mô một trung tâm (vài trăm học sinh)
// nên tải hết về rồi tính trên máy cho gọn.
// ponytail: tải toàn bộ goi_hoc/phieu_thu; khi lên hàng chục nghìn phiếu thì chuyển sang view tổng hợp trong Postgres.
import { congThang, hocPhiGocThang, tongHopHocSinh, type Goi, type PhieuThu, type Thang, type TongHopThang } from './hoc-phi'
import { q, sb, type HocSinh, type Lop, type TaiKhoan } from './supabase'

export interface ChiPhi { id: string; ngay: string; danh_muc: string; so_tien: number; ghi_chu: string | null }
export interface DongHs extends TongHopThang { hs: HocSinh; soBuoi: number; dieuChinh: number }
export interface DuLieuThang {
  thang: Thang; lops: Lop[]; dong: DongHs[]; phieu: (PhieuThu & { id: string; hinh_thuc: string; ghi_chu: string | null })[]
  chi: ChiPhi[]; luongTg: { tg: Pick<TaiKhoan, 'id' | 'ho_ten'>; soBuoi: number; thanhTien: number }[]
  diemDanh: { hoc_sinh_id: string; trang_thai: string; sticker: number; ngay: string; lop_id: string }[]
  goi: Goi[]
}

export async function taiDuLieuThang(thang: Thang): Promise<DuLieuThang> {
  const dau = `${thang}-01`, sau = `${congThang(thang, 1)}-01`
  const [lops, hs, goi, phieu, chi, luong, dd] = await Promise.all([
    q(sb.from('lop').select('*').order('ten')),
    q(sb.from('hoc_sinh').select('*').order('ho_ten')),
    q(sb.from('goi_hoc').select('*')),
    q(sb.from('phieu_thu').select('*').order('ngay_thu')),
    q(sb.from('chi_phi').select('*').gte('ngay', dau).lt('ngay', sau).order('ngay')),
    // cột đơn giá của tro_giang_buoi không cấp cho client; lương tính trong hàm chỉ giáo viên gọi được
    q(sb.rpc('luong_tro_giang', { tu: dau, den: sau })),
    q(sb.from('diem_danh').select('hoc_sinh_id, trang_thai, sticker, buoi_hoc!inner(ngay, lop_id)').gte('buoi_hoc.ngay', dau).lt('buoi_hoc.ngay', sau)),
  ])
  const goiL = goi as Goi[], phieuL = phieu as DuLieuThang['phieu']
  const diemDanh = (dd as unknown as { hoc_sinh_id: string; trang_thai: string; sticker: number; buoi_hoc: { ngay: string; lop_id: string } }[])
    .map((x) => ({ hoc_sinh_id: x.hoc_sinh_id, trang_thai: x.trang_thai, sticker: x.sticker, ngay: x.buoi_hoc.ngay, lop_id: x.buoi_hoc.lop_id }))

  const dong = (hs as HocSinh[]).map((h) => {
    const g = goiL.filter((x) => x.hoc_sinh_id === h.id)
    const th = tongHopHocSinh(g, phieuL, thang)
    return {
      ...th, hs: h,
      soBuoi: diemDanh.filter((x) => x.hoc_sinh_id === h.id && x.trang_thai !== 'vang').length,
      // phần chênh giữa phải thu và học phí gốc (tiền dư trừ, điều chỉnh, phần âm tràn sang) để Excel hiện cột "Điều chỉnh"
      dieuChinh: th.phaiThu - hocPhiGocThang(g, thang),
    }
  // học sinh ngừng học vẫn hiện nếu còn tiền liên quan tháng này
  }).filter((d) => d.hs.trang_thai === 'dang_hoc' || d.phaiThu || d.noKyTruoc || d.thucThu || d.conPhaiThu)

  const luongTg = (luong as { tro_giang_id: string; ho_ten: string; so_buoi: number; thanh_tien: number }[])
    .map((x) => ({ tg: { id: x.tro_giang_id, ho_ten: x.ho_ten }, soBuoi: Number(x.so_buoi), thanhTien: Number(x.thanh_tien) }))

  return { thang, lops: lops as Lop[], dong, phieu: phieuL.filter((p) => p.ngay_thu >= dau && p.ngay_thu < sau), chi: chi as ChiPhi[], luongTg, diemDanh, goi: goiL }
}

export function tongCong(d: DuLieuThang) {
  const cong = (k: keyof TongHopThang) => d.dong.reduce((s, x) => s + x[k], 0)
  const tongChi = d.chi.reduce((s, x) => s + x.so_tien, 0) + d.luongTg.reduce((s, x) => s + x.thanhTien, 0)
  const thucThu = d.phieu.reduce((s, p) => s + p.so_tien, 0)
  return {
    phaiThu: cong('phaiThu'), noKyTruoc: cong('noKyTruoc'), daThu: cong('daThu'), conPhaiThu: cong('conPhaiThu'),
    thucThu, tongChi, chenhLech: thucThu - tongChi,
  }
}
