// Import lớp và học sinh từ file mẫu Excel.
// - Dòng đã có (khớp Mã HS hoặc Họ tên + SĐT trong đúng lớp) thì bỏ qua (ngoại lệ: cập nhật Link nhóm Zalo).
// - Cùng học sinh (khớp Mã HS hoặc Họ tên + SĐT) nhưng ghi ở lớp mới -> thêm ghi_danh vào lớp mới, không tạo học sinh thứ 2.
import type ExcelJS from 'exceljs'
import type { GhiDanh, HocSinh, Lop } from './supabase'
import { docOGio, type GioThu } from './gio-hoc'

// không import giá trị từ ./supabase: file đó tạo client ngay khi nạp, test chạy không có .env
const THU = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

export const TRANG_LOP = 'Lớp'
export const TRANG_HS = 'Học sinh'
// thứ tự cột T2..CN trong file mẫu, đổi ra getDay() của JS
const COT_THU = [1, 2, 3, 4, 5, 6, 0]

export interface DongLopTho { so: number; ten: unknown; donGia: unknown; thu: unknown[] }
export interface DongHsTho {
  so: number; maHs?: unknown; hoTen: unknown; lop: unknown; tenPh: unknown; sdt: unknown; ngayVao: unknown
  donGia?: unknown; donGiaRieng?: unknown; sticker: unknown; ghiChu: unknown; linkZalo: unknown
}

export type TrangThai = 'moi' | 'them_lop' | 'da_co' | 'loi'
export interface KqLop { loai: 'lop'; so: number; trangThai: TrangThai; loi?: string; ten: string; don_gia: number; lich: number[]; gio_thu: GioThu }
export interface KqHs {
  loai: 'hs'; so: number; trangThai: TrangThai; loi?: string
  ma_hs: string | null; ho_ten: string; tenLop: string; ten_phu_huynh: string | null; sdt_phu_huynh: string | null
  ngay_vao: string; don_gia: number; sticker_dau_ky: number; ghi_chu: string | null
  link_zalo: string | null
  /** Học sinh đã có trong DB cần thêm ghi_danh vào lớp mới */
  hocSinhId?: string
  /** Dòng học sinh mới phía trên trong cùng file cần gộp lớp vào */
  gopVoiDong?: number
  /** Dòng đã có / thêm lớp mà link trong file khác link đang có: id học sinh cần cập nhật link */
  capNhatLink?: string
}

// ---------- chuẩn hoá từng ô ----------

const chu = (v: unknown): string => {
  if (v == null) return ''
  // ô có định dạng (rich text, hyperlink, công thức) đọc ra object
  if (typeof v === 'object' && !(v instanceof Date)) {
    const o = v as { text?: string; result?: unknown; richText?: { text: string }[] }
    if (o.richText) return o.richText.map((r) => r.text).join('').trim()
    if (o.text !== undefined) return String(o.text).trim()
    if (o.result !== undefined) return chu(o.result)
  }
  return String(v).trim()
}
export const khoa = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ')

/** SĐT: bỏ ký tự thừa, +84 → 0; hợp lệ khi còn 10 số bắt đầu bằng 0. */
export function chuanSdt(v: unknown): { sdt: string | null; loi?: string } {
  const tho = chu(v)
  if (!tho) return { sdt: null }
  let s = tho.replace(/\D/g, '')
  if (s.startsWith('84') && s.length === 11) s = '0' + s.slice(2)
  // Excel kiểu số làm rơi số 0 đầu: 912345678 (9 số) thì thêm lại
  if (/^[1-9]\d{8}$/.test(s) && typeof v === 'number') s = '0' + s
  if (!/^0\d{9}$/.test(s)) return { sdt: null, loi: `SĐT phụ huynh "${tho}" phải có 10 số, bắt đầu bằng 0` }
  return { sdt: s }
}

/** Link nhóm Zalo: lọc link zalo.me ra khỏi đoạn chữ dán vào (lời mời của Zalo có kèm chữ), thiếu https thì thêm. */
export function chuanLinkZalo(v: unknown): { link: string | null; loi?: string } {
  // ô hyperlink có nhãn chữ ("Nhóm lớp 3"): link thật nằm trong .hyperlink, nhãn không có URL
  const lienKet = typeof v === 'object' && v !== null ? (v as { hyperlink?: unknown }).hyperlink : undefined
  const tho = `${typeof lienKet === 'string' ? lienKet : ''} ${chu(v)}`.trim()
  if (!tho) return { link: null }
  const m = tho.match(/(?:https?:\/\/)?(?:www\.)?zalo\.me\/\S+/i)
  if (!m) return { link: null, loi: `"${tho.slice(0, 40)}" không có link nhóm Zalo (https://zalo.me/…)` }
  return { link: 'https://zalo.me/' + m[0].replace(/^(?:https?:\/\/)?(?:www\.)?zalo\.me\//i, '') }
}

/** Tiền: số, hoặc chữ kiểu "150.000" / "150,000 đ". */
export function chuanTien(v: unknown, ten: string, batBuoc: boolean): { so: number | null; loi?: string } {
  if (typeof v === 'number') return v < 0 || !Number.isInteger(v) ? { so: null, loi: `${ten} không hợp lệ` } : { so: v }
  const tho = chu(v)
  if (!tho) return batBuoc ? { so: null, loi: `Thiếu ${ten.toLowerCase()}` } : { so: null }
  if (tho.includes('-')) return { so: null, loi: `${ten} không được âm` }
  const s = tho.replace(/[^\d]/g, '')
  if (!s) return { so: null, loi: `${ten} "${tho}" không phải số` }
  return { so: Number(s) }
}

/** Ngày: ô ngày của Excel, số serial, hoặc chữ dd/mm/yyyy. Trống = hôm nay. */
export function chuanNgay(v: unknown, homNay: string): { ngay: string | null; loi?: string } {
  if (v instanceof Date) return { ngay: v.toISOString().slice(0, 10) }
  if (typeof v === 'number') return { ngay: new Date(Date.UTC(1899, 11, 30) + v * 86400000).toISOString().slice(0, 10) }
  const tho = chu(v)
  if (!tho) return { ngay: homNay }
  const m = tho.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/)
  if (!m) return { ngay: null, loi: `Ngày vào học "${tho}" phải dạng ngày/tháng/năm` }
  const [d, th, y] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const dt = new Date(Date.UTC(y, th - 1, d))
  if (dt.getUTCDate() !== d || dt.getUTCMonth() !== th - 1) return { ngay: null, loi: `Ngày vào học "${tho}" không có thật` }
  return { ngay: dt.toISOString().slice(0, 10) }
}

// ---------- kiểm tra cả file ----------

export function kiemTra(
  lopTho: DongLopTho[], hsTho: DongHsTho[], lopCo: Lop[], hsCo: HocSinh[], gdCo: GhiDanh[], homNay: string,
): { lops: KqLop[]; hss: KqHs[] } {
  const tenLopCo = new Map(lopCo.map((l) => [khoa(l.ten), l]))
  const idToTenKhoa = new Map(lopCo.map((l) => [l.id, khoa(l.ten)]))
  const daGap = new Set<string>()

  const lops: KqLop[] = lopTho.map((r) => {
    const ten = chu(r.ten)
    const gia = chuanTien(r.donGia, 'Đơn giá/buổi', true)
    // ô thứ ghi giờ học "17:30-19:00"; ô trống = không học thứ đó
    const o = COT_THU.map((t, i) => ({ t, v: chu(r.thu[i]), g: docOGio(chu(r.thu[i])) })).filter((x) => x.v)
    const thuSai = o.find((x) => !x.g)
    const gio_thu: GioThu = Object.fromEntries(o.filter((x) => x.g).map((x) => [x.t, x.g!]))
    const lich = o.filter((x) => x.g).map((x) => x.t)
    const kq: KqLop = { loai: 'lop', so: r.so, trangThai: 'moi', ten, don_gia: gia.so ?? 0, lich, gio_thu }
    if (!ten) return { ...kq, trangThai: 'loi', loi: 'Thiếu tên lớp' }
    if (tenLopCo.has(khoa(ten))) return { ...kq, trangThai: 'da_co' }
    if (daGap.has(khoa(ten))) return { ...kq, trangThai: 'da_co', loi: 'Trùng tên với dòng trên trong file' }
    daGap.add(khoa(ten))
    if (gia.loi) return { ...kq, trangThai: 'loi', loi: gia.loi }
    if (thuSai) return { ...kq, trangThai: 'loi', loi: `Cột ${THU[thuSai.t]} ghi giờ dạng 17:30-19:00 (đang có "${thuSai.v}")` }
    if (!lich.length) return { ...kq, trangThai: 'loi', loi: 'Chưa ghi giờ vào ngày học nào' }
    return kq
  })

  // học sinh được xếp vào lớp đã có hoặc lớp mới hợp lệ trong cùng file
  const giaLop = new Map<string, number>([
    ...lopCo.map((l) => [khoa(l.ten), l.don_gia] as const),
    ...lops.filter((l) => l.trangThai === 'moi').map((l) => [khoa(l.ten), l.don_gia] as const),
  ])
  const maCo = new Map(hsCo.filter((h) => h.ma_hs).map((h) => [khoa(h.ma_hs), h]))
  const tenSdtCo = new Map<string, HocSinh>()
  for (const h of hsCo) {
    if (!h.sdt_phu_huynh) continue
    const k = `${khoa(h.ho_ten)}|${h.sdt_phu_huynh}`
    if (!tenSdtCo.has(k)) tenSdtCo.set(k, h)
  }
  const tenCo = new Set(hsCo.map((h) => khoa(h.ho_ten)))
  const lopCuaHsCo = new Map<string, Set<string>>()
  for (const g of gdCo) {
    const t = idToTenKhoa.get(g.lop_id)
    if (!t) continue
    if (!lopCuaHsCo.has(g.hoc_sinh_id)) lopCuaHsCo.set(g.hoc_sinh_id, new Set())
    lopCuaHsCo.get(g.hoc_sinh_id)!.add(t)
  }

  const lopThemTrongFile = new Map<string, Set<string>>()
  const moiTheoTenSdt = new Map<string, { so: number; lops: Set<string> }>()
  const moiKhongSdt = new Map<string, { so: number; lops: Set<string> }>()

  const hss: KqHs[] = hsTho.map((r) => {
    const maRaw = chu(r.maHs)
    const hoTen = chu(r.hoTen), tenLop = chu(r.lop), kLop = khoa(tenLop)
    const sdt = chuanSdt(r.sdt), ngay = chuanNgay(r.ngayVao, homNay), link = chuanLinkZalo(r.linkZalo)
    const gia = chuanTien(r.donGia ?? r.donGiaRieng, 'Đơn giá/buổi', false), st = chuanTien(r.sticker, 'Sticker đã có', false)
    const kq: KqHs = {
      loai: 'hs', so: r.so, trangThai: 'moi', ma_hs: maRaw ? maRaw.toUpperCase() : null,
      ho_ten: hoTen, tenLop, ten_phu_huynh: chu(r.tenPh) || null,
      sdt_phu_huynh: sdt.sdt, ngay_vao: ngay.ngay ?? homNay, don_gia: gia.so ?? giaLop.get(kLop) ?? 0,
      sticker_dau_ky: st.so ?? 0, ghi_chu: chu(r.ghiChu) || null, link_zalo: link.link,
    }
    const loi = (!hoTen && 'Thiếu họ tên') || (!tenLop && 'Chưa chọn lớp')
      || (!giaLop.has(kLop) && `Lớp "${tenLop}" chưa có (hoặc dòng lớp đó đang lỗi)`)
      || sdt.loi || ngay.loi || gia.loi || st.loi || link.loi
    if (loi) return { ...kq, trangThai: 'loi', loi }

    if (maRaw && !maCo.has(khoa(maRaw))) {
      return { ...kq, trangThai: 'loi', loi: `Không tìm thấy Mã HS "${maRaw}" (để trống nếu là học sinh mới)` }
    }
    const co = maRaw ? maCo.get(khoa(maRaw)) : (sdt.sdt ? tenSdtCo.get(`${khoa(hoTen)}|${sdt.sdt}`) : undefined)
    if (co) {
      const capNhat = link.link && link.link !== co.link_zalo ? { capNhatLink: co.id } : {}
      if (lopCuaHsCo.get(co.id)?.has(kLop)) {
        return capNhat.capNhatLink
          ? { ...kq, trangThai: 'da_co', ...capNhat, loi: 'Sẽ cập nhật link nhóm Zalo' }
          : { ...kq, trangThai: 'da_co' }
      }
      if (!lopThemTrongFile.has(co.id)) lopThemTrongFile.set(co.id, new Set())
      const daThem = lopThemTrongFile.get(co.id)!
      if (daThem.has(kLop)) return { ...kq, trangThai: 'da_co', loi: 'Trùng với dòng trên trong file' }
      daThem.add(kLop)
      return {
        ...kq, trangThai: 'them_lop', hocSinhId: co.id, ...capNhat,
        loi: `Thêm vào lớp ${tenLop} cho ${co.ho_ten} (${co.ma_hs})${capNhat.capNhatLink ? ' · cập nhật link Zalo' : ''}`,
      }
    }

    if (!sdt.sdt && tenCo.has(khoa(hoTen))) {
      return { ...kq, trangThai: 'loi', loi: `Đã có em "${hoTen}" trong trung tâm. Ghi Mã HS nếu học thêm lớp, hoặc nhập SĐT phụ huynh nếu là em khác` }
    }
    if (sdt.sdt) {
      const k = `${khoa(hoTen)}|${sdt.sdt}`
      const truoc = moiTheoTenSdt.get(k)
      if (truoc) {
        if (truoc.lops.has(kLop)) return { ...kq, trangThai: 'da_co', loi: 'Trùng với dòng trên trong file' }
        truoc.lops.add(kLop)
        return { ...kq, trangThai: 'them_lop', gopVoiDong: truoc.so, loi: `Gộp chung học sinh với dòng ${truoc.so}` }
      }
      moiTheoTenSdt.set(k, { so: r.so, lops: new Set([kLop]) })
      return kq
    }
    const truoc = moiKhongSdt.get(khoa(hoTen))
    if (truoc) {
      if (truoc.lops.has(kLop)) return { ...kq, trangThai: 'da_co', loi: 'Trùng với dòng trên trong file' }
      return { ...kq, trangThai: 'loi', loi: `Trùng tên dòng ${truoc.so} (chưa có SĐT): nhập SĐT phụ huynh nếu là cùng em học nhiều lớp` }
    }
    moiKhongSdt.set(khoa(hoTen), { so: r.so, lops: new Set([kLop]) })
    return kq
  })
  return { lops, hss }
}

// ---------- đọc / tạo file (cần exceljs, nạp lười vì nặng) ----------

const laDongMau = (ten: unknown) => /^ví dụ/i.test(chu(ten))

export async function docFile(buf: ArrayBuffer): Promise<{ lopTho: DongLopTho[]; hsTho: DongHsTho[] }> {
  const { default: Excel } = await import('exceljs')
  const wb = new Excel.Workbook()
  await wb.xlsx.load(buf)
  const wsLop = wb.getWorksheet(TRANG_LOP), wsHs = wb.getWorksheet(TRANG_HS)
  if (!wsLop || !wsHs) throw new Error(`File phải có trang "${TRANG_LOP}" và "${TRANG_HS}". Hãy tải file mẫu và điền vào đó.`)
  const lopTho: DongLopTho[] = [], hsTho: DongHsTho[] = []
  wsLop.eachRow((row, so) => {
    if (so === 1 || laDongMau(row.getCell(1).value)) return
    const thu = COT_THU.map((_, i) => row.getCell(3 + i).value)
    if (![row.getCell(1).value, row.getCell(2).value, ...thu].some((v) => chu(v))) return
    lopTho.push({ so, ten: row.getCell(1).value, donGia: row.getCell(2).value, thu })
  })
  const coMa = /^mã/i.test(chu(wsHs.getRow(1).getCell(1).value))
  const d = coMa ? 1 : 0
  wsHs.eachRow((row, so) => {
    if (so === 1 || laDongMau(row.getCell(1).value) || laDongMau(row.getCell(1 + d).value)) return
    const o = (c: number) => row.getCell(c).value
    const cols = coMa ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] : [1, 2, 3, 4, 5, 6, 7, 8, 9]
    if (!cols.some((c) => chu(o(c)))) return
    hsTho.push({
      so, maHs: coMa ? o(1) : '', hoTen: o(1 + d), lop: o(2 + d), tenPh: o(3 + d), sdt: o(4 + d),
      ngayVao: o(5 + d), donGia: o(6 + d), sticker: o(7 + d), ghiChu: o(8 + d), linkZalo: o(9 + d),
    })
  })
  return { lopTho, hsTho }
}

function tieuDe(ws: ExcelJS.Worksheet, cot: { ten: string; rong: number; batBuoc?: boolean }[]) {
  ws.columns = cot.map((c) => ({ header: c.ten + (c.batBuoc ? ' *' : ''), width: c.rong }))
  ws.getRow(1).eachCell((cell, i) => {
    cell.font = { bold: true, color: { argb: cot[i - 1].batBuoc ? 'FFA8071A' : 'FF262626' } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE7BA' } }
  })
  ws.views = [{ state: 'frozen', ySplit: 1 }]
}

const SO_DONG = 500

export async function taiFileMau(lops: Lop[], hss: HocSinh[], gds: GhiDanh[]) {
  const { default: Excel } = await import('exceljs')
  const wb = new Excel.Workbook()

  const hd = wb.addWorksheet('Hướng dẫn')
  hd.getColumn(1).width = 110
  ;[
    'CÁCH DÙNG FILE MẪU',
    '1. Trang "Lớp": mỗi dòng một lớp. Các lớp đang có đã điền sẵn, import sẽ bỏ qua chúng. Cột thứ có học ghi giờ bắt đầu-kết thúc, ví dụ 17:30-19:00; thứ không học để trống.',
    '2. Trang "Học sinh": mỗi dòng là 1 lượt ghi danh (1 học sinh vào 1 lớp). Cột Lớp chọn trong ô thả xuống (lấy từ trang Lớp).',
    '3. Cột có dấu * là bắt buộc. Dòng bắt đầu bằng "Ví dụ" sẽ được bỏ qua.',
    '4. Mã HS: để trống với học sinh mới (app tự cấp HS001...). Muốn xếp thêm lớp cho học sinh đã có, ghi đúng Mã HS hoặc nhập giống hệt Họ tên + SĐT phụ huynh ở các dòng lớp khác nhau — app sẽ gộp thành 1 học sinh duy nhất.',
    '5. SĐT phụ huynh: 10 số, bắt đầu bằng 0 (chỉ dùng để liên hệ và phân biệt học sinh trùng tên, không tạo tài khoản đăng nhập).',
    '6. Ngày vào học: dạng ngày/tháng/năm, để trống thì lấy ngày import.',
    '7. Đơn giá/buổi: mức cố định áp dụng cho học sinh ở mọi lớp; để trống thì lấy theo đơn giá của lớp đầu tiên.',
    '8. Dòng đã có trong đúng lớp đó được bỏ qua (trừ cột Link nhóm Zalo: có link mới thì cập nhật). Dòng lỗi không được nhập; sửa rồi import lại vẫn an toàn.',
    '9. CHÚ Ý: không sửa Mã HS, Họ tên, Lớp, SĐT của các dòng điền sẵn để tránh nhận nhầm thành học sinh mới. Muốn sửa thông tin thì sửa trực tiếp trong app.',
  ].forEach((t, i) => { const r = hd.addRow([t]); if (i === 0) r.font = { bold: true, size: 14 } })

  const wsLop = wb.addWorksheet(TRANG_LOP)
  tieuDe(wsLop, [{ ten: 'Tên lớp', rong: 22, batBuoc: true }, { ten: 'Đơn giá/buổi', rong: 14, batBuoc: true },
    ...COT_THU.map((t) => ({ ten: THU[t], rong: 12 }))])
  wsLop.addRow(['Ví dụ: Movers 2', 120000, '', '17:30-19:00', '', '17:30-19:00', '', '08:00-09:30', '']).font = { italic: true, color: { argb: 'FF8C8C8C' } }
  for (const l of lops) wsLop.addRow([l.ten, l.don_gia, ...COT_THU.map((t) => (l.lich.includes(t) ? (l.gio_thu[t] ? `${l.gio_thu[t].bd}-${l.gio_thu[t].kt}` : 'chưa có giờ') : ''))])
  wsLop.getColumn(2).numFmt = '#,##0'

  const wsHs = wb.addWorksheet(TRANG_HS)
  tieuDe(wsHs, [
    { ten: 'Mã HS', rong: 10 }, { ten: 'Họ tên', rong: 24, batBuoc: true }, { ten: 'Lớp', rong: 18, batBuoc: true },
    { ten: 'Tên phụ huynh', rong: 18 }, { ten: 'SĐT phụ huynh', rong: 15 }, { ten: 'Ngày vào học', rong: 13 },
    { ten: 'Đơn giá/buổi', rong: 13 }, { ten: 'Sticker đã có', rong: 12 }, { ten: 'Ghi chú', rong: 28 }, { ten: 'Link nhóm Zalo', rong: 34 },
  ])
  wsHs.addRow(['', 'Ví dụ: Nguyễn Gia Bảo', lops[0]?.ten ?? 'Movers 2', 'Chị Hằng', '0987220413', new Date(), 150000, 12, 'Học 2 lớp ghi 2 dòng cùng tên + SĐT', 'https://zalo.me/g/abcxyz123'])
    .font = { italic: true, color: { argb: 'FF8C8C8C' } }
  const tenLop = new Map(lops.map((l) => [l.id, l.ten]))
  const hsMap = new Map(hss.map((h) => [h.id, h]))
  const dongMau = gds
    .filter((g) => g.trang_thai === 'dang_hoc' && tenLop.has(g.lop_id) && hsMap.has(g.hoc_sinh_id))
    .map((g) => ({ g, h: hsMap.get(g.hoc_sinh_id)!, lopTen: tenLop.get(g.lop_id)! }))
    .sort((a, b) => a.lopTen.localeCompare(b.lopTen) || a.h.ho_ten.localeCompare(b.h.ho_ten))
  for (const { g, h, lopTen } of dongMau) {
    wsHs.addRow([h.ma_hs, h.ho_ten, lopTen, h.ten_phu_huynh ?? '', h.sdt_phu_huynh ?? '', new Date(g.ngay_vao),
      h.don_gia, h.sticker_dau_ky || '', h.ghi_chu ?? '', h.link_zalo ?? ''])
  }
  // SĐT để Text cho khỏi mất số 0 đầu; Lớp là danh sách thả xuống lấy từ trang Lớp
  wsHs.getColumn(5).numFmt = '@'
  wsHs.getColumn(6).numFmt = 'dd/mm/yyyy'
  wsHs.getColumn(7).numFmt = '#,##0'
  for (let r = 2; r <= SO_DONG; r++) {
    wsHs.getCell(r, 3).dataValidation = {
      type: 'list', allowBlank: true, formulae: [`'${TRANG_LOP}'!$A$2:$A$${SO_DONG}`],
      showErrorMessage: true, errorTitle: 'Lớp không có', error: 'Chọn lớp trong danh sách, hoặc thêm lớp ở trang Lớp trước.',
    }
    wsHs.getCell(r, 5).numFmt = '@'
  }

  const buf = await wb.xlsx.writeBuffer()
  taiVe(buf, 'mau-import-lop-hoc-sinh.xlsx')
}

export async function taiDanhSachLoi(lops: KqLop[], hss: KqHs[]) {
  const { default: Excel } = await import('exceljs')
  const wb = new Excel.Workbook()
  const ws = wb.addWorksheet('Lỗi')
  tieuDe(ws, [{ ten: 'Trang', rong: 10 }, { ten: 'Dòng', rong: 7 }, { ten: 'Tên', rong: 26 }, { ten: 'Lỗi', rong: 70 }])
  for (const l of lops.filter((x) => x.trangThai === 'loi')) ws.addRow([TRANG_LOP, l.so, l.ten, l.loi])
  for (const h of hss.filter((x) => x.trangThai === 'loi')) ws.addRow([TRANG_HS, h.so, h.ho_ten, h.loi])
  taiVe(await wb.xlsx.writeBuffer(), 'loi-import.xlsx')
}

function taiVe(buf: ArrayBuffer, ten: string) {
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
  a.download = ten
  a.click()
}
