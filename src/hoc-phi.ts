// Mọi phép tính tiền nằm ở đây, thuần, có test (hoc-phi.test.ts): tab Học phí, chi tiết học sinh, Thu tiền, cổng phụ
// huynh, tin nhắn và Excel đều gọi các hàm này, không tự tính lại.
// Quy tắc nghiệp vụ ở docs/YEU-CAU.md (gói đóng trước, tiền dư chỉ từ buổi lớp nghỉ).

export type Thang = string // 'YYYY-MM'

export interface Goi {
  id: string
  hoc_sinh_id: string
  thang_bat_dau: string // 'YYYY-MM-01'
  so_thang: number
  don_gia: number
  buoi_du_kien: Record<Thang, number>
  tien_du_tru: number
  dieu_chinh: number
}

export interface PhieuThu {
  goi_id: string
  so_tien: number
  ngay_thu: string // 'YYYY-MM-DD'
}

export const thangCua = (ngay: string): Thang => ngay.slice(0, 7)

export function congThang(t: Thang, n: number): Thang {
  const [y, m] = t.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1 + n, 1)).toISOString().slice(0, 7)
}

/** Số buổi theo lịch tuần trong từng tháng của gói; `tu` là ngày vào học khi học sinh vào giữa chừng. */
export function demBuoiDuKien(lich: number[], thangBatDau: Thang, soThang: number, tu?: string): Record<Thang, number> {
  const kq: Record<Thang, number> = {}
  for (let i = 0; i < soThang; i++) {
    const t = congThang(thangBatDau, i)
    const [y, m] = t.split('-').map(Number)
    let dem = 0
    for (let d = new Date(Date.UTC(y, m - 1, 1)); d.getUTCMonth() === m - 1; d.setUTCDate(d.getUTCDate() + 1)) {
      if (lich.includes(d.getUTCDay()) && (!tu || d.toISOString().slice(0, 10) >= tu)) dem++
    }
    kq[t] = dem
  }
  return kq
}

/** Phải thu từng tháng: buổi × đơn giá. Điều chỉnh và tiền dư dồn vào tháng đầu; phần âm tràn sang tháng sau. */
export function phaiThuTheoThang(g: Goi): Record<Thang, number> {
  const ts = Object.keys(g.buoi_du_kien).sort()
  const kq: Record<Thang, number> = {}
  let du = g.dieu_chinh - g.tien_du_tru
  ts.forEach((t, i) => {
    let v = g.buoi_du_kien[t] * g.don_gia + du
    du = 0
    if (v < 0 && i < ts.length - 1) { du = v; v = 0 }
    kq[t] = v
  })
  return kq
}

/** Tiền đã đóng cho gói (chỉ phiếu thu trước `truocNgay`) dồn lần lượt vào các tháng; thừa thì nằm ở tháng cuối. */
export function daThuTheoThang(g: Goi, phieu: PhieuThu[], truocNgay: string): Record<Thang, number> {
  let con = phieu.filter((p) => p.goi_id === g.id && p.ngay_thu < truocNgay).reduce((s, p) => s + p.so_tien, 0)
  const pt = phaiThuTheoThang(g)
  const ts = Object.keys(pt).sort()
  const kq: Record<Thang, number> = {}
  ts.forEach((t, i) => {
    const v = i === ts.length - 1 ? con : Math.min(con, Math.max(pt[t], 0))
    kq[t] = v
    con -= v
  })
  return kq
}

export interface TongHopThang {
  phaiThu: number    // học phí của chính tháng này
  noKyTruoc: number  // còn nợ các tháng trước, tính tại đầu tháng
  daThu: number      // tiền thu được trong kỳ cho các khoản đến hết tháng này (gồm trả nợ cũ, tiền đóng trước cho tháng này)
  conPhaiThu: number // = phaiThu + noKyTruoc − daThu, tính tại cuối tháng
  thucThu: number    // tiền có ngày thu trong tháng, bất kể thu cho tháng nào
  dongTruoc: number  // phần học phí tháng này đã đóng từ trước khi tháng bắt đầu (gói nhiều tháng)
}

/**
 * Tổng hợp một học sinh trong một tháng. Chỉ dùng phiếu thu có ngày trước cuối tháng, nên số của tháng đã qua
 * không đổi khi phụ huynh trả nợ về sau: tháng đã chốt sổ luôn ra cùng con số.
 */
export function tongHopHocSinh(goi: Goi[], phieu: PhieuThu[], thang: Thang): TongHopThang {
  const dauThang = `${thang}-01`
  const cuoiThang = `${congThang(thang, 1)}-01`
  let phaiThu = 0, noKyTruoc = 0, conPhaiThu = 0, thucThu = 0, dongTruoc = 0
  for (const g of goi) {
    const pt = phaiThuTheoThang(g)
    const dtDau = daThuTheoThang(g, phieu, dauThang)
    const dtCuoi = daThuTheoThang(g, phieu, cuoiThang)
    for (const t of Object.keys(pt)) {
      if (t < thang) noKyTruoc += pt[t] - dtDau[t]
      if (t === thang) { phaiThu += pt[t]; dongTruoc += dtDau[t] }
      if (t <= thang) conPhaiThu += pt[t] - dtCuoi[t]
    }
    // tiền thừa của gói đã hết hạn vẫn là tiền đã thu, nằm ở tháng cuối gói nên đã được trừ ở trên
  }
  const goiIds = new Set(goi.map((g) => g.id))
  for (const p of phieu) if (goiIds.has(p.goi_id) && thangCua(p.ngay_thu) === thang) thucThu += p.so_tien
  return { phaiThu, noKyTruoc, daThu: phaiThu + noKyTruoc - conPhaiThu, conPhaiThu, thucThu, dongTruoc }
}

/** "Đã đủ (đóng trước)" khi tháng này được trả hết bằng tiền đóng trước khi tháng bắt đầu (spec vòng 3). */
export function trangThaiThang(th: TongHopThang): 'con_no' | 'dong_truoc' | 'du' {
  if (th.conPhaiThu > 0) return 'con_no'
  return th.phaiThu > 0 && th.dongTruoc >= th.phaiThu ? 'dong_truoc' : 'du'
}

export const tongGoi = (g: Goi) => Object.values(phaiThuTheoThang(g)).reduce((s, x) => s + x, 0)
export const daDongGoi = (g: Goi, phieu: PhieuThu[]) => phieu.filter((p) => p.goi_id === g.id).reduce((s, p) => s + p.so_tien, 0)
export const conNoGoi = (g: Goi, phieu: PhieuThu[]) => tongGoi(g) - daDongGoi(g, phieu)
/** Tháng ngay sau tháng cuối của gói. */
export const thangHetGoi = (g: Pick<Goi, 'thang_bat_dau' | 'so_thang'>): Thang => congThang(thangCua(g.thang_bat_dau), g.so_thang)

/** Học phí gốc của tháng (buổi × đơn giá), chưa trừ dư / điều chỉnh: cột "Học phí" của Excel; "Điều chỉnh" = phải thu − số này. */
export function hocPhiGocThang(goi: Goi[], thang: Thang): number {
  return goi.reduce((s, g) => s + (g.buoi_du_kien[thang] ?? 0) * g.don_gia, 0)
}

/** Tiền dư của gói: chỉ buổi lớp nghỉ (lễ, Tết, giáo viên nghỉ) mà chưa có buổi phụ bù lại. Học sinh tự nghỉ thì học bù. */
export function tienDu(g: Pick<Goi, 'don_gia'>, soBuoiLopNghi: number, soBuoiPhu: number): number {
  return Math.max(0, soBuoiLopNghi - soBuoiPhu) * g.don_gia
}

export interface BuoiDacBiet { ngay: string; loai: 'lich' | 'phu' | 'bu'; lop_nghi: boolean }

/** Số buổi lớp nghỉ và buổi phụ trong khoảng của gói (tính từ ngày vào học nếu vào giữa gói). */
export function demNghiPhu(g: Goi, buoi: BuoiDacBiet[], ngayVao: string) {
  const tu = [g.thang_bat_dau, ngayVao].sort()[1]
  const den = `${thangHetGoi(g)}-01`
  const trong = buoi.filter((b) => b.ngay >= tu && b.ngay < den)
  return { nghi: trong.filter((b) => b.loai === 'lich' && b.lop_nghi).length, phu: trong.filter((b) => b.loai === 'phu' && !b.lop_nghi).length }
}
export const tienDuGoi = (g: Goi, buoi: BuoiDacBiet[], ngayVao: string) => {
  const n = demNghiPhu(g, buoi, ngayVao)
  return tienDu(g, n.nghi, n.phu)
}

/**
 * Tiền dư còn lại của học sinh = dư của các gói đã kết thúc trước `truocThang` − đã trừ vào gói nào đó − đã hoàn.
 * Tính trên tổng của học sinh chứ không chỉ gói cuối: buổi lớp nghỉ đánh dấu muộn (sau khi đã tạo gói kế) vẫn được tính,
 * và khoản đã trừ hay đã hoàn không bị trừ hoặc hoàn lần nữa.
 */
export function duConLai(goi: Goi[], buoi: BuoiDacBiet[], ngayVao: string, daHoan: number, truocThang: Thang): number {
  const phatSinh = goi.filter((g) => thangHetGoi(g) <= truocThang).reduce((s, g) => s + tienDuGoi(g, buoi, ngayVao), 0)
  const daTru = goi.reduce((s, g) => s + g.tien_du_tru, 0)
  return Math.max(0, phatSinh - daTru - daHoan)
}

export const vnd = (n: number) => n.toLocaleString('vi-VN') + ' đ'

export function tinNhanPhuHuynh(tenHs: string, thang: Thang, th: TongHopThang, soBuoi: number): string {
  const [y, m] = thang.split('-')
  return [
    `Trung tâm Anh ngữ Ms.Nhung xin thông báo học phí tháng ${m}/${y} của em ${tenHs}:`,
    `- Số buổi đã học trong tháng: ${soBuoi}`,
    `- Học phí tháng này: ${vnd(th.phaiThu)}`,
    `- Nợ cũ: ${vnd(th.noKyTruoc)}`,
    `- Đã thu: ${vnd(th.daThu)}`,
    `- Số cần nộp: ${vnd(Math.max(th.conPhaiThu, 0))}`,
    'Phụ huynh vui lòng hoàn tất học phí. Cảm ơn quý phụ huynh!',
  ].join('\n')
}
