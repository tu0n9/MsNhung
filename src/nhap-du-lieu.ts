// Ghi các dòng "moi" sau khi đã kiểm tra. Tách khỏi import-excel.ts để phần kiểm tra test được không cần Supabase.
import { khoa, type KqHs, type KqLop } from './import-excel'
import { goiTaiKhoan, q, sb, type Lop } from './supabase'

export interface TienDo { xong: number; tong: number; dang: string }
export interface KetQuaNhap { lopMoi: number; hsMoi: number; phMoi: number; phDungChung: number; linkMoi: number; loi: { so: number; ten: string; loi: string }[] }

export async function nhapDuLieu(lops: KqLop[], hss: KqHs[], lopCo: Lop[], baoTienDo: (t: TienDo) => void): Promise<KetQuaNhap> {
  const lopMoi = lops.filter((l) => l.trangThai === 'moi')
  const hsMoi = hss.filter((h) => h.trangThai === 'moi')
  const capNhat = hss.filter((h) => h.capNhatLink)
  const tong = lopMoi.length + hsMoi.length + capNhat.length
  const kq: KetQuaNhap = { lopMoi: 0, hsMoi: 0, phMoi: 0, phDungChung: 0, linkMoi: 0, loi: [] }

  // lớp trước để học sinh xếp được vào lớp mới trong cùng file
  baoTienDo({ xong: 0, tong, dang: 'Đang thêm lớp' })
  const idLop = new Map(lopCo.map((l) => [khoa(l.ten), l.id]))
  if (lopMoi.length) {
    const da = await q(sb.from('lop').insert(lopMoi.map((l) => ({ ten: l.ten, don_gia: l.don_gia, lich: l.lich, gio_thu: l.gio_thu }))).select('id, ten')) as { id: string; ten: string }[]
    da.forEach((l) => idLop.set(khoa(l.ten), l.id))
    kq.lopMoi = da.length
  }

  // từng học sinh một: tạo tài khoản phụ huynh phải qua Edge Function, và một dòng hỏng không được kéo cả file hỏng theo
  const phTheoSdt = new Map<string, string>()
  for (const [i, h] of hsMoi.entries()) {
    baoTienDo({ xong: kq.lopMoi + i, tong, dang: h.sdt_phu_huynh ? `Đang tạo tài khoản phụ huynh cho ${h.ho_ten}` : `Đang thêm ${h.ho_ten}` })
    try {
      let phId: string | null = null
      if (h.sdt_phu_huynh) {
        phId = phTheoSdt.get(h.sdt_phu_huynh) ?? null
        if (!phId) {
          const r = await goiTaiKhoan({ hanh_dong: 'tao', vai_tro: 'phu_huynh', so_dien_thoai: h.sdt_phu_huynh, ho_ten: h.ten_phu_huynh || h.sdt_phu_huynh })
          phId = r.id as string
          phTheoSdt.set(h.sdt_phu_huynh, phId)
          if (r.da_co) kq.phDungChung++; else kq.phMoi++
        } else kq.phDungChung++
      }
      await q(sb.from('hoc_sinh').insert({
        ho_ten: h.ho_ten, lop_id: idLop.get(khoa(h.tenLop)), ten_phu_huynh: h.ten_phu_huynh, sdt_phu_huynh: h.sdt_phu_huynh,
        phu_huynh_id: phId, ngay_vao: h.ngay_vao, don_gia_rieng: h.don_gia_rieng, sticker_dau_ky: h.sticker_dau_ky, ghi_chu: h.ghi_chu,
        link_zalo: h.link_zalo,
      }))
      kq.hsMoi++
    } catch (e) {
      kq.loi.push({ so: h.so, ten: h.ho_ten, loi: (e as Error).message })
    }
  }

  // học sinh đã có: chỉ ghi đúng cột link, theo id, không đụng dữ liệu thật khác
  for (const [i, h] of capNhat.entries()) {
    baoTienDo({ xong: kq.lopMoi + hsMoi.length + i, tong, dang: `Đang cập nhật link nhóm cho ${h.ho_ten}` })
    try {
      await q(sb.from('hoc_sinh').update({ link_zalo: h.link_zalo }).eq('id', h.capNhatLink!))
      kq.linkMoi++
    } catch (e) {
      kq.loi.push({ so: h.so, ten: h.ho_ten, loi: (e as Error).message })
    }
  }
  baoTienDo({ xong: tong, tong, dang: 'Xong' })
  return kq
}
