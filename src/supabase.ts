import { createClient } from '@supabase/supabase-js'

export const sb = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)

export type VaiTro = 'admin' | 'giao_vien' | 'tro_giang' | 'phu_huynh'
export interface TaiKhoan {
  id: string; ten_dang_nhap: string | null; so_dien_thoai: string | null; ho_ten: string
  vai_tro: VaiTro; phai_doi_mat_khau: boolean; don_gia_buoi: number; hoat_dong: boolean
}
export interface Lop { id: string; ten: string; don_gia: number; lich: number[]; hoat_dong: boolean }
export interface HocSinh {
  id: string; ho_ten: string; lop_id: string; avatar: string | null; ten_phu_huynh: string | null
  sdt_phu_huynh: string | null; phu_huynh_id: string | null; ngay_vao: string; don_gia_rieng: number | null
  trang_thai: 'dang_hoc' | 'ngung'; ghi_chu: string | null; sticker_dau_ky: number
}
export interface BuoiHoc { id: string; lop_id: string; ngay: string; loai: 'lich' | 'phu' | 'bu'; lop_nghi: boolean; ghi_chu: string | null }
export interface DiemDanh { buoi_id: string; hoc_sinh_id: string; trang_thai: 'co_mat' | 'vang' | 'hoc_bu'; sticker: number }

export const laQuanLy = (v?: VaiTro) => v === 'admin' || v === 'giao_vien'

/** Ném lỗi của Supabase ra để chỗ gọi hiện message.error, khỏi kiểm `error` ở mọi nơi. */
export async function q<T>(p: PromiseLike<{ data: T; error: { message: string } | null }>): Promise<T> {
  const { data, error } = await p
  if (error) throw new Error(error.message)
  return data
}

export async function goiTaiKhoan(body: Record<string, unknown>) {
  const { data, error } = await sb.functions.invoke('tai-khoan', { body })
  if (error) {
    const chiTiet = await (error as { context?: Response }).context?.json?.().catch(() => null)
    throw new Error(chiTiet?.loi ?? error.message)
  }
  return data
}

/** Nén ảnh điện thoại (thường 3–8 MB) về cạnh dài `canh` px để gói Free 1 GB dùng được lâu. */
export async function nenAnh(file: File, canh = 1600): Promise<Blob> {
  const bmp = await createImageBitmap(file)
  const tile = Math.min(1, canh / Math.max(bmp.width, bmp.height))
  const c = document.createElement('canvas')
  c.width = Math.round(bmp.width * tile)
  c.height = Math.round(bmp.height * tile)
  c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height)
  return new Promise((ok) => c.toBlob((b) => ok(b!), 'image/jpeg', 0.8))
}

export async function taiAnhLen(duongDan: string, file: File, canh?: number) {
  await q(sb.storage.from('anh').upload(duongDan, await nenAnh(file, canh), { contentType: 'image/jpeg', upsert: true }))
  return duongDan
}

const cacheUrl = new Map<string, string>()
/** Bucket riêng tư nên phải xin link có hạn; cache trong phiên để lưới avatar không xin lại liên tục. */
export async function urlAnh(duongDans: string[]): Promise<Record<string, string>> {
  const thieu = duongDans.filter((d) => d && !cacheUrl.has(d))
  if (thieu.length) {
    const { data } = await sb.storage.from('anh').createSignedUrls(thieu, 60 * 60 * 6)
    data?.forEach((x) => x.signedUrl && x.path && cacheUrl.set(x.path, x.signedUrl))
  }
  return Object.fromEntries(duongDans.filter((d) => cacheUrl.has(d)).map((d) => [d, cacheUrl.get(d)!]))
}

export const THU = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
export const homNay = () => new Date().toLocaleDateString('sv-SE') // 'YYYY-MM-DD' theo giờ máy
