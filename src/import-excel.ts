// Import lớp và học sinh từ file mẫu Excel.
// - Mã HS (cột không bắt buộc): hệ thống tự cấp cho HS mới (HS001...), điền sẵn cho HS cũ để phân biệt tuyệt đối khi trùng tên.
// - Khi không có Mã HS: gộp hoặc tách học sinh trùng tên dựa trên SĐT phụ huynh hoặc Link nhóm Zalo; thiếu thông tin thì báo lỗi, không gộp nhầm im lặng.
// - Mỗi học sinh có 1 học phí/buổi cố định cho mọi lớp; dòng đã có trong đúng lớp thì bỏ qua (ngoại lệ: cập nhật Link nhóm Zalo).
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
  link: string | null
  donGia: number
  lops: Set<string>
  coLink: boolean
}

const sdtDb = (s?: string | null) => (s ? chuanSdt(s).sdt ?? s.replace(/\D/g, '') : '') || null
const normLink = (l?: string | null) => (l ? l.trim().toLowerCase() : null)

/**
 * So sánh định danh 2 bản ghi cùng Họ tên khi không có Mã HS:
 * - 'khac': có 2 SĐT khác nhau, hoặc chưa trùng SĐT mà có 2 Link nhóm Zalo khác nhau -> chắc chắn 2 học sinh khác nhau.
 * - 'cung': trùng SĐT (vẫn cho phép cập nhật Link Zalo mới) hoặc trùng Link nhóm Zalo (và không mâu thuẫn SĐT) -> cùng 1 học sinh.
 * - 'mo_ho': thiếu SĐT/Link Zalo để khẳng định cùng hay khác -> báo lỗi, không tự gộp nhầm im lặng.
 */
function soSanhDinhDanh(
  sdt1: string | null, link1: string | null,
  sdt2: string | null, link2: string | null,
): 'cung' | 'khac' | 'mo_ho' {
  if (sdt1 && sdt2 && sdt1 !== sdt2) return 'khac'
  if (sdt1 && sdt2 && sdt1 === sdt2) return 'cung'
  const l1 = normLink(link1), l2 = normLink(link2)
  if (l1 && l2) return l1 === l2 ? 'cung' : 'khac'
  return 'mo_ho'
}

export function kiemTra(
  lopTho: DongLopTho[], hsTho: DongHsTho[], lopCo: Lop[], hsCo: HocSinh[], gdCo: GhiDanh[], homNay: string,
): { lops: KqLop[]; hss: KqHs[] } {
  const tenLopCo = new Map(lopCo.map((l) => [khoa(l.ten), l]))
  const idToTenKhoa = new Map(lopCo.map((l) => [l.id, khoa(l.ten)]))
  const daGap = new Set<string>()

  const lops: KqLop[] = lopTho.map((r) => {
    const ten = chu(r.ten)
    // Đơn giá lớp là tuỳ chọn (bỏ trống lưu 0, đồng bộ với form Thêm/Sửa lớp; học phí chính tính theo từng học sinh)
    const gia = chuanTien(r.donGia, 'Đơn giá/buổi', false)
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
    const maRaw = chu(r.maHs)
    const hoTen = chu(r.hoTen), tenLop = chu(r.lop), kLop = khoa(tenLop), tenK = khoa(hoTen)
    const sdt = chuanSdt(r.sdt), ngay = chuanNgay(r.ngayVao, homNay), link = chuanLinkZalo(r.linkZalo)
    const gia = chuanTien(r.donGia ?? r.donGiaRieng, 'Đơn giá/buổi', false)
    const st = chuanTien(r.sticker, 'Sticker đã có', false)
    const giaLopMacDinh = tenLop ? giaLop.get(kLop) : undefined
    const donGiaHsMoi = gia.so ?? (giaLopMacDinh && giaLopMacDinh > 0 ? giaLopMacDinh : 0)
    const kq: KqHs = {
      loai: 'hs', so: r.so, trangThai: 'moi', ma_hs: maRaw ? maRaw.toUpperCase() : null,
      ho_ten: hoTen, tenLop, ten_phu_huynh: chu(r.tenPh) || null,
      sdt_phu_huynh: sdt.sdt, ngay_vao: ngay.ngay ?? homNay, don_gia: donGiaHsMoi,
      sticker_dau_ky: st.so ?? 0, ghi_chu: chu(r.ghiChu) || null, link_zalo: link.link,
    }
    const loi = (!hoTen && 'Thiếu họ tên')
      || (tenLop && !giaLop.has(kLop) && `Lớp "${tenLop}" chưa có (hoặc dòng lớp đó đang lỗi)`)
      || sdt.loi || ngay.loi || gia.loi || st.loi || link.loi
    if (loi) return { ...kq, trangThai: 'loi', loi }

    // Tầng 1: đối chiếu tường minh theo Mã HS (nếu người dùng có điền / dùng file mẫu tải về)
    let co: HocSinh | undefined
    if (maRaw) {
      co = maCo.get(khoa(maRaw))
      if (!co) {
        return { ...kq, trangThai: 'loi', loi: `Không tìm thấy Mã HS "${maRaw}" (để trống nếu là học sinh mới)` }
      }
      if (khoa(co.ho_ten) !== tenK) {
        return { ...kq, trangThai: 'loi', loi: `Mã HS "${kq.ma_hs}" là của "${co.ho_ten}", không khớp với "${hoTen}"` }
      }
    } else {
      // Tầng 2: không có Mã HS -> đối chiếu theo Họ tên + (SĐT phụ huynh hoặc Link nhóm Zalo)
      const ungVienDb = tenToHsCo.get(tenK) ?? []
      if (ungVienDb.length > 0) {
        const khopCung: HocSinh[] = []
        const moHo: HocSinh[] = []
        for (const h of ungVienDb) {
          const kqSs = soSanhDinhDanh(sdt.sdt, link.link, sdtDb(h.sdt_phu_huynh), h.link_zalo)
          if (kqSs === 'cung') khopCung.push(h)
          else if (kqSs === 'mo_ho') moHo.push(h)
        }
        if (khopCung.length === 1) {
          co = khopCung[0]
        } else if (khopCung.length > 1) {
          return {
            ...kq, trangThai: 'loi',
            loi: `Có ${khopCung.length} học sinh tên "${hoTen}" khớp SĐT/Link Zalo (${khopCung.map((h) => h.ma_hs).join(', ')}). Ghi rõ Mã HS để xác định đúng em`,
          }
        } else if (moHo.length > 0) {
          return {
            ...kq, trangThai: 'loi',
            loi: `Đã có em "${hoTen}" (${moHo.map((h) => h.ma_hs).join(', ')}) trong trung tâm. Ghi Mã HS nếu học thêm lớp, hoặc nhập SĐT phụ huynh / Link nhóm Zalo để phân biệt`,
          }
        }
      }
    }

    if (co) {
      const capNhat = link.link && link.link !== co.link_zalo ? { capNhatLink: co.id } : {}
      // Không ghi cột Lớp -> không xếp thêm lớp, chỉ giữ trạng thái da_co (và cập nhật Link Zalo nếu mới)
      if (!tenLop || lopDangHocCo.get(co.id)?.has(kLop)) {
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
    if (dsCungTen.length > 0) {
      const khopFile: NhomMoiTheoTen[] = []
      const moHoFile: NhomMoiTheoTen[] = []
      for (const x of dsCungTen) {
        const kqSs = soSanhDinhDanh(sdt.sdt, link.link, x.sdt, x.link)
        if (kqSs === 'cung') khopFile.push(x)
        else if (kqSs === 'mo_ho') moHoFile.push(x)
      }
      if (khopFile.length === 1) {
        truoc = khopFile[0]
      } else if (khopFile.length > 1 || moHoFile.length > 0) {
        const dongTrung = (khopFile[0] ?? moHoFile[0]).so
        return {
          ...kq, trangThai: 'loi',
          loi: `Trùng tên "${hoTen}" với dòng ${dongTrung} nhưng thiếu SĐT phụ huynh hoặc Link nhóm Zalo: nhập cùng SĐT/Link Zalo nếu là 1 em học nhiều lớp, hoặc nhập khác nhau nếu là 2 em khác nhau`,
        }
      }
    }

    if (truoc) {
      if (!tenLop || truoc.lops.has(kLop)) return { ...kq, don_gia: truoc.donGia, trangThai: 'da_co', loi: 'Trùng với dòng trên trong file' }
      if (gia.so !== null && gia.so !== truoc.donGia) {
        return {
          ...kq, don_gia: truoc.donGia, trangThai: 'loi',
          loi: `Học sinh "${hoTen}" đã cố định học phí ${truoc.donGia.toLocaleString('vi-VN')} đ/buổi ở dòng ${truoc.so} (đang ghi ${gia.so.toLocaleString('vi-VN')} đ) — để trống hoặc nhập đúng mức cố định`,
        }
      }
      if (!truoc.sdt && sdt.sdt) truoc.sdt = sdt.sdt
      if (!truoc.link && link.link) truoc.link = link.link
      truoc.lops.add(kLop)
      const capNhatLinkMoi = !truoc.coLink && !!link.link
      if (capNhatLinkMoi) truoc.coLink = true
      return {
        ...kq, trangThai: 'them_lop', gopVoiDong: truoc.so, don_gia: truoc.donGia,
        link_zalo: capNhatLinkMoi ? link.link : null,
        loi: `Gộp chung học sinh với dòng ${truoc.so}`,
      }
    }

    if (gia.so === null) {
      if (!tenLop) {
        return { ...kq, trangThai: 'loi', loi: 'Chưa chọn lớp nên cần nhập Đơn giá/buổi (nhập 0 nếu miễn phí)' }
      }
      if (!(giaLopMacDinh && giaLopMacDinh > 0)) {
        return { ...kq, trangThai: 'loi', loi: `Lớp "${tenLop}" chưa đặt đơn giá mặc định nên cần nhập Đơn giá/buổi cho học sinh (nhập 0 nếu miễn phí)` }
      }
    }

    dsCungTen.push({ so: r.so, sdt: sdt.sdt, link: link.link, donGia: donGiaHsMoi, lops: tenLop ? new Set([kLop]) : new Set(), coLink: !!link.link })
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

export async function taoBufferFileMau(lops: Lop[], hss: HocSinh[], gds: GhiDanh[]): Promise<ArrayBuffer> {
  const { default: Excel } = await import('exceljs')
  const wb = new Excel.Workbook()

  const hd = wb.addWorksheet('Hướng dẫn')
  hd.getColumn(1).width = 110
  ;[
    'CÁCH DÙNG FILE MẪU',
    '1. Trang "Lớp": mỗi dòng một lớp. Các lớp đang có đã điền sẵn, import sẽ bỏ qua chúng. Cột Đơn giá/buổi là tuỳ chọn (để trống nếu học phí tính theo từng học sinh). Cột thứ có học ghi giờ bắt đầu-kết thúc, ví dụ 17:30-19:00; thứ không học để trống.',
    '2. Trang "Học sinh": mỗi dòng là 1 học sinh (hoặc 1 lượt xếp lớp). Cột Lớp không bắt buộc: chọn trong ô thả xuống để xếp luôn vào lớp, hoặc để trống để nhập vào danh sách "Chưa xếp lớp" (khi để trống Lớp cần ghi Đơn giá/buổi).',
    '3. Cột có dấu * là bắt buộc. Dòng bắt đầu bằng "Ví dụ" sẽ được bỏ qua.',
    '4. Mã HS (không bắt buộc): học sinh mới cứ để trống (hệ thống tự cấp HS001...). Học sinh đã có được điền sẵn Mã HS để phân biệt tuyệt đối khi trùng tên và xếp thêm lớp.',
    '5. Phân biệt & gộp học sinh học nhiều lớp (khi không ghi Mã HS): app dựa vào Họ tên + SĐT phụ huynh HOẶC Link nhóm Zalo. Cùng tên + cùng SĐT/Link Zalo sẽ tự gộp thành 1 em; khác SĐT hoặc khác Link Zalo sẽ tách thành 2 em. Nếu trùng tên nhưng thiếu cả SĐT lẫn Link Zalo, app sẽ báo lỗi để tránh gộp nhầm.',
    '6. Ngày vào học: dạng ngày/tháng/năm, để trống thì lấy ngày import.',
    '7. Đơn giá/buổi: mức học phí cố định duy nhất áp cho TẤT CẢ các lớp của học sinh (nhập 0 = học miễn phí; để trống = lấy theo đơn giá mặc định của lớp đầu tiên nếu lớp đó có đặt > 0).',
    '8. Dòng đã có trong đúng lớp đó được bỏ qua (trừ cột Link nhóm Zalo: có link mới thì cập nhật). Dòng lỗi không được nhập; sửa rồi import lại vẫn an toàn.',
    '9. CHÚ Ý: không sửa Mã HS, Họ tên, Lớp của các dòng điền sẵn để tránh nhận nhầm. Muốn sửa thông tin cá nhân thì sửa trực tiếp trong app.',
  ].forEach((t, i) => { const r = hd.addRow([t]); if (i === 0) r.font = { bold: true, size: 14 } })

  const wsLop = wb.addWorksheet(TRANG_LOP)
  tieuDe(wsLop, [{ ten: 'Tên lớp', rong: 22, batBuoc: true }, { ten: 'Đơn giá/buổi', rong: 14 },
    ...COT_THU.map((t) => ({ ten: THU[t], rong: 12 }))])
  wsLop.addRow(['Ví dụ: Movers 2', 120000, '', '17:30-19:00', '', '17:30-19:00', '', '08:00-09:30', '']).font = { italic: true, color: { argb: 'FF8C8C8C' } }
  for (const l of lops) wsLop.addRow([l.ten, l.don_gia > 0 ? l.don_gia : '', ...COT_THU.map((t) => (l.lich.includes(t) ? (l.gio_thu[t] ? `${l.gio_thu[t].bd}-${l.gio_thu[t].kt}` : 'chưa có giờ') : ''))])
  wsLop.getColumn(2).numFmt = '#,##0'

  const wsHs = wb.addWorksheet(TRANG_HS)
  tieuDe(wsHs, [
    { ten: 'Mã HS', rong: 10 }, { ten: 'Họ tên', rong: 24, batBuoc: true }, { ten: 'Lớp', rong: 18 },
    { ten: 'Tên phụ huynh', rong: 18 }, { ten: 'SĐT phụ huynh', rong: 15 }, { ten: 'Ngày vào học', rong: 13 },
    { ten: 'Đơn giá/buổi', rong: 13 }, { ten: 'Sticker đã có', rong: 12 }, { ten: 'Ghi chú', rong: 28 }, { ten: 'Link nhóm Zalo', rong: 34 },
  ])
  wsHs.addRow(['', 'Ví dụ: Nguyễn Gia Bảo', lops[0]?.ten ?? 'Movers 2', 'Chị Hằng', '0987220413', new Date(), 150000, 12, 'Học nhiều lớp ghi cùng Mã HS hoặc cùng SĐT / Link Zalo', 'https://zalo.me/g/abcxyz123'])
    .font = { italic: true, color: { argb: 'FF8C8C8C' } }
  const tenLop = new Map(lops.map((l) => [l.id, l.ten]))
  const hsMap = new Map(hss.map((h) => [h.id, h]))
  const hsCoGhiDanh = new Set(gds.map((g) => g.hoc_sinh_id))
  const dongMau = gds
    .filter((g) => g.trang_thai === 'dang_hoc' && tenLop.has(g.lop_id) && hsMap.has(g.hoc_sinh_id))
    .map((g) => ({ ngayVao: g.ngay_vao, h: hsMap.get(g.hoc_sinh_id)!, lopTen: tenLop.get(g.lop_id)! }))
    .sort((a, b) => a.lopTen.localeCompare(b.lopTen) || a.h.ho_ten.localeCompare(b.h.ho_ten))
  // Xuất kèm học sinh chưa xếp lớp nào để cô dễ chọn lớp hoặc dán Link Zalo hàng loạt rồi import lại
  const dongChuaXep = hss
    .filter((h) => !hsCoGhiDanh.has(h.id))
    .sort((a, b) => a.ho_ten.localeCompare(b.ho_ten))
    .map((h) => ({ ngayVao: h.ngay_vao, h, lopTen: '' }))
  for (const { ngayVao, h, lopTen } of [...dongMau, ...dongChuaXep]) {
    wsHs.addRow([h.ma_hs, h.ho_ten, lopTen, h.ten_phu_huynh ?? '', h.sdt_phu_huynh ?? '', new Date(ngayVao),
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
