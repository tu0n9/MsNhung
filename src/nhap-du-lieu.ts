// Ghi các dòng "moi" và "them_lop" sau khi đã kiểm tra. Tách khỏi import-excel.ts để phần kiểm tra test được không cần Supabase.
import { demCongViecImport, khoa, type KqHs, type KqLop } from './import-excel'
import { q, sb, type Lop } from './supabase'

export interface TienDo { xong: number; tong: number; dang: string }
export interface KetQuaNhap { lopMoi: number; hsMoi: number; lopThem: number; linkMoi: number; loi: { so: number; ten: string; loi: string }[] }

export async function nhapDuLieu(lops: KqLop[], hss: KqHs[], lopCo: Lop[], baoTienDo: (t: TienDo) => void): Promise<KetQuaNhap> {
  const lopMoi = lops.filter((l) => l.trangThai === 'moi')
  const hsMoi = hss.filter((h) => h.trangThai === 'moi')
  const themLop = hss.filter((h) => h.trangThai === 'them_lop')
  const capNhat = hss.filter((h) => h.trangThai === 'da_co' && h.capNhatLink)
  const { tong } = demCongViecImport(lops, hss)
  const kq: KetQuaNhap = { lopMoi: 0, hsMoi: 0, lopThem: 0, linkMoi: 0, loi: [] }
  const daCapNhatLink = new Set<string>()
  const coLinkTheoDong = new Set<number>()
  const coSdtTheoDong = new Set<number>()

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
      const lopId = idLop.get(khoa(h.tenLop))
      if (!lopId) throw new Error(`Không tìm thấy lớp "${h.tenLop}"`)
      const moi = await q(sb.from('hoc_sinh').insert({
        ho_ten: h.ho_ten, don_gia: h.don_gia, ten_phu_huynh: h.ten_phu_huynh, sdt_phu_huynh: h.sdt_phu_huynh,
        ngay_vao: h.ngay_vao, sticker_dau_ky: h.sticker_dau_ky, ghi_chu: h.ghi_chu, link_zalo: h.link_zalo,
      }).select('id').single()) as { id: string }
      // Nếu ghi_danh lỗi sau khi đã insert hoc_sinh, dọn ngay bản ghi hoc_sinh vừa tạo để tránh mồ côi không lớp
      try {
        await q(sb.from('ghi_danh').insert({
          hoc_sinh_id: moi.id, lop_id: lopId, ngay_vao: h.ngay_vao,
        }))
      } catch (loiGd) {
        const { error: loiXoa } = await sb.from('hoc_sinh').delete().eq('id', moi.id)
        if (loiXoa) throw new Error(`${(loiGd as Error).message} (chưa dọn được hồ sơ: ${loiXoa.message})`)
        throw loiGd
      }
      if (h.link_zalo) coLinkTheoDong.add(h.so)
      if (h.sdt_phu_huynh) coSdtTheoDong.add(h.so)
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
      const lopId = idLop.get(khoa(h.tenLop))
      if (!lopId) throw new Error(`Không tìm thấy lớp "${h.tenLop}"`)
      if (h.batLai) {
        await q(sb.from('ghi_danh').update({ trang_thai: 'dang_hoc', ngay_vao: h.ngay_vao }).eq('hoc_sinh_id', hsId).eq('lop_id', lopId))
      } else {
        await q(sb.from('ghi_danh').insert({
          hoc_sinh_id: hsId, lop_id: lopId, ngay_vao: h.ngay_vao,
        }))
      }
      // Đồng bộ hoc_sinh.trang_thai = 'dang_hoc' khi thêm/bật lại lớp cho học sinh sẵn có (có thể đang ngưng toàn bộ trước đó)
      if (h.hocSinhId) {
        const canCapNhatLink = h.capNhatLink === hsId && !daCapNhatLink.has(hsId)
        await q(sb.from('hoc_sinh').update({
          trang_thai: 'dang_hoc',
          ...(canCapNhatLink ? { link_zalo: h.link_zalo } : {}),
        }).eq('id', hsId))
        if (canCapNhatLink) { daCapNhatLink.add(hsId); kq.linkMoi++ }
      } else if (h.gopVoiDong != null) {
        // Dòng đầu tiên để trống link/SĐT nhưng dòng gộp phía dưới có → điền bù cho hồ sơ vừa tạo
        const boSung: Record<string, string | null> = {}
        if (h.link_zalo && !coLinkTheoDong.has(h.gopVoiDong) && !daCapNhatLink.has(hsId)) {
          boSung.link_zalo = h.link_zalo
          coLinkTheoDong.add(h.gopVoiDong)
          daCapNhatLink.add(hsId)
        }
        if (h.sdt_phu_huynh && !coSdtTheoDong.has(h.gopVoiDong)) {
          boSung.sdt_phu_huynh = h.sdt_phu_huynh
          coSdtTheoDong.add(h.gopVoiDong)
        }
        if (Object.keys(boSung).length > 0) {
          await q(sb.from('hoc_sinh').update(boSung).eq('id', hsId))
        }
      }
      if (h.capNhatLink && h.capNhatLink !== hsId && !daCapNhatLink.has(h.capNhatLink)) {
        await q(sb.from('hoc_sinh').update({ link_zalo: h.link_zalo }).eq('id', h.capNhatLink))
        daCapNhatLink.add(h.capNhatLink)
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
      if (daCapNhatLink.has(h.capNhatLink!)) continue
      await q(sb.from('hoc_sinh').update({ link_zalo: h.link_zalo }).eq('id', h.capNhatLink!))
      daCapNhatLink.add(h.capNhatLink!)
      kq.linkMoi++
    } catch (e) {
      kq.loi.push({ so: h.so, ten: h.ho_ten, loi: (e as Error).message })
    }
  }
  baoTienDo({ xong: tong, tong, dang: 'Xong' })
  return kq
}
