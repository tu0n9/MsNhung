import type { TaiKhoan, VaiTro } from './supabase'

export type TrangThaiTruyCap = 'bi_khoa' | 'phu_huynh' | 'doi_mat_khau' | 'hop_le'

const VAI_HOP_LE = new Set<VaiTro>(['admin', 'giao_vien', 'tro_giang'])

/**
 * Quyết định trạng thái truy cập sau đăng nhập:
 * kiểm tra vai trò ngừng sử dụng (`phu_huynh`) và trạng thái bị khoá (`!hoat_dong`) TRƯỚC `phai_doi_mat_khau`,
 * tránh lọt vào màn đổi mật khẩu hoặc giao diện nội bộ bằng phiên còn hiệu lực.
 */
export function trangThaiTruyCap(toi: Pick<TaiKhoan, 'vai_tro' | 'hoat_dong' | 'phai_doi_mat_khau'>): TrangThaiTruyCap {
  if (toi.vai_tro === 'phu_huynh') return 'phu_huynh'
  if (!toi.hoat_dong || !VAI_HOP_LE.has(toi.vai_tro)) return 'bi_khoa'
  if (toi.phai_doi_mat_khau) return 'doi_mat_khau'
  return 'hop_le'
}
