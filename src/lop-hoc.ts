// Logic thuần cho màn hình Lớp học (gợi ý học sinh khi thêm vào lớp, hiển thị giá riêng nhiều lớp, đồng bộ trạng thái & ngày vào).
// Không import runtime từ ./supabase để chạy unit test độc lập không cần biến môi trường.
import type { GhiDanh, HocSinh, Lop } from './supabase'

export const GIOI_HAN_GOI_Y_HS = 12

/** Bỏ dấu tiếng Việt và viết thường để tìm kiếm không phân biệt dấu / hoa thường. */
export const khongDau = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase()

/** Giữ lại các chữ số của SĐT để khớp cả khi người dùng gõ dấu cách, dấu chấm hoặc dấu gạch. */
export const chuanSdtTim = (s: string) => s.replace(/\D/g, '')

/** Lọc toàn bộ danh sách học sinh theo họ tên, mã HS hoặc SĐT phụ huynh (không cắt số lượng). */
export function locHocSinh<T extends Pick<HocSinh, 'ho_ten' | 'ma_hs' | 'sdt_phu_huynh'>>(
  ds: T[],
  tuKhoa: string,
): T[] {
  const qTen = khongDau(tuKhoa.trim())
  const qSdt = chuanSdtTim(tuKhoa)
  // Chỉ so SĐT khi từ khoá không chứa chữ cái để gõ mã HS (vd "HS001") không dính nhầm sang SĐT có "001"
  const timTheoSdt = qSdt.length > 0 && !/[a-z]/.test(qTen)
  if (!qTen && !timTheoSdt) return ds
  return ds.filter((x) =>
    (qTen.length > 0 && (khongDau(x.ho_ten).includes(qTen) || khongDau(x.ma_hs).includes(qTen)))
    || (timTheoSdt && chuanSdtTim(x.sdt_phu_huynh ?? '').includes(qSdt)),
  )
}

/**
 * Lọc gợi ý học sinh cho ô AutoComplete theo họ tên, mã HS hoặc SĐT phụ huynh (đã chuẩn hoá).
 * Trả về danh sách đã cắt tối đa `gioiHan` kèm `tong` và `biCat` để UI báo rõ cho người dùng.
 */
export function locGoiYHocSinh<T extends Pick<HocSinh, 'ho_ten' | 'ma_hs' | 'sdt_phu_huynh'>>(
  ds: T[],
  tuKhoa: string,
  gioiHan = GIOI_HAN_GOI_Y_HS,
): { ketQua: T[]; tong: number; biCat: boolean } {
  const khop = locHocSinh(ds, tuKhoa)
  const ketQua = khop.slice(0, gioiHan)
  return { ketQua, tong: khop.length, biCat: khop.length > ketQua.length }
}

export type PhanLoaiHs = 'dang_hoc' | 'chua_xep' | 'ngung'

/** Phân loại học sinh theo các ghi_danh hiện có: đang học (>=1 lớp dang_hoc), chưa xếp lớp (0 ghi_danh), hoặc đã ngừng. */
export function phanLoaiHocSinh(
  hsId: string,
  gds: Pick<GhiDanh, 'hoc_sinh_id' | 'trang_thai'>[],
): PhanLoaiHs {
  const ds = gds.filter((g) => g.hoc_sinh_id === hsId)
  if (!ds.length) return 'chua_xep'
  return ds.some((g) => g.trang_thai === 'dang_hoc') ? 'dang_hoc' : 'ngung'
}

/** Đồng bộ cột hoc_sinh.trang_thai từ các ghi_danh còn lại (0 lớp / chưa xếp lớp giữ 'dang_hoc', chỉ còn lớp ngừng -> 'ngung'). */
export function trangThaiHsSauGhiDanh(
  gdsConLai: Pick<GhiDanh, 'trang_thai'>[],
): 'dang_hoc' | 'ngung' {
  if (!gdsConLai.length) return 'dang_hoc'
  return gdsConLai.some((g) => g.trang_thai === 'dang_hoc') ? 'dang_hoc' : 'ngung'
}

/** Trạng thái hoc_sinh.trang_thai sau khi sửa danh sách lớp trong form (cho phép bỏ hết lớp để về 'Chưa xếp lớp'). */
export function trangThaiHsSauSua(
  cuGds: Pick<GhiDanh, 'lop_id' | 'trang_thai'>[],
  lopIdsMoi: string[],
): 'dang_hoc' | 'ngung' {
  if (!lopIdsMoi.length) return 'dang_hoc'
  return conHocSauSua(cuGds, lopIdsMoi) ? 'dang_hoc' : 'ngung'
}

/** Danh sách học sinh có thể chọn thêm vào `lopId` (bỏ qua em đang học lớp đó; đánh dấu em chưa xếp lớp hoặc từng học lớp này kèm giá riêng cũ nếu có). */
export function dsHocSinhCoTheThemVaoLop<T extends Pick<HocSinh, 'id' | 'ho_ten'>>(
  hs: T[],
  gds: Pick<GhiDanh, 'hoc_sinh_id' | 'lop_id' | 'trang_thai' | 'don_gia_rieng'>[],
  lopId: string,
): { h: T; chuaXep: boolean; tungHoc: boolean; donGiaRiengCu: number | null }[] {
  const theoHs = new Map<string, Pick<GhiDanh, 'hoc_sinh_id' | 'lop_id' | 'trang_thai' | 'don_gia_rieng'>[]>()
  for (const g of gds) {
    const arr = theoHs.get(g.hoc_sinh_id)
    if (arr) arr.push(g)
    else theoHs.set(g.hoc_sinh_id, [g])
  }
  return hs
    .filter((h) => !(theoHs.get(h.id) ?? []).some((g) => g.lop_id === lopId && g.trang_thai === 'dang_hoc'))
    .map((h) => {
      const ds = theoHs.get(h.id) ?? []
      const gdCuLop = ds.find((g) => g.lop_id === lopId && g.trang_thai === 'ngung')
      return {
        h,
        chuaXep: ds.length === 0,
        tungHoc: !!gdCuLop,
        donGiaRiengCu: gdCuLop?.don_gia_rieng ?? null,
      }
    })
    .sort((a, b) => a.h.ho_ten.localeCompare(b.h.ho_ten))
}

/**
 * Chỉ hiện ô "Giá riêng lớp" khi học sinh học từ 2 lớp duy nhất trở lên (tính cả lớp đã học sẵn của `emDaChon`
 * cộng lớp đang chọn trên form) hoặc khi đã có ít nhất một giá riêng được nhập.
 */
export function coCanHienGiaRieng(
  lopIdsChon: string[],
  lopIdsCu: string[] = [],
  giaMap: Record<string, unknown> = {},
): boolean {
  const coGiaRieng = lopIdsChon.some((id) => typeof giaMap[id] === 'number' && !Number.isNaN(giaMap[id] as number))
  if (coGiaRieng) return true
  return new Set([...lopIdsCu, ...lopIdsChon]).size >= 2
}

/**
 * Học sinh có còn đang học ít nhất một lớp sau khi sửa danh sách lớp không:
 * còn nếu vừa tick thêm lớp mới (mặc định đang học) hoặc vẫn giữ lại ít nhất một ghi_danh đang học.
 */
export function conHocSauSua(
  cuGds: Pick<GhiDanh, 'lop_id' | 'trang_thai'>[],
  lopIdsMoi: string[],
): boolean {
  const cuIds = new Set(cuGds.map((g) => g.lop_id))
  if (lopIdsMoi.some((id) => !cuIds.has(id))) return true
  return cuGds.some((g) => lopIdsMoi.includes(g.lop_id) && g.trang_thai === 'dang_hoc')
}

/**
 * Các ghi_danh giữ lại cần đồng bộ ngay_vao khi cô chủ động sửa "Ngày vào học" của hồ sơ:
 * đồng bộ nếu chỉ giữ 1 lớp, hoặc ghi_danh trước đó khớp ngày vào cũ của học sinh, hoặc sớm hơn ngày vào mới.
 */
export function ghiDanhCanDongBoNgay<T extends Pick<GhiDanh, 'id' | 'lop_id' | 'ngay_vao'>>(
  cuGds: T[],
  lopIdsMoi: string[],
  ngayVaoCu: string | undefined,
  ngayVaoMoi: string,
): T[] {
  if (!ngayVaoCu || ngayVaoMoi === ngayVaoCu) return []
  const giu = cuGds.filter((g) => lopIdsMoi.includes(g.lop_id))
  return giu.filter((g) => (giu.length === 1 || g.ngay_vao === ngayVaoCu || g.ngay_vao < ngayVaoMoi) && g.ngay_vao !== ngayVaoMoi)
}

/** Lọc học sinh trong một lớp; nếu từ khoá khớp tên lớp thì hiện đầy đủ học sinh của lớp đó. */
export function locHsTrongLop<
  TLop extends Pick<Lop, 'id' | 'ten'>,
  THs extends Pick<HocSinh, 'id' | 'ho_ten' | 'ma_hs'>,
  TGd extends Pick<GhiDanh, 'hoc_sinh_id' | 'lop_id' | 'trang_thai'>,
>(
  lop: TLop,
  gds: TGd[],
  hsMap: Map<string, THs>,
  tuKhoa: string,
  hienNgung: boolean,
): { gd: TGd; h: THs }[] {
  const timKhong = khongDau(tuKhoa.trim())
  const khopTenLop = timKhong.length > 0 && khongDau(lop.ten).includes(timKhong)
  return gds
    .filter((g) => g.lop_id === lop.id && (hienNgung || g.trang_thai === 'dang_hoc'))
    .map((g) => ({ gd: g, h: hsMap.get(g.hoc_sinh_id)! }))
    .filter((x) => x.h && (!timKhong || khopTenLop || khongDau(x.h.ho_ten).includes(timKhong) || khongDau(x.h.ma_hs).includes(timKhong)))
    .sort((a, b) => a.h.ho_ten.localeCompare(b.h.ho_ten))
}

export interface ThongTinTrangThaiChiTiet {
  nhanTag: string | null
  mauTag?: string
  chanThuTien: boolean
  lyDoChanThuTien?: string
}

/** Nhãn trạng thái và lý do khoá nút Thu tiền trên trang chi tiết (phân biệt Chưa xếp lớp với Ngừng học). */
export function thongTinTrangThaiChiTiet(loai: PhanLoaiHs, coGoiNo: boolean): ThongTinTrangThaiChiTiet {
  if (loai === 'dang_hoc') return { nhanTag: null, chanThuTien: false }
  if (loai === 'chua_xep') {
    return {
      nhanTag: 'Chưa xếp lớp',
      mauTag: 'orange',
      chanThuTien: !coGoiNo,
      lyDoChanThuTien: coGoiNo ? undefined : 'Học sinh chưa xếp lớp và không còn gói nợ',
    }
  }
  return {
    nhanTag: 'Ngừng học',
    chanThuTien: !coGoiNo,
    lyDoChanThuTien: coGoiNo ? undefined : 'Học sinh đã ngừng học và không còn gói nợ',
  }
}

/** Chặn gộp lớp vào học sinh sẵn có khi người dùng chưa chọn lớp nào. */
export function kiemTraGopLopVaoEm(emDaChon: boolean, lopIds: string[]): string | null {
  if (emDaChon && lopIds.length === 0) {
    return 'Chọn ít nhất một lớp để gộp vào học sinh sẵn có, hoặc bấm "Bỏ chọn" để tạo mới'
  }
  return null
}

export interface ThaoTacThemHsVaoLop {
  themGhiDanh: (hsIds: string[]) => Promise<void>
  batLaiGhiDanh: (hsId: string, payload: { trang_thai: 'dang_hoc'; ngay_vao: string; don_gia_rieng: null }) => Promise<void>
  datDangHoc: (hsIds: string[]) => Promise<void>
}

export interface KetQuaThemHsVaoLop {
  daThemIds: string[]
  daGhi: boolean
  loi?: string
}

/** Thêm/bật lại ghi danh hàng loạt vào lớp; reset don_gia_rieng về null khi bật lại và đồng bộ trạng thái nếu lỗi giữa chừng. */
export async function thucHienThemHsVaoLop(
  chonIds: string[],
  tungHocSet: Set<string>,
  ngay: string,
  thaoTac: ThaoTacThemHsVaoLop,
): Promise<KetQuaThemHsVaoLop> {
  const themMoi = chonIds.filter((id) => !tungHocSet.has(id))
  const batLai = chonIds.filter((id) => tungHocSet.has(id))
  const daThemIds: string[] = []
  let daGhi = false
  let daGoiDatDangHoc = false
  try {
    if (themMoi.length) {
      await thaoTac.themGhiDanh(themMoi)
      daGhi = true
      daThemIds.push(...themMoi)
    }
    for (const hsId of batLai) {
      await thaoTac.batLaiGhiDanh(hsId, { trang_thai: 'dang_hoc', ngay_vao: ngay, don_gia_rieng: null })
      daGhi = true
      daThemIds.push(hsId)
    }
    daGoiDatDangHoc = true
    await thaoTac.datDangHoc(chonIds)
    return { daThemIds, daGhi }
  } catch (e) {
    let loi = (e as Error).message
    if (daThemIds.length && !daGoiDatDangHoc) {
      try {
        await thaoTac.datDangHoc(daThemIds)
      } catch (loiSync) {
        loi = `${loi} (chưa đồng bộ được trạng thái học sinh: ${(loiSync as Error).message})`
      }
    }
    return { daThemIds, daGhi, loi }
  }
}

/** Chuẩn hoá đơn giá mặc định của lớp khi lưu: tuỳ chọn (bỏ trống lưu 0 để giữ ràng buộc NOT NULL). */
export function chuanDonGiaLop(gia: number | null | undefined): number {
  return typeof gia === 'number' && !Number.isNaN(gia) && gia > 0 ? gia : 0
}

/** Chỉ gợi ý đơn giá sang học sinh mới hoặc form sửa lớp khi lớp có đặt đơn giá mặc định (> 0). */
export function goiYDonGiaTuLop(lop?: Partial<Pick<Lop, 'don_gia'>> | null): number | undefined {
  return lop?.don_gia != null && lop.don_gia > 0 ? lop.don_gia : undefined
}
