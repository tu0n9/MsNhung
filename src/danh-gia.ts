// Phiếu đánh giá từ học sinh: tổng hợp kết quả cho trang Đánh giá và trang Excel (docs/YEU-CAU.md).
import { congThang, type Thang } from './hoc-phi'

export const TIEU_CHI = [
  { key: 'kien_thuc', ten: 'Kiến thức', cauHoi: 'Kiến thức chuyên môn của trợ giảng' },
  { key: 'tuong_tac', ten: 'Tương tác', cauHoi: 'Kĩ năng tương tác, điều phối lớp và xử lý tình huống phát sinh' },
  { key: 'ho_tro', ten: 'Hỗ trợ', cauHoi: 'Hỗ trợ ngoài giờ học' },
] as const
export type TieuChi = (typeof TIEU_CHI)[number]['key']

export const CAU_VIET = {
  khoa_hoc: 'Nhận xét chung về khoá học. Em mong muốn trung tâm cải thiện thêm điều gì về khoá học và chương trình giảng dạy?',
  kho_khan: 'Em có gặp khó khăn trong quá trình học không? Nếu có, những khó khăn đó là gì?',
  nhan_xet: 'Em có nhận xét riêng gì muốn gửi tới trợ giảng không?',
  chua_bai: 'Trợ giảng có chữa bài tập về nhà cho em không? Em có góp ý gì thêm về phần chữa bài tập?',
} as const

export interface DiemTroGiang extends Record<TieuChi, number> { id: string; ten: string; nhan_xet: string | null; chua_bai: string | null }
export interface PhieuDanhGia {
  id: string; thang: string; lop_id: string | null; ten_lop: string; hoc_sinh_id: string | null; ten_hoc_sinh: string
  khoa_hoc: string | null; kho_khan: string | null; tro_giang: DiemTroGiang[]; gui_luc: string
}

/** Mã trong link: 12 ký tự hex ngẫu nhiên, đủ để không ai đoán ra link của tháng khác. */
export const taoMa = () => crypto.randomUUID().replaceAll('-', '').slice(0, 12)
export const urlPhieu = (ma: string) => `${location.origin}/#/danh-gia/${ma}`
/** Ngày cuối nhận phiếu: hết ngày 5 tháng sau, 'YYYY-MM-DD'. */
export const hanNhan = (thang: Thang) => `${congThang(thang, 1)}-05`

const tb = (xs: number[]) => (xs.length ? Math.round((xs.reduce((s, x) => s + x, 0) / xs.length) * 10) / 10 : 0)

export interface DongTroGiang extends Record<TieuChi, number> { id: string; ten: string; soPhieu: number; chung: number }
export interface Y { noiDung: string; hocSinh: string; lop: string; troGiang?: string }

export function tongHop(phieus: PhieuDanhGia[], lopId?: string) {
  const ds = lopId ? phieus.filter((p) => p.lop_id === lopId) : phieus
  const theoTg = new Map<string, DiemTroGiang[]>()
  for (const p of ds) for (const t of p.tro_giang) theoTg.set(t.id, [...(theoTg.get(t.id) ?? []), t])
  const troGiang: DongTroGiang[] = [...theoTg.values()].map((xs) => {
    const diem = Object.fromEntries(TIEU_CHI.map((c) => [c.key, tb(xs.map((x) => x[c.key]))])) as Record<TieuChi, number>
    // điểm chung là trung bình mọi câu chấm, không phải trung bình của 3 số đã làm tròn
    return { id: xs[0].id, ten: xs[xs.length - 1].ten, soPhieu: xs.length, ...diem, chung: tb(xs.flatMap((x) => TIEU_CHI.map((c) => x[c.key]))) }
  }).sort((a, b) => a.ten.localeCompare(b.ten, 'vi'))

  const y = (k: 'khoa_hoc' | 'kho_khan'): Y[] =>
    ds.filter((p) => p[k]).map((p) => ({ noiDung: p[k]!, hocSinh: p.ten_hoc_sinh, lop: p.ten_lop }))
  const yTg = (k: 'nhan_xet' | 'chua_bai'): Y[] =>
    ds.flatMap((p) => p.tro_giang.filter((t) => t[k]).map((t) => ({ noiDung: t[k]!, hocSinh: p.ten_hoc_sinh, lop: p.ten_lop, troGiang: t.ten })))

  const theoLop = new Map<string, number>()
  for (const p of ds) theoLop.set(p.ten_lop, (theoLop.get(p.ten_lop) ?? 0) + 1)

  return {
    soPhieu: ds.length, theoLop: [...theoLop].sort(([a], [b]) => a.localeCompare(b, 'vi')), troGiang,
    nhanXet: { khoa_hoc: y('khoa_hoc'), kho_khan: y('kho_khan'), nhan_xet: yTg('nhan_xet'), chua_bai: yTg('chua_bai') },
  }
}
