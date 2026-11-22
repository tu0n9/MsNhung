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

export interface LopDaGui<L extends { id: string; ten: string; hoat_dong?: boolean }, H extends { id: string; ho_ten: string }> {
  l: L; tong: number; chua: H[]
}

/**
 * Thống kê tỷ lệ gửi phiếu đánh giá theo học sinh đang học ở các lớp đang xét:
 * mỗi em chỉ gửi 1 phiếu/tháng (kể cả học nhiều lớp), nên khi lọc một lớp cụ thể hoặc xem tất cả lớp,
 * `soEmDaGui` đếm đúng số em duy nhất thuộc tập `tongEm` đã gửi phiếu, khớp nhất quán với bảng từng lớp.
 */
export function thongKeDaGui<
  L extends { id: string; ten: string; hoat_dong?: boolean },
  H extends { id: string; ho_ten: string },
>(
  phieus: Pick<PhieuDanhGia, 'hoc_sinh_id'>[],
  lops: L[],
  hss: H[],
  gds: { lop_id: string; hoc_sinh_id: string; trang_thai?: 'dang_hoc' | 'ngung' }[],
  lopId?: string,
): { nhomLop: LopDaGui<L, H>[]; tongEm: number; soEmDaGui: number } {
  const daGui = new Set(phieus.map((p) => p.hoc_sinh_id).filter((id): id is string => !!id))
  const hsMap = new Map(hss.map((h) => [h.id, h]))
  const gdHoatDong = gds.filter((g) => g.trang_thai !== 'ngung')
  const lopXet = lops.filter((l) => l.hoat_dong !== false && (!lopId || l.id === lopId))

  const emIds = new Set<string>()
  const nhomLop: LopDaGui<L, H>[] = []
  for (const l of lopXet) {
    const dsTheoLop = new Map<string, H>()
    for (const g of gdHoatDong) {
      if (g.lop_id !== l.id) continue
      const h = hsMap.get(g.hoc_sinh_id)
      if (!h) continue
      dsTheoLop.set(h.id, h)
      emIds.add(h.id)
    }
    if (!dsTheoLop.size) continue
    const ds = [...dsTheoLop.values()].sort((a, b) => a.ho_ten.localeCompare(b.ho_ten))
    nhomLop.push({ l, tong: ds.length, chua: ds.filter((h) => !daGui.has(h.id)) })
  }
  nhomLop.sort((a, b) => b.chua.length - a.chua.length || a.l.ten.localeCompare(b.l.ten))

  let soEmDaGui = 0
  for (const id of emIds) if (daGui.has(id)) soEmDaGui++
  return { nhomLop, tongEm: emIds.size, soEmDaGui }
}
