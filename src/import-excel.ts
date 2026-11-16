// Import lớp và học sinh từ file mẫu Excel. Quyết định ở docs/YEU-CAU.md mục "Import lớp và học sinh bằng Excel":
// chỉ thêm mới, dòng đã có thì bỏ qua (import lại cùng file vẫn an toàn), dòng lỗi báo lý do và không nhập.
import type ExcelJS from 'exceljs'
import type { HocSinh, Lop } from './supabase'
import { docOGio, type GioThu } from './gio-hoc'

// không import giá trị từ ./supabase: file đó tạo client ngay khi nạp, test chạy không có .env
const THU = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

export const TRANG_LOP = 'Lớp'
export const TRANG_HS = 'Học sinh'
// thứ tự cột T2..CN trong file mẫu, đổi ra getDay() của JS
const COT_THU = [1, 2, 3, 4, 5, 6, 0]

export interface DongLopTho { so: number; ten: unknown; donGia: unknown; thu: unknown[] }
export interface DongHsTho {
  so: number; hoTen: unknown; lop: unknown; tenPh: unknown; sdt: unknown; ngayVao: unknown
  donGiaRieng: unknown; sticker: unknown; ghiChu: unknown
}

export type TrangThai = 'moi' | 'da_co' | 'loi'
export interface KqLop { loai: 'lop'; so: number; trangThai: TrangThai; loi?: string; ten: string; don_gia: number; lich: number[]; gio_thu: GioThu }
export interface KqHs {
  loai: 'hs'; so: number; trangThai: TrangThai; loi?: string
  ho_ten: string; tenLop: string; ten_phu_huynh: string | null; sdt_phu_huynh: string | null
  ngay_vao: string; don_gia_rieng: number | null; sticker_dau_ky: number; ghi_chu: string | null
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
  lopTho: DongLopTho[], hsTho: DongHsTho[], lopCo: Lop[], hsCo: HocSinh[], homNay: string,
): { lops: KqLop[]; hss: KqHs[] } {
  const tenLopCo = new Map(lopCo.map((l) => [khoa(l.ten), l]))
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
  const lopDung = new Set([...tenLopCo.keys(), ...lops.filter((l) => l.trangThai === 'moi').map((l) => khoa(l.ten))])
  const khoaHs = (ten: string, lop: string, sdt: string | null) => `${khoa(ten)}|${khoa(lop)}|${sdt ?? ''}`
  const hsDaCo = new Set(hsCo.map((h) => khoaHs(h.ho_ten, lopCo.find((l) => l.id === h.lop_id)?.ten ?? '', h.sdt_phu_huynh)))
  const hsTrongFile = new Set<string>()

  const hss: KqHs[] = hsTho.map((r) => {
    const hoTen = chu(r.hoTen), tenLop = chu(r.lop)
    const sdt = chuanSdt(r.sdt), ngay = chuanNgay(r.ngayVao, homNay)
    const gia = chuanTien(r.donGiaRieng, 'Đơn giá riêng', false), st = chuanTien(r.sticker, 'Sticker đã có', false)
    const kq: KqHs = {
      loai: 'hs', so: r.so, trangThai: 'moi', ho_ten: hoTen, tenLop, ten_phu_huynh: chu(r.tenPh) || null,
      sdt_phu_huynh: sdt.sdt, ngay_vao: ngay.ngay ?? homNay, don_gia_rieng: gia.so, sticker_dau_ky: st.so ?? 0,
      ghi_chu: chu(r.ghiChu) || null,
    }
    const loi = (!hoTen && 'Thiếu họ tên') || (!tenLop && 'Chưa chọn lớp')
      || (!lopDung.has(khoa(tenLop)) && `Lớp "${tenLop}" chưa có (hoặc dòng lớp đó đang lỗi)`)
      || sdt.loi || ngay.loi || gia.loi || st.loi
    if (loi) return { ...kq, trangThai: 'loi', loi }
    const k = khoaHs(hoTen, tenLop, sdt.sdt)
    if (hsDaCo.has(k)) return { ...kq, trangThai: 'da_co' }
    if (hsTrongFile.has(k)) return { ...kq, trangThai: 'da_co', loi: 'Trùng với dòng trên trong file' }
    hsTrongFile.add(k)
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
  wsHs.eachRow((row, so) => {
    if (so === 1 || laDongMau(row.getCell(1).value)) return
    const o = (c: number) => row.getCell(c).value
    if (![1, 2, 3, 4, 5, 6, 7, 8].some((c) => chu(o(c)))) return
    hsTho.push({ so, hoTen: o(1), lop: o(2), tenPh: o(3), sdt: o(4), ngayVao: o(5), donGiaRieng: o(6), sticker: o(7), ghiChu: o(8) })
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

export async function taiFileMau(lops: Lop[]) {
  const { default: Excel } = await import('exceljs')
  const wb = new Excel.Workbook()

  const hd = wb.addWorksheet('Hướng dẫn')
  hd.getColumn(1).width = 110
  ;[
    'CÁCH DÙNG FILE MẪU',
    '1. Trang "Lớp": mỗi dòng một lớp. Các lớp đang có đã điền sẵn, import sẽ bỏ qua chúng. Cột thứ có học ghi giờ bắt đầu-kết thúc, ví dụ 17:30-19:00; thứ không học để trống.',
    '2. Trang "Học sinh": mỗi dòng một học sinh. Cột Lớp chọn trong ô thả xuống (lấy từ trang Lớp).',
    '3. Cột có dấu * là bắt buộc. Dòng bắt đầu bằng "Ví dụ" sẽ được bỏ qua.',
    '4. SĐT phụ huynh: 10 số, bắt đầu bằng 0. Mỗi SĐT tạo một tài khoản phụ huynh, mật khẩu đầu là chính SĐT. Anh chị em dùng chung SĐT.',
    '5. Ngày vào học: dạng ngày/tháng/năm, để trống thì lấy ngày import.',
    '6. Đơn giá riêng: để trống thì học theo đơn giá của lớp. Sticker đã có: số sticker tích luỹ từ trước.',
    '7. Import chỉ THÊM MỚI. Học sinh trùng họ tên + lớp + SĐT phụ huynh với người đã có sẽ được bỏ qua, không bị sửa.',
    '8. Dòng lỗi không được nhập. Sửa trong file rồi import lại cùng file: những dòng đã nhập sẽ tự bỏ qua.',
  ].forEach((t, i) => { const r = hd.addRow([t]); if (i === 0) r.font = { bold: true, size: 14 } })

  const wsLop = wb.addWorksheet(TRANG_LOP)
  tieuDe(wsLop, [{ ten: 'Tên lớp', rong: 22, batBuoc: true }, { ten: 'Đơn giá/buổi', rong: 14, batBuoc: true },
    ...COT_THU.map((t) => ({ ten: THU[t], rong: 12 }))])
  wsLop.addRow(['Ví dụ: Movers 2', 120000, '', '17:30-19:00', '', '17:30-19:00', '', '08:00-09:30', '']).font = { italic: true, color: { argb: 'FF8C8C8C' } }
  for (const l of lops) wsLop.addRow([l.ten, l.don_gia, ...COT_THU.map((t) => (l.lich.includes(t) ? (l.gio_thu[t] ? `${l.gio_thu[t].bd}-${l.gio_thu[t].kt}` : 'chưa có giờ') : ''))])
  wsLop.getColumn(2).numFmt = '#,##0'

  const wsHs = wb.addWorksheet(TRANG_HS)
  tieuDe(wsHs, [{ ten: 'Họ tên', rong: 24, batBuoc: true }, { ten: 'Lớp', rong: 18, batBuoc: true }, { ten: 'Tên phụ huynh', rong: 18 },
    { ten: 'SĐT phụ huynh', rong: 15 }, { ten: 'Ngày vào học', rong: 13 }, { ten: 'Đơn giá riêng', rong: 13 },
    { ten: 'Sticker đã có', rong: 12 }, { ten: 'Ghi chú', rong: 28 }])
  wsHs.addRow(['Ví dụ: Nguyễn Gia Bảo', lops[0]?.ten ?? 'Movers 2', 'Chị Hằng', '0987220413', new Date(), '', 12, 'Anh trai học lớp khác'])
    .font = { italic: true, color: { argb: 'FF8C8C8C' } }
  // SĐT để Text cho khỏi mất số 0 đầu; Lớp là danh sách thả xuống lấy từ trang Lớp
  wsHs.getColumn(4).numFmt = '@'
  wsHs.getColumn(5).numFmt = 'dd/mm/yyyy'
  wsHs.getColumn(6).numFmt = '#,##0'
  for (let r = 2; r <= SO_DONG; r++) {
    wsHs.getCell(r, 2).dataValidation = {
      type: 'list', allowBlank: true, formulae: [`'${TRANG_LOP}'!$A$2:$A$${SO_DONG}`],
      showErrorMessage: true, errorTitle: 'Lớp không có', error: 'Chọn lớp trong danh sách, hoặc thêm lớp ở trang Lớp trước.',
    }
    wsHs.getCell(r, 4).numFmt = '@'
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
