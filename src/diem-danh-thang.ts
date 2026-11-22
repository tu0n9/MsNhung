// Lưới lịch "Điểm danh tháng" ở màn chi tiết học sinh: ô nào màu gì. Thuần, có test (diem-danh-thang.test.ts).
// Quy tắc ở docs/YEU-CAU.md mục "Lưới lịch điểm danh tháng".

export type TrangThaiO = 'vang' | 'chua_diem_danh' | 'hoc_bu' | 'co_mat' | 'lop_nghi' | 'sap_toi' | 'trong'

export interface BuoiLich { id: string; lop_id: string; ngay: string; loai: 'lich' | 'phu' | 'bu'; lop_nghi: boolean }
export interface DiemDanhEm { trang_thai: 'co_mat' | 'vang' | 'hoc_bu'; sticker: number; buoi_hoc: BuoiLich }

export interface BuoiTrongNgay { buoi: BuoiLich; trang_thai: Exclude<TrangThaiO, 'trong'>; sticker: number }
export interface ONgay { ngay: string; trang_thai: TrangThaiO; hom_nay: boolean; buoi: BuoiTrongNgay[] }

// một ô chỉ tô được một màu: cái cần giáo viên để ý (vắng, quên điểm danh) đứng trước
const UU_TIEN: TrangThaiO[] = ['vang', 'chua_diem_danh', 'hoc_bu', 'co_mat', 'lop_nghi', 'sap_toi']

/**
 * Các ô của tháng `thang` ('YYYY-MM'), có `null` đệm đầu để ngày 1 rơi đúng cột (T2 là cột đầu).
 * `buoiLop`: buổi của lớp hiện tại; `dd`: điểm danh của em ở mọi lớp (học bù lớp khác cũng nằm ở đây).
 */
export function luoiThang(thang: string, buoiLop: BuoiLich[], dd: DiemDanhEm[], ngayVao: string, dangHoc: boolean, homNay: string): (ONgay | null)[] {
  const theoBuoi = new Map(dd.map((x) => [x.buoi_hoc.id, x]))
  const theoNgay = new Map<string, BuoiTrongNgay[]>()
  const them = (x: BuoiTrongNgay) => theoNgay.set(x.buoi.ngay, [...(theoNgay.get(x.buoi.ngay) ?? []), x])

  for (const x of dd) if (x.buoi_hoc.ngay.startsWith(thang)) them({ buoi: x.buoi_hoc, trang_thai: x.trang_thai, sticker: x.sticker })
  for (const b of buoiLop) {
    // buổi bù riêng chỉ dành cho em được gọi đến, em không đến thì không có dòng điểm danh nào
    if (!b.ngay.startsWith(thang) || theoBuoi.has(b.id) || b.ngay < ngayVao || b.loai === 'bu') continue
    if (b.lop_nghi) them({ buoi: b, trang_thai: 'lop_nghi', sticker: 0 })
    else if (b.ngay >= homNay) them({ buoi: b, trang_thai: 'sap_toi', sticker: 0 })
    // em ngừng học thì không ai điểm danh cho em nữa, báo "chưa điểm danh" chỉ gây nhiễu
    else if (dangHoc) them({ buoi: b, trang_thai: 'chua_diem_danh', sticker: 0 })
  }

  const [y, m] = thang.split('-').map(Number)
  const soNgay = new Date(Date.UTC(y, m, 0)).getUTCDate()
  const dem = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7
  const o: (ONgay | null)[] = Array(dem).fill(null)
  for (let d = 1; d <= soNgay; d++) {
    const ngay = `${thang}-${String(d).padStart(2, '0')}`
    const buoi = (theoNgay.get(ngay) ?? []).sort((a, b) => UU_TIEN.indexOf(a.trang_thai) - UU_TIEN.indexOf(b.trang_thai))
    o.push({ ngay, trang_thai: buoi[0]?.trang_thai ?? 'trong', hom_nay: ngay === homNay, buoi })
  }
  return o
}

export interface GhiDanhBuoi { hoc_sinh_id: string; lop_id: string; ngay_vao: string; trang_thai: 'dang_hoc' | 'ngung' }

/**
 * Phân loại học sinh trong một buổi điểm danh:
 * - `ds`: gồm học sinh đang học lớp này (`ngay_vao <= ngayBuoi`) và mọi em đã có điểm danh trong buổi (kể cả đã ngừng học hoặc học bù).
 * - `cuaLopTatCaIds`: tập mọi học sinh từng ghi danh vào lớp tới ngày `ngayBuoi` (cả `dang_hoc` lẫn `ngung`), dùng để xác định `laBu` chính xác.
 */
export function dsHocSinhBuoi<T extends { id: string }>(
  tatCaHs: T[],
  ghiDanh: GhiDanhBuoi[],
  lopId: string,
  ngayBuoi: string,
  ddMap: Record<string, unknown>,
): { ds: T[]; cuaLopTatCaIds: Set<string> } {
  const cuaLopTatCaIds = new Set(
    ghiDanh.filter((g) => g.lop_id === lopId && g.ngay_vao <= ngayBuoi).map((g) => g.hoc_sinh_id),
  )
  const cuaLopDangHocIds = new Set(
    ghiDanh.filter((g) => g.lop_id === lopId && g.trang_thai === 'dang_hoc' && g.ngay_vao <= ngayBuoi).map((g) => g.hoc_sinh_id),
  )
  const cuaLop = tatCaHs.filter((h) => cuaLopDangHocIds.has(h.id))
  const daChamNgoai = tatCaHs.filter((h) => ddMap[h.id] != null && !cuaLopDangHocIds.has(h.id))
  return { ds: [...cuaLop, ...daChamNgoai], cuaLopTatCaIds }
}
