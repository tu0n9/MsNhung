// Import lớp và học sinh từ file mẫu Excel.
// - Mã HS do hệ thống tự cấp sau khi nhập (HS001...); mỗi học sinh có 1 học phí/buổi cố định cho mọi lớp.
// - Tự gộp nhiều lớp thành 1 hồ sơ theo Họ tên + SĐT phụ huynh (chỉ tách thành 2 người khi có 2 SĐT khác nhau).
// - Dòng đã có trong đúng lớp thì bỏ qua (ngoại lệ: cập nhật Link nhóm Zalo).
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
  /** Ghi danh cũ từng ngừng học, nay import lại cần bật thành đang học thay vì insert mới */
  batLai?: boolean
}

/** Đếm số đầu việc sẽ thực thi (dòng thêm lớp kèm đổi link Zalo vẫn tính 1 lượt nhập). */
export function demCongViecImport(lops: KqLop[], hss: KqHs[]) {
  const lopMoi = lops.filter((l) => l.trangThai === 'moi').length
  const hsMoi = hss.filter((h) => h.trangThai === 'moi').length
  const themLop = hss.filter((h) => h.trangThai === 'them_lop').length
  const capNhatLink = hss.filter((h) => h.trangThai === 'da_co' && !!h.capNhatLink).length
  return { lopMoi, hsMoi, themLop, capNhatLink, tong: lopMoi + hsMoi + themLop + capNhatLink }
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
const DAU_BO_CU: [RegExp, string][] = [
  [/uỳ/g, 'ùy'], [/uý/g, 'úy'], [/uỷ/g, 'ủy'], [/uỹ/g, 'ũy'], [/uỵ/g, 'ụy'],
  [/oà/g, 'òa'], [/oá/g, 'óa'], [/oả/g, 'ỏa'], [/oã/g, 'õa'], [/oạ/g, 'ọa'],
]

export const khoa = (s: string) => {
  let k = s.normalize('NFC').trim().toLowerCase().replace(/\s+/g, ' ')
  for (const [re, rep] of DAU_BO_CU) k = k.replace(re, rep)
  return k
}

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

/** Link nhóm Zalo: lọc link zalo.me ra khỏi đoạn chữ dán vào (lời mời của Zalo có kèm chữ), bỏ dấu câu cuối & chặn scheme nguy hiểm. */
export function chuanLinkZalo(v: unknown): { link: string | null; loi?: string } {
  // ô hyperlink có nhãn chữ ("Nhóm lớp 3"): link thật nằm trong .hyperlink, nhãn không có URL
  const lienKet = typeof v === 'object' && v !== null ? (v as { hyperlink?: unknown }).hyperlink : undefined
  const tho = `${typeof lienKet === 'string' ? lienKet : ''} ${chu(v)}`.trim()
  if (!tho) return { link: null }
  if (/(?:javascript|data|vbscript):/i.test(tho)) {
    return { link: null, loi: 'Link nhóm Zalo chứa đường dẫn không an toàn' }
  }
  // Chỉ nhận host zalo.me ở đầu hoặc sau khoảng trắng/ngoặc mở để không dính domain giả mạo kiểu evil.com/zalo.me/...
  const m = tho.match(/(?:^|[\s(["'<])((?:https?:\/\/)?(?:www\.)?zalo\.me\/[^\s"'<>]+)/i)
  if (!m) return { link: null, loi: `"${tho.slice(0, 40)}" không có link nhóm Zalo (https://zalo.me/…)` }
  const sach = m[1].replace(/[.,;:!?)\]"'>]+$/, '')
  const duong = sach.replace(/^(?:https?:\/\/)?(?:www\.)?zalo\.me\//i, '')
  if (!duong) return { link: null, loi: `"${tho.slice(0, 40)}" thiếu đường dẫn nhóm Zalo` }
  return { link: `https://zalo.me/${duong}` }
}

/** Tiền: số nguyên không âm, hoặc chữ kiểu "150.000" / "150,000 đ". Chặn số thập phân ("150.5") và chữ lẫn số ("abc 123"). */
export function chuanTien(v: unknown, ten: string, batBuoc: boolean): { so: number | null; loi?: string } {
  if (typeof v === 'number') {
    return !Number.isFinite(v) || v < 0 || !Number.isInteger(v) ? { so: null, loi: `${ten} không hợp lệ` } : { so: v }
  }
  const tho = chu(v)
  if (!tho) return batBuoc ? { so: null, loi: `Thiếu ${ten.toLowerCase()}` } : { so: null }
  if (tho.includes('-')) return { so: null, loi: `${ten} không được âm` }
  const sach = tho.replace(/\s*(?:vn[dđ]|đồng|đ)\.?$/i, '').trim()
  const hopLe = /^(?:\d+|\d{1,3}(?:\.\d{3})+|\d{1,3}(?:,\d{3})+|\d{1,3}(?: \d{3})+)$/.test(sach)
  if (!hopLe) return { so: null, loi: `${ten} "${tho}" không phải số nguyên hợp lệ` }
  const so = Number(sach.replace(/\D/g, ''))
  if (!Number.isSafeInteger(so)) return { so: null, loi: `${ten} "${tho}" không hợp lệ` }
  return { so }
}

/** Ngày: ô ngày của Excel, số serial, hoặc chữ dd/mm/yyyy (năm 2000–2100). Trống = hôm nay. */
export function chuanNgay(v: unknown, homNay: string): { ngay: string | null; loi?: string } {
  if (v instanceof Date) {
    if (Number.isNaN(v.getTime())) return { ngay: null, loi: 'Ngày vào học không hợp lệ' }
    const y = v.getUTCFullYear()
    if (y < 2000 || y > 2100) return { ngay: null, loi: `Ngày vào học năm ${y} phải trong khoảng 2000–2100` }
    return { ngay: v.toISOString().slice(0, 10) }
  }
  if (typeof v === 'number') {
    if (!Number.isFinite(v)) return { ngay: null, loi: 'Ngày vào học không hợp lệ' }
    const dt = new Date(Date.UTC(1899, 11, 30) + v * 86400000)
    if (Number.isNaN(dt.getTime())) return { ngay: null, loi: 'Ngày vào học không hợp lệ' }
    const y = dt.getUTCFullYear()
    if (y < 2000 || y > 2100) return { ngay: null, loi: `Ngày vào học năm ${y} phải trong khoảng 2000–2100` }
    return { ngay: dt.toISOString().slice(0, 10) }
  }
  const tho = chu(v)
  if (!tho) return { ngay: homNay }
  const m = tho.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/)
  if (!m) return { ngay: null, loi: `Ngày vào học "${tho}" phải dạng ngày/tháng/năm` }
  const [d, th, y] = [Number(m[1]), Number(m[2]), Number(m[3])]
  if (y < 2000 || y > 2100) return { ngay: null, loi: `Ngày vào học "${tho}" phải có năm trong khoảng 2000–2100` }
  const dt = new Date(Date.UTC(y, th - 1, d))
  if (dt.getUTCFullYear() !== y || dt.getUTCDate() !== d || dt.getUTCMonth() !== th - 1) {
    return { ngay: null, loi: `Ngày vào học "${tho}" không có thật` }
  }
  return { ngay: dt.toISOString().slice(0, 10) }
}

// ---------- kiểm tra cả file ----------

interface NhomMoiTheoTen {
  so: number
  sdt: string | null
  donGia: number
  lops: Set<string>
  coLink: boolean
}

const sdtDb = (s?: string | null) => (s ? chuanSdt(s).sdt ?? s.replace(/\D/g, '') : '') || null

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
  const tenToHsCo = new Map<string, HocSinh[]>()
  for (const h of hsCo) {
    const tk = khoa(h.ho_ten)
    const ds = tenToHsCo.get(tk) ?? []
    ds.push(h)
    tenToHsCo.set(tk, ds)
  }
  const lopDangHocCo = new Map<string, Set<string>>()
  const lopNgungCo = new Map<string, Set<string>>()
  for (const g of gdCo) {
    const t = idToTenKhoa.get(g.lop_id)
    if (!t) continue
    const dich = g.trang_thai === 'ngung' ? lopNgungCo : lopDangHocCo
    if (!dich.has(g.hoc_sinh_id)) dich.set(g.hoc_sinh_id, new Set())
    dich.get(g.hoc_sinh_id)!.add(t)
  }

  const lopThemTrongFile = new Map<string, Set<string>>()
  const moiTheoTen = new Map<string, NhomMoiTheoTen[]>()

  const hss: KqHs[] = hsTho.map((r) => {
    const hoTen = chu(r.hoTen), tenLop = chu(r.lop), kLop = khoa(tenLop), tenK = khoa(hoTen)
    const sdt = chuanSdt(r.sdt), ngay = chuanNgay(r.ngayVao, homNay), link = chuanLinkZalo(r.linkZalo)
    const gia = chuanTien(r.donGia ?? r.donGiaRieng, 'Đơn giá/buổi', false)
    const st = chuanTien(r.sticker, 'Sticker đã có', false)
    const donGiaHsMoi = gia.so ?? giaLop.get(kLop) ?? 0
    const kq: KqHs = {
      loai: 'hs', so: r.so, trangThai: 'moi', ma_hs: null,
      ho_ten: hoTen, tenLop, ten_phu_huynh: chu(r.tenPh) || null,
      sdt_phu_huynh: sdt.sdt, ngay_vao: ngay.ngay ?? homNay, don_gia: donGiaHsMoi,
      sticker_dau_ky: st.so ?? 0, ghi_chu: chu(r.ghiChu) || null, link_zalo: link.link,
    }
    const loi = (!hoTen && 'Thiếu họ tên') || (!tenLop && 'Chưa chọn lớp')
      || (!giaLop.has(kLop) && `Lớp "${tenLop}" chưa có (hoặc dòng lớp đó đang lỗi)`)
      || sdt.loi || ngay.loi || gia.loi || st.loi || link.loi
    if (loi) return { ...kq, trangThai: 'loi', loi }

    const ungVienDb = tenToHsCo.get(tenK) ?? []
    let co: HocSinh | undefined
    if (sdt.sdt) {
      co = ungVienDb.find((h) => sdtDb(h.sdt_phu_huynh) === sdt.sdt)
      if (!co && ungVienDb.length === 1 && !sdtDb(ungVienDb[0].sdt_phu_huynh)) co = ungVienDb[0]
    } else if (ungVienDb.length === 1) {
      co = ungVienDb[0]
    } else if (ungVienDb.length > 1) {
      return {
        ...kq, trangThai: 'loi',
        loi: `Có ${ungVienDb.length} học sinh tên "${hoTen}" trong trung tâm. Nhập SĐT phụ huynh để xác định đúng em`,
      }
    }

    if (co) {
      const capNhat = link.link && link.link !== co.link_zalo ? { capNhatLink: co.id } : {}
      if (lopDangHocCo.get(co.id)?.has(kLop)) {
        return capNhat.capNhatLink
          ? { ...kq, ma_hs: co.ma_hs, don_gia: co.don_gia, trangThai: 'da_co', ...capNhat, loi: 'Sẽ cập nhật link nhóm Zalo' }
          : { ...kq, ma_hs: co.ma_hs, don_gia: co.don_gia, trangThai: 'da_co' }
      }
      if (!lopThemTrongFile.has(co.id)) lopThemTrongFile.set(co.id, new Set())
      const daThem = lopThemTrongFile.get(co.id)!
      if (daThem.has(kLop)) return { ...kq, ma_hs: co.ma_hs, don_gia: co.don_gia, trangThai: 'da_co', loi: 'Trùng với dòng trên trong file' }
      if (gia.so !== null && gia.so !== co.don_gia) {
        return {
          ...kq, ma_hs: co.ma_hs, don_gia: co.don_gia, trangThai: 'loi',
          loi: `Học sinh "${co.ho_ten}" có học phí cố định ${co.don_gia.toLocaleString('vi-VN')} đ/buổi (đang ghi ${gia.so.toLocaleString('vi-VN')} đ) — để trống hoặc nhập đúng mức cố định`,
        }
      }
      daThem.add(kLop)
      const batLai = !!lopNgungCo.get(co.id)?.has(kLop)
      return {
        ...kq, trangThai: 'them_lop', ma_hs: co.ma_hs, hocSinhId: co.id, don_gia: co.don_gia,
        ...capNhat, ...(batLai ? { batLai: true } : {}),
        loi: `${batLai ? 'Cho học lại' : 'Thêm vào'} lớp ${tenLop} cho ${co.ho_ten} (${co.ma_hs})${capNhat.capNhatLink ? ' · cập nhật link Zalo' : ''}`,
      }
    }

    const dsCungTen = moiTheoTen.get(tenK) ?? []
    let truoc: NhomMoiTheoTen | undefined
    if (sdt.sdt) {
      truoc = dsCungTen.find((x) => x.sdt === sdt.sdt)
      if (!truoc && dsCungTen.length === 1 && !dsCungTen[0].sdt) {
        truoc = dsCungTen[0]
        truoc.sdt = sdt.sdt
      }
    } else if (dsCungTen.length === 1) {
      truoc = dsCungTen[0]
    } else if (dsCungTen.length > 1) {
      return {
        ...kq, trangThai: 'loi',
        loi: 'Trùng tên với nhiều học sinh khác SĐT ở các dòng trên: nhập SĐT phụ huynh để xác định đúng em',
      }
    }

    if (truoc) {
      if (truoc.lops.has(kLop)) return { ...kq, don_gia: truoc.donGia, trangThai: 'da_co', loi: 'Trùng với dòng trên trong file' }
      if (gia.so !== null && gia.so !== truoc.donGia) {
        return {
          ...kq, don_gia: truoc.donGia, trangThai: 'loi',
          loi: `Học sinh "${hoTen}" đã cố định học phí ${truoc.donGia.toLocaleString('vi-VN')} đ/buổi ở dòng ${truoc.so} (đang ghi ${gia.so.toLocaleString('vi-VN')} đ) — để trống hoặc nhập đúng mức cố định`,
        }
      }
      truoc.lops.add(kLop)
      const capNhatLinkMoi = !truoc.coLink && !!link.link
      if (capNhatLinkMoi) truoc.coLink = true
      return {
        ...kq, trangThai: 'them_lop', gopVoiDong: truoc.so, don_gia: truoc.donGia,
        link_zalo: capNhatLinkMoi ? link.link : null,
        loi: `Gộp chung học sinh với dòng ${truoc.so}`,
      }
    }

    dsCungTen.push({ so: r.so, sdt: sdt.sdt, donGia: donGiaHsMoi, lops: new Set([kLop]), coLink: !!link.link })
    moiTheoTen.set(tenK, dsCungTen)
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
  const cols = [1 + d, 2 + d, 3 + d, 4 + d, 5 + d, 6 + d, 7 + d, 8 + d, 9 + d]
  wsHs.eachRow((row, so) => {
    if (so === 1 || laDongMau(row.getCell(1).value) || laDongMau(row.getCell(1 + d).value)) return
    const o = (c: number) => row.getCell(c).value
    if (!cols.some((c) => chu(o(c)))) return
    hsTho.push({
      so, maHs: '', hoTen: o(1 + d), lop: o(2 + d), tenPh: o(3 + d), sdt: o(4 + d),
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

export async function taoBufferFileMau(lops: Lop[], hss: HocSinh[], gds: GhiDanh[]): Promise<ArrayBuffer> {
  const { default: Excel } = await import('exceljs')
  const wb = new Excel.Workbook()

  const hd = wb.addWorksheet('Hướng dẫn')
  hd.getColumn(1).width = 110
  ;[
    'CÁCH DÙNG FILE MẪU',
    '1. Trang "Lớp": mỗi dòng một lớp. Các lớp đang có đã điền sẵn, import sẽ bỏ qua chúng. Cột thứ có học ghi giờ bắt đầu-kết thúc, ví dụ 17:30-19:00; thứ không học để trống.',
    '2. Trang "Học sinh": mỗi dòng là 1 lượt ghi danh (1 học sinh vào 1 lớp). Cột Lớp chọn trong ô thả xuống (lấy từ trang Lớp).',
    '3. Cột có dấu * là bắt buộc. Dòng bắt đầu bằng "Ví dụ" sẽ được bỏ qua.',
    '4. Mã HS được hệ thống tự cấp (HS001, HS002...) sau khi nhập nên không cần điền trong file. Các dòng cùng Họ tên (khi chưa có SĐT hoặc cùng SĐT phụ huynh) sẽ tự gộp thành 1 học sinh học nhiều lớp; chỉ tách thành 2 người khi có 2 SĐT khác nhau.',
    '5. SĐT phụ huynh: 10 số, bắt đầu bằng 0 (chỉ dùng để liên hệ và phân biệt học sinh trùng tên, không tạo tài khoản đăng nhập).',
    '6. Ngày vào học: dạng ngày/tháng/năm, để trống thì lấy ngày import.',
    '7. Đơn giá/buổi: mức học phí cố định duy nhất áp cho TẤT CẢ các lớp của học sinh (nhập 0 = học miễn phí; để trống = lấy theo đơn giá của lớp đầu tiên).',
    '8. Dòng đã có trong đúng lớp đó được bỏ qua (trừ cột Link nhóm Zalo: có link mới thì cập nhật). Dòng lỗi không được nhập; sửa rồi import lại vẫn an toàn.',
    '9. CHÚ Ý: không sửa Họ tên, Lớp, SĐT của các dòng điền sẵn để tránh nhận nhầm thành học sinh mới. Muốn sửa thông tin thì sửa trực tiếp trong app.',
  ].forEach((t, i) => { const r = hd.addRow([t]); if (i === 0) r.font = { bold: true, size: 14 } })

  const wsLop = wb.addWorksheet(TRANG_LOP)
  tieuDe(wsLop, [{ ten: 'Tên lớp', rong: 22, batBuoc: true }, { ten: 'Đơn giá/buổi', rong: 14, batBuoc: true },
    ...COT_THU.map((t) => ({ ten: THU[t], rong: 12 }))])
  wsLop.addRow(['Ví dụ: Movers 2', 120000, '', '17:30-19:00', '', '17:30-19:00', '', '08:00-09:30', '']).font = { italic: true, color: { argb: 'FF8C8C8C' } }
  for (const l of lops) wsLop.addRow([l.ten, l.don_gia, ...COT_THU.map((t) => (l.lich.includes(t) ? (l.gio_thu[t] ? `${l.gio_thu[t].bd}-${l.gio_thu[t].kt}` : 'chưa có giờ') : ''))])
  wsLop.getColumn(2).numFmt = '#,##0'

  const wsHs = wb.addWorksheet(TRANG_HS)
  tieuDe(wsHs, [
    { ten: 'Họ tên', rong: 24, batBuoc: true }, { ten: 'Lớp', rong: 18, batBuoc: true },
    { ten: 'Tên phụ huynh', rong: 18 }, { ten: 'SĐT phụ huynh', rong: 15 }, { ten: 'Ngày vào học', rong: 13 },
    { ten: 'Đơn giá/buổi', rong: 13 }, { ten: 'Sticker đã có', rong: 12 }, { ten: 'Ghi chú', rong: 28 }, { ten: 'Link nhóm Zalo', rong: 34 },
  ])
  wsHs.addRow(['Ví dụ: Nguyễn Gia Bảo', lops[0]?.ten ?? 'Movers 2', 'Chị Hằng', '0987220413', new Date(), 150000, 12, 'Học nhiều lớp ghi mỗi lớp 1 dòng cùng Họ tên', 'https://zalo.me/g/abcxyz123'])
    .font = { italic: true, color: { argb: 'FF8C8C8C' } }
  const tenLop = new Map(lops.map((l) => [l.id, l.ten]))
  const hsMap = new Map(hss.map((h) => [h.id, h]))
  const dongMau = gds
    .filter((g) => g.trang_thai === 'dang_hoc' && tenLop.has(g.lop_id) && hsMap.has(g.hoc_sinh_id))
    .map((g) => ({ g, h: hsMap.get(g.hoc_sinh_id)!, lopTen: tenLop.get(g.lop_id)! }))
    .sort((a, b) => a.lopTen.localeCompare(b.lopTen) || a.h.ho_ten.localeCompare(b.h.ho_ten))
  for (const { g, h, lopTen } of dongMau) {
    wsHs.addRow([h.ho_ten, lopTen, h.ten_phu_huynh ?? '', h.sdt_phu_huynh ?? '', new Date(g.ngay_vao),
      h.don_gia, h.sticker_dau_ky || '', h.ghi_chu ?? '', h.link_zalo ?? ''])
  }
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

  return await wb.xlsx.writeBuffer() as ArrayBuffer
}

export async function taiFileMau(lops: Lop[], hss: HocSinh[], gds: GhiDanh[]) {
  taiVe(await taoBufferFileMau(lops, hss, gds), 'mau-import-lop-hoc-sinh.xlsx')
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
