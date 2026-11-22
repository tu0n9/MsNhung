// Ghi các dòng "moi" và "them_lop" sau khi đã kiểm tra. Tách khỏi import-excel.ts để phần kiểm tra test được không cần Supabase.
import { khoa, type KqHs, type KqLop } from './import-excel'
import { q, sb, type Lop } from './supabase'

export interface TienDo { xong: number; tong: number; dang: string }
export interface KetQuaNhap { lopMoi: number; hsMoi: number; lopThem: number; linkMoi: number; loi: { so: number; ten: string; loi: string }[] }

export async function nhapDuLieu(lops: KqLop[], hss: KqHs[], lopCo: Lop[], baoTienDo: (t: TienDo) => void): Promise<KetQuaNhap> {
  const lopMoi = lops.filter((l) => l.trangThai === 'moi')
  const hsMoi = hss.filter((h) => h.trangThai === 'moi')
  const themLop = hss.filter((h) => h.trangThai === 'them_lop')
  const capNhat = hss.filter((h) => h.trangThai === 'da_co' && h.capNhatLink)
  const tong = lopMoi.length + hsMoi.length + themLop.length + capNhat.length
  const kq: KetQuaNhap = { lopMoi: 0, hsMoi: 0, lopThem: 0, linkMoi: 0, loi: [] }

  // lớp trước để học sinh xếp được vào lớp mới trong cùng file
  baoTienDo({ xong: 0, tong, dang: 'Đang thêm lớp' })
  const idLop = new Map(lopCo.map((l) => [khoa(l.ten), l.id]))
  if (lopMoi.length) {
    const da = await q(sb.from('lop').insert(lopMoi.map((l) => ({ ten: l.ten, don_gia: l.don_gia, lich: l.lich, gio_thu: l.gio_thu }))).select('id, ten')) as { id: string; ten: string }[]
    da.forEach((l) => idLop.set(khoa(l.ten), l.id))
    kq.lopMoi = da.length
  }

  // học sinh mới: tạo 1 bản ghi hoc_sinh + ghi_danh lớp đầu tiên, lưu lại id theo dòng để các dòng sau gộp lớp
  const idHsTheoDong = new Map<number, string>()
  for (const [i, h] of hsMoi.entries()) {
    baoTienDo({ xong: kq.lopMoi + i, tong, dang: `Đang thêm ${h.ho_ten}` })
    try {
      const moi = await q(sb.from('hoc_sinh').insert({
        ho_ten: h.ho_ten, don_gia: h.don_gia, ten_phu_huynh: h.ten_phu_huynh, sdt_phu_huynh: h.sdt_phu_huynh,
        ngay_vao: h.ngay_vao, sticker_dau_ky: h.sticker_dau_ky, ghi_chu: h.ghi_chu, link_zalo: h.link_zalo,
      }).select('id').single()) as { id: string }
      await q(sb.from('ghi_danh').insert({
        hoc_sinh_id: moi.id, lop_id: idLop.get(khoa(h.tenLop)), ngay_vao: h.ngay_vao,
      }))
      idHsTheoDong.set(h.so, moi.id)
      kq.hsMoi++
    } catch (e) {
      kq.loi.push({ so: h.so, ten: h.ho_ten, loi: (e as Error).message })
    }
  }

  // thêm lớp cho học sinh đã có (trong DB hoặc vừa tạo ở dòng trên)
  for (const [i, h] of themLop.entries()) {
    baoTienDo({ xong: kq.lopMoi + hsMoi.length + i, tong, dang: `Đang thêm lớp ${h.tenLop} cho ${h.ho_ten}` })
    try {
      const hsId = h.hocSinhId ?? (h.gopVoiDong != null ? idHsTheoDong.get(h.gopVoiDong) : undefined)
      if (!hsId) throw new Error('Không xác định được học sinh để gộp lớp')
      await q(sb.from('ghi_danh').insert({
        hoc_sinh_id: hsId, lop_id: idLop.get(khoa(h.tenLop)), ngay_vao: h.ngay_vao,
      }))
      if (h.capNhatLink) {
        await q(sb.from('hoc_sinh').update({ link_zalo: h.link_zalo }).eq('id', h.capNhatLink))
        kq.linkMoi++
      }
      kq.lopThem++
    } catch (e) {
      kq.loi.push({ so: h.so, ten: h.ho_ten, loi: (e as Error).message })
    }
  }

  // học sinh đã có trong đúng lớp: chỉ ghi đúng cột link theo id
  for (const [i, h] of capNhat.entries()) {
    baoTienDo({ xong: kq.lopMoi + hsMoi.length + themLop.length + i, tong, dang: `Đang cập nhật link nhóm cho ${h.ho_ten}` })
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
