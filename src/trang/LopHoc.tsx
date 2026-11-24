import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, App, AutoComplete, Avatar, Button, Checkbox, Collapse, DatePicker, Empty, Form, Input, InputNumber, List, Modal, Popconfirm, Segmented, Select, Space, Tag, Upload } from 'antd'
import { ArrowLeftOutlined, FileExcelOutlined, MergeCellsOutlined, MinusOutlined, PlusOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useToi } from '../App'
import { giaGhiDanh, laQuanLy, lopCuaHs, q, sb, taiAnhLen, taiHet, taiTongSticker, THU, urlAnh, useMotLan, type GhiDanh, type HocSinh, type Lop } from '../supabase'
import { vnd } from '../hoc-phi'
import { cong2Gio, moTaLich, thieuGio, type GioThu } from '../gio-hoc'
import { khoa } from '../import-excel'
import { chuanDonGiaLop, coCanHienGiaRieng, dsHocSinhCoTheThemVaoLop, ghiDanhCanDongBoNgay, goiYDonGiaTuLop, khongDau, kiemTraGopLopVaoEm, locGoiYHocSinh, locHocSinh, locHsTrongLop, phanLoaiHocSinh, thucHienThemHsVaoLop, trangThaiHsSauGhiDanh, trangThaiHsSauSua, type PhanLoaiHs } from '../lop-hoc'
import { MAU, O_TIEN } from '../giao-dien'
import HocSinhChiTiet from './HocSinhChiTiet'
import HopThoaiXoa from '../thanh-phan/HopThoaiXoa'
import { HopThoaiXoaXacNhanTen, ThongBaoThanhTienDo } from '../thanh-phan/HopThoaiXoaXacNhanTen'
import { HuyHieuDem, NutChonNhanh, OChiTimKiem } from '../thanh-phan/TimKiemChonNhanh'

type FormHsGiaTri = HocSinh & {
  lop_ids?: string[]
  gia_rieng?: Record<string, number | null | undefined>
  ngay_vao_d: dayjs.Dayjs
  ngay_vao_lop_moi?: dayjs.Dayjs
  anh?: File
}
type ManHinh = 'chon' | 'lop' | 'hs'
type LocHs = 'tat_ca' | PhanLoaiHs
const giaSo = (x: unknown): number | null => (typeof x === 'number' && !Number.isNaN(x) ? x : null)

export default function LopHoc() {
  const { message } = App.useApp()
  const toi = useToi()
  const ql = laQuanLy(toi.vai_tro)
  const nav = useNavigate()
  const [man, setMan] = useState<ManHinh>('chon')
  const [lops, setLops] = useState<Lop[]>([])
  const [hs, setHs] = useState<HocSinh[]>([])
  const [gds, setGds] = useState<GhiDanh[]>([])
  const [url, setUrl] = useState<Record<string, string>>({})
  const [suaLop, setSuaLop] = useState<Partial<Lop> | null>(null)
  const [suaHs, setSuaHs] = useState<(Partial<HocSinh> & { lop_ids?: string[] }) | null>(null)
  const [lopThemHs, setLopThemHs] = useState<Lop | null>(null)
  const [emDaChon, setEmDaChon] = useState<HocSinh | null>(null)
  const [trungHoi, setTrungHoi] = useState<{ ungVien: HocSinh[]; v: FormHsGiaTri } | null>(null)
  const [moGop, setMoGop] = useState(false)
  const [xem, setXem] = useState<HocSinh | null>(null)
  const [hienNgung, setHienNgung] = useState(false)
  const [locHs, setLocHs] = useState<LocHs>('tat_ca')
  // thu gọn mọi lớp khi mở trang (14 lớp mở cùng lúc rối mắt); tìm tên thì tự mở các lớp có em đó
  const [mo, setMo] = useState<string[]>([])
  const [tim, setTim] = useState('')
  const [tong, setTong] = useState<Record<string, number>>({})
  const [hsSticker, setHsSticker] = useState<HocSinh | null>(null)
  const [lopCanXoa, setLopCanXoa] = useState<Partial<Lop> | null>(null)
  const [thongBaoXoa, setThongBaoXoa] = useState<string | null>(null)
  const [goHsLop, setGoHsLop] = useState<{ h: HocSinh; gd: GhiDanh; tenLop: string } | null>(null)
  const [xoaHs, setXoaHs] = useState<HocSinh | null>(null)
  const [xacNhanBoLop, setXacNhanBoLop] = useState<{ tenHs: string; soLop: number; tenBo: string; resolve: (ok: boolean) => void } | null>(null)
  const [formHs] = Form.useForm<FormHsGiaTri>()

  const tai = async () => {
    const [l, h, g, t] = await Promise.all([
      q(sb.from('lop').select('*').order('ten')),
      taiHet((a, b) => sb.from('hoc_sinh').select('*').order('ho_ten').order('id').range(a, b)),
      taiHet((a, b) => sb.from('ghi_danh').select('*').order('id').range(a, b)),
      taiTongSticker(),
    ])
    setLops(l as Lop[]); setHs(h as HocSinh[]); setGds(g as GhiDanh[]); setTong(t)
    setUrl(await urlAnh((h as HocSinh[]).map((x) => x.avatar!).filter(Boolean)))
  }
  useEffect(() => { tai().catch((e) => message.error(e.message)) }, [])

  const hsMap = new Map(hs.map((h) => [h.id, h]))
  const lopMap = new Map(lops.map((l) => [l.id, l]))
  const tenCacLop = (hsId: string) => {
    const ds = lopCuaHs(gds, hsId)
    const dh = ds.filter((g) => g.trang_thai === 'dang_hoc')
    return (dh.length ? dh : ds).map((g) => lopMap.get(g.lop_id)?.ten).filter(Boolean).join(', ')
  }

  const [luuLop, dangLuuLop] = useMotLan(async (v: Omit<Lop, 'don_gia'> & { don_gia?: number | null }) => {
    try {
      const gio_thu = v.gio_thu ?? {}
      const ban = { ten: v.ten.trim(), don_gia: chuanDonGiaLop(v.don_gia), lich: Object.keys(gio_thu).map(Number), gio_thu, hoat_dong: v.hoat_dong ?? true }
      await q(suaLop?.id ? sb.from('lop').update(ban).eq('id', suaLop.id) : sb.from('lop').insert(ban))
      setSuaLop(null); tai()
    } catch (e) { message.error((e as Error).message) }
  })

  // gộp các lớp được chọn vào học sinh đã có trong DB (tạo ghi_danh mới hoặc bật lại ghi_danh cũ)
  const gopLopVaoEm = async (em: HocSinh, lopIds: string[], ngayVao: string, giaRieng?: Record<string, number | null | undefined>) => {
    const daCo = new Map(lopCuaHs(gds, em.id).map((g) => [g.lop_id, g]))
    const them = lopIds.filter((id) => !daCo.has(id))
    const batLai = lopIds.filter((id) => daCo.get(id)?.trang_thai === 'ngung')
    if (them.length) {
      await q(sb.from('ghi_danh').insert(them.map((lop_id) => ({
        hoc_sinh_id: em.id, lop_id, ngay_vao: ngayVao, don_gia_rieng: giaSo(giaRieng?.[lop_id]),
      }))))
    }
    if (batLai.length) {
      for (const lop_id of batLai) {
        const gr = giaSo(giaRieng?.[lop_id])
        // Bật lại lớp cũ phải cập nhật ngày vào mới và ghi đè don_gia_rieng kể cả khi đặt lại về null ("theo giá HS")
        await q(sb.from('ghi_danh').update({ trang_thai: 'dang_hoc', ngay_vao: ngayVao, don_gia_rieng: gr })
          .eq('hoc_sinh_id', em.id).eq('lop_id', lop_id))
      }
    }
    if (them.length || batLai.length) {
      await q(sb.from('hoc_sinh').update({ trang_thai: 'dang_hoc' }).eq('id', em.id))
    }
    setSuaHs(null); setTrungHoi(null)
    message.success(them.length || batLai.length ? `Đã gộp thêm lớp vào học sinh ${em.ho_ten} (${em.ma_hs})` : `${em.ho_ten} (${em.ma_hs}) đã có trong các lớp này`)
    tai()
  }

  const taoHocSinhMoi = async (v: FormHsGiaTri) => {
    const sdt = v.sdt_phu_huynh?.replace(/\D/g, '') || null
    const ngayVao = v.ngay_vao_d.format('YYYY-MM-DD')
    const lopIds = v.lop_ids ?? []
    const ban = {
      ho_ten: v.ho_ten.trim(), don_gia: v.don_gia, ten_phu_huynh: v.ten_phu_huynh || null, sdt_phu_huynh: sdt,
      ngay_vao: ngayVao, ghi_chu: v.ghi_chu || null, sticker_dau_ky: v.sticker_dau_ky ?? 0,
    }
    const luu = await q(sb.from('hoc_sinh').insert(ban).select().single()) as HocSinh
    if (lopIds.length) {
      // Nếu ghi_danh lỗi sau khi đã insert hoc_sinh, dọn ngay bản ghi hoc_sinh vừa tạo để tránh nửa vời
      try {
        await q(sb.from('ghi_danh').insert(lopIds.map((lop_id) => ({
          hoc_sinh_id: luu.id, lop_id, ngay_vao: ngayVao, don_gia_rieng: giaSo(v.gia_rieng?.[lop_id]),
        }))))
      } catch (loiGd) {
        const { error: loiXoa } = await sb.from('hoc_sinh').delete().eq('id', luu.id)
        if (loiXoa) throw new Error(`${(loiGd as Error).message} (chưa dọn được hồ sơ: ${loiXoa.message})`)
        throw loiGd
      }
    }
    setSuaHs(null); setTrungHoi(null); tai()
    message.success(lopIds.length ? `Đã thêm học sinh ${luu.ho_ten} (${luu.ma_hs})` : `Đã thêm hồ sơ ${luu.ho_ten} (${luu.ma_hs}) · Chưa xếp lớp`)
    if (v.anh) {
      try {
        const duong = await taiAnhLen(`avatar/${luu.id}-${Date.now()}.jpg`, v.anh, 400)
        await q(sb.from('hoc_sinh').update({ avatar: duong }).eq('id', luu.id)); tai()
      } catch (e) { message.error(`Đã lưu học sinh nhưng chưa tải được ảnh: ${(e as Error).message}`) }
    }
  }

  const [luuHs, dangLuuHs] = useMotLan(async (v: FormHsGiaTri) => {
    let daGhi = false
    try {
      const sdt = v.sdt_phu_huynh?.replace(/\D/g, '') || null
      const ngayVao = v.ngay_vao_d.format('YYYY-MM-DD')
      const lopIds = v.lop_ids ?? []
      if (suaHs?.id) {
        const cuGds = lopCuaHs(gds, suaHs.id)
        const cu = cuGds.map((x) => x.lop_id)
        const them = lopIds.filter((id) => !cu.includes(id))
        const bo = cu.filter((id) => !lopIds.includes(id))
        // Bỏ tick lớp sẽ xoá ghi_danh khỏi lớp đó → bắt buộc hỏi xác nhận trước khi ghi DB
        if (bo.length) {
          const tenBo = bo.map((id) => lopMap.get(id)?.ten ?? id).join(', ')
          const xacNhan = await new Promise<boolean>((resolve) => {
            setXacNhanBoLop({ tenHs: v.ho_ten.trim(), soLop: bo.length, tenBo, resolve })
          })
          if (!xacNhan) return
        }
        const ban = {
          ho_ten: v.ho_ten.trim(), don_gia: v.don_gia, ten_phu_huynh: v.ten_phu_huynh || null, sdt_phu_huynh: sdt,
          ngay_vao: ngayVao, ghi_chu: v.ghi_chu || null, sticker_dau_ky: v.sticker_dau_ky ?? 0,
        }
        await q(sb.from('hoc_sinh').update(ban).eq('id', suaHs.id))
        daGhi = true
        for (const g of ghiDanhCanDongBoNgay(cuGds, lopIds, suaHs.ngay_vao, ngayVao)) {
          await q(sb.from('ghi_danh').update({ ngay_vao: ngayVao }).eq('id', g.id))
        }
        if (them.length) {
          const ngayVaoMoi = (v.ngay_vao_lop_moi ?? dayjs()).format('YYYY-MM-DD')
          await q(sb.from('ghi_danh').insert(them.map((lop_id) => ({
            hoc_sinh_id: suaHs.id!, lop_id, ngay_vao: ngayVaoMoi, don_gia_rieng: giaSo(v.gia_rieng?.[lop_id]),
          }))))
        }
        if (bo.length) await q(sb.from('ghi_danh').delete().eq('hoc_sinh_id', suaHs.id).in('lop_id', bo))
        for (const g of cuGds) {
          if (!lopIds.includes(g.lop_id)) continue
          const gr = giaSo(v.gia_rieng?.[g.lop_id])
          if ((g.don_gia_rieng ?? null) !== gr) {
            await q(sb.from('ghi_danh').update({ don_gia_rieng: gr }).eq('id', g.id))
          }
        }
        const trangThaiMoi = trangThaiHsSauSua(cuGds, lopIds)
        if (trangThaiMoi !== suaHs.trang_thai) {
          await q(sb.from('hoc_sinh').update({ trang_thai: trangThaiMoi }).eq('id', suaHs.id))
        }
        setSuaHs(null); tai()
        if (v.anh) {
          try {
            const duong = await taiAnhLen(`avatar/${suaHs.id}-${Date.now()}.jpg`, v.anh, 400)
            await q(sb.from('hoc_sinh').update({ avatar: duong }).eq('id', suaHs.id)); tai()
          } catch (e) { message.error(`Đã lưu học sinh nhưng chưa tải được ảnh: ${(e as Error).message}`) }
        }
        return
      }

      // Nếu cô đã chọn học sinh có sẵn trong danh sách gợi ý -> gộp lớp thẳng vào hồ sơ đó
      if (emDaChon) {
        const loiGop = kiemTraGopLopVaoEm(true, lopIds)
        if (loiGop) { message.warning(loiGop); return }
        return await gopLopVaoEm(emDaChon, lopIds, ngayVao, v.gia_rieng)
      }

      // Luồng thêm mới: trùng Họ tên + SĐT (và có chọn lớp) -> gộp luôn; trùng Họ tên -> hỏi xác nhận tránh trùng hồ sơ
      const tenK = khoa(v.ho_ten)
      const trungChinhXac = sdt ? hs.find((x) => khoa(x.ho_ten) === tenK && x.sdt_phu_huynh === sdt) : undefined
      if (trungChinhXac && lopIds.length > 0) return await gopLopVaoEm(trungChinhXac, lopIds, ngayVao, v.gia_rieng)

      const trungTen = hs.filter((x) => khoa(x.ho_ten) === tenK)
      if (trungTen.length > 0) {
        setTrungHoi({ ungVien: trungTen, v })
        return
      }
      await taoHocSinhMoi(v)
    } catch (e) {
      // đồng bộ lại state nếu một phần truy vấn sửa đã ghi xuống DB trước khi gặp lỗi mạng
      if (daGhi) tai().catch(() => {})
      message.error((e as Error).message)
    }
  })

  const doiTrangThai = async (h: HocSinh, gd: GhiDanh) => {
    try {
      const moi = gd.trang_thai === 'ngung' ? 'dang_hoc' : 'ngung'
      await q(sb.from('ghi_danh').update({ trang_thai: moi }).eq('id', gd.id))
      const conLai = lopCuaHs(gds, h.id).map((g) => (g.id === gd.id ? { ...g, trang_thai: moi as 'dang_hoc' | 'ngung' } : g))
      await q(sb.from('hoc_sinh').update({ trang_thai: trangThaiHsSauGhiDanh(conLai) }).eq('id', h.id))
    } catch (e) { return message.error((e as Error).message) }
    tai()
  }

  // Ở màn Quản lý Lớp: chỉ gỡ học sinh khỏi lớp này, KHÔNG xoá hồ sơ gốc (nếu hết lớp sẽ chuyển về "Chưa xếp lớp")
  const goKhoiLop = async (h: HocSinh, gd: GhiDanh) => {
    try {
      await q(sb.from('ghi_danh').delete().eq('id', gd.id))
      const conLai = lopCuaHs(gds, h.id).filter((g) => g.id !== gd.id)
      await q(sb.from('hoc_sinh').update({ trang_thai: trangThaiHsSauGhiDanh(conLai) }).eq('id', h.id))
      message.success(conLai.length
        ? `Đã gỡ ${h.ho_ten} khỏi lớp này`
        : `Đã gỡ ${h.ho_ten} khỏi lớp · hồ sơ chuyển về mục Học sinh (Chưa xếp lớp)`)
      tai()
    } catch (e) { message.error((e as Error).message) }
  }

  // Ở màn Quản lý Học sinh: xoá hẳn hồ sơ học sinh khi nhập nhầm và chưa có dữ liệu điểm danh / học phí / sticker / chi phí
  const xoaHoSoHs = async (h: HocSinh) => {
    try {
      const kq = await Promise.all([
        sb.from('diem_danh').select('hoc_sinh_id', { count: 'exact', head: true }).eq('hoc_sinh_id', h.id),
        sb.from('goi_hoc').select('id', { count: 'exact', head: true }).eq('hoc_sinh_id', h.id),
        sb.from('sticker_cong_tru').select('id', { count: 'exact', head: true }).eq('hoc_sinh_id', h.id),
        sb.from('chi_phi').select('id', { count: 'exact', head: true }).eq('hoc_sinh_id', h.id),
      ])
      for (const r of kq) if (r.error) throw new Error(r.error.message)
      if (kq.some((r) => (r.count ?? 0) > 0)) {
        message.error('Học sinh đã có dữ liệu điểm danh hoặc học phí, không thể xoá hẳn (chỉ nên ngừng học trong lớp)')
        return
      }
      await q(sb.from('ghi_danh').delete().eq('hoc_sinh_id', h.id))
      await q(sb.from('hoc_sinh').delete().eq('id', h.id))
      if (h.avatar) await sb.storage.from('anh').remove([h.avatar])
      message.success(`Đã xoá hồ sơ ${h.ho_ten} (${h.ma_hs})`)
      tai()
    } catch (e) { message.error((e as Error).message) }
  }

  const moThemHs = (lopMacDinh?: Lop) => {
    const giaMacDinh = goiYDonGiaTuLop(lopMacDinh)
    setSuaHs({ ngay_vao: dayjs().format('YYYY-MM-DD'), ...(lopMacDinh ? { lop_ids: [lopMacDinh.id], ...(giaMacDinh != null ? { don_gia: giaMacDinh } : {}) } : { lop_ids: [] }) })
  }

  // Khi bỏ chọn em có sẵn (bấm "Bỏ chọn" hoặc gõ tên khác), xoá các ô hồ sơ cũ để tránh dính SĐT/đơn giá cũ hoặc bị auto-merge nhầm
  const boChonEm = () => {
    setEmDaChon(null)
    const lopHienTai: string[] = formHs.getFieldValue('lop_ids') ?? []
    const donGiaMacDinh = (lopHienTai.length ? goiYDonGiaTuLop(lops.find((l) => l.id === lopHienTai[0])) : undefined) ?? suaHs?.don_gia
    formHs.setFieldsValue({
      don_gia: donGiaMacDinh,
      gia_rieng: {},
      ten_phu_huynh: undefined,
      sdt_phu_huynh: undefined,
      sticker_dau_ky: undefined,
      ghi_chu: undefined,
      anh: undefined,
    })
    formHs.setFields([{ name: 'lop_ids', errors: [] }])
  }
  const khoaHoSo = !suaHs?.id && !!emDaChon

  useEffect(() => {
    setEmDaChon(null)
    if (!suaHs) return
    formHs.resetFields()
    const gdsEm = suaHs.id ? lopCuaHs(gds, suaHs.id) : []
    const lopIds = suaHs.id ? gdsEm.map((x) => x.lop_id) : (suaHs.lop_ids ?? [])
    const giaRieng = Object.fromEntries(gdsEm.filter((g) => g.don_gia_rieng != null).map((g) => [g.lop_id, g.don_gia_rieng]))
    formHs.setFieldsValue({
      ...suaHs,
      lop_ids: lopIds,
      gia_rieng: giaRieng,
      ngay_vao_d: dayjs(suaHs.ngay_vao),
      ngay_vao_lop_moi: dayjs(),
    } as Partial<FormHsGiaTri>)
  }, [suaHs])

  if (xem) return <HocSinhChiTiet hs={xem} lops={lops} ghiDanh={gds} quayLai={() => { setXem(null); tai() }} />

  // Thống kê nhanh cho màn chọn & thanh lọc học sinh
  const phanLoaiMap = new Map(hs.map((h) => [h.id, phanLoaiHocSinh(h.id, gds)]))
  const demDangHoc = hs.filter((h) => phanLoaiMap.get(h.id) === 'dang_hoc').length
  const demChuaXep = hs.filter((h) => phanLoaiMap.get(h.id) === 'chua_xep').length
  const demNgung = hs.filter((h) => phanLoaiMap.get(h.id) === 'ngung').length
  const soLopMo = lops.filter((l) => l.hoat_dong).length

  // Tìm kiếm màn Lớp
  const timKhong = khongDau(tim.trim())
  const dsCuaLop = (lop: Lop) => locHsTrongLop(lop, gds, hsMap, tim, hienNgung)
  const lopTimThay = lops.filter((l) => khongDau(l.ten).includes(timKhong) || dsCuaLop(l).length > 0)

  // Tìm kiếm & lọc màn Học sinh
  const hsTheoLoc = locHs === 'tat_ca' ? hs : hs.filter((h) => phanLoaiMap.get(h.id) === locHs)
  const hsHienThi = locHocSinh(hsTheoLoc, tim)

  const quayLaiChon = () => { setMan('chon'); setTim('') }

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={12}>
      {man === 'chon' && (
        <>
          <div>
            <h2 style={{ margin: '4px 0 4px' }}>Lớp & Học sinh</h2>
            <div style={{ color: MAU.chuPhu, fontSize: 13 }}>Chọn mục bạn muốn quản lý (tạo lớp và tạo hồ sơ học sinh độc lập, rồi xếp học sinh vào lớp).</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 14 }}>
            <button type="button" className="ux the-chon-lop" onClick={() => { setTim(''); setMan('lop') }}>
              <span className="the-chon-lop-ic" style={{ background: MAU.chinhNhat, color: MAU.chinh }}>
                <TeamOutlined />
              </span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 17, fontWeight: 600 }}>Quản lý Lớp học</div>
                <div style={{ fontSize: 13, color: MAU.chuPhu, marginTop: 4 }}>
                  {soLopMo} lớp đang mở{lops.length > soLopMo ? ` · ${lops.length} tổng` : ''}
                </div>
                <div style={{ fontSize: 12, color: MAU.chuMo, marginTop: 2 }}>Tạo lớp, xếp lịch, thêm hoặc gỡ học sinh khỏi lớp</div>
              </div>
            </button>

            <button type="button" className="ux the-chon-lop" onClick={() => { setTim(''); setMan('hs') }}>
              <span className="the-chon-lop-ic" style={{ background: MAU.xanhNhat, color: MAU.xanh }}>
                <UserOutlined />
              </span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 17, fontWeight: 600 }}>Quản lý Học sinh</div>
                <div style={{ fontSize: 13, color: MAU.chuPhu, marginTop: 4 }}>
                  {hs.length} học sinh · {demDangHoc} đang học{demChuaXep > 0 ? ` · ${demChuaXep} chưa xếp lớp` : ''}
                </div>
                <div style={{ fontSize: 12, color: MAU.chuMo, marginTop: 2 }}>Tạo hồ sơ học sinh, đơn giá cố định, SĐT & xếp lớp</div>
              </div>
            </button>
          </div>
          {ql && (
            <Space wrap style={{ marginTop: 4 }}>
              <Button icon={<FileExcelOutlined />} onClick={() => nav('/import')}>Import từ Excel</Button>
              <Button icon={<MergeCellsOutlined />} onClick={() => setMoGop(true)} disabled={hs.length < 2}>Gộp học sinh trùng</Button>
            </Space>
          )}
        </>
      )}

      {man === 'lop' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={quayLaiChon}>Quay lại</Button>
              <h2 style={{ margin: 0, fontSize: 18 }}>Quản lý Lớp học ({lops.length})</h2>
            </Space>
            {ql && (
              <Space wrap>
                <Button icon={<PlusOutlined />} type="primary" onClick={() => setSuaLop({ lich: [], hoat_dong: true })}>Thêm lớp</Button>
                <Checkbox checked={hienNgung} onChange={(e) => setHienNgung(e.target.checked)}>Hiện HS đã ngừng</Checkbox>
              </Space>
            )}
          </div>
          <OChiTimKiem value={tim} onChange={setTim} placeholder="Tìm tên lớp, tên học sinh hoặc mã HS" ariaLabel="Tìm lớp hoặc học sinh" />
          {lops.length === 0 ? (
            <Empty description="Chưa có lớp học nào" style={{ padding: '24px 0' }}>
              {ql && <Button type="primary" icon={<PlusOutlined />} onClick={() => setSuaLop({ lich: [], hoat_dong: true })}>Tạo lớp đầu tiên</Button>}
            </Empty>
          ) : (
            <Collapse activeKey={timKhong ? lopTimThay.map((l) => l.id) : mo} onChange={(k) => { if (timKhong) return; setMo(k as string[]) }}
              items={(timKhong ? lopTimThay : lops).map((l) => {
                const ds = dsCuaLop(l)
                return {
                  key: l.id,
                  label: <Space wrap><b>{l.ten}</b>{l.lich.length > 0 && <span>{moTaLich(l)}</span>}{thieuGio(l) && <Tag color="red">Chưa có giờ</Tag>}
                    {ql && l.don_gia > 0 && <span>{vnd(l.don_gia)}/buổi</span>}<Tag>{ds.length} HS</Tag>{!l.hoat_dong && <Tag>Ngừng</Tag>}</Space>,
                  extra: ql && <Space size="small" onClick={(e) => e.stopPropagation()}>
                    <Button size="small" type="primary" ghost onClick={() => setLopThemHs(l)}>+ Thêm HS</Button>
                    <Button size="small" onClick={() => setSuaLop(l)}>Sửa lớp</Button>
                  </Space>,
                  children: <List dataSource={ds} locale={{ emptyText: 'Chưa có học sinh trong lớp này' }} renderItem={({ gd, h }) => {
                    const soLopKhac = lopCuaHs(gds, h.id, true).filter((x) => x.lop_id !== l.id).length
                    return (
                      <List.Item style={{ cursor: 'pointer' }} onClick={() => setXem(h)} actions={ql ? [
                        <a key="s" onClick={(e) => { e.stopPropagation(); setSuaHs(h) }}>Sửa</a>,
                        <Popconfirm key="n" title={gd.trang_thai === 'ngung' ? 'Cho học lại lớp này?' : 'Chuyển sang ngừng học lớp này?'} onConfirm={() => doiTrangThai(h, gd)}>
                          <a onClick={(e) => e.stopPropagation()}>{gd.trang_thai === 'ngung' ? 'Học lại' : 'Ngừng'}</a></Popconfirm>,
                        <a key="x" style={{ color: 'red' }} onClick={(e) => { e.stopPropagation(); setGoHsLop({ h, gd, tenLop: l.ten }) }}>Gỡ</a>,
                      ] : []}>
                        <List.Item.Meta
                          avatar={<Avatar shape="square" size={48} src={h.avatar && url[h.avatar]}>{h.ho_ten.split(' ').pop()?.[0]}</Avatar>}
                          title={<>
                            <span>{h.ho_ten}</span> <Tag>{h.ma_hs}</Tag>
                            {soLopKhac > 0 && <Tag color="blue">+{soLopKhac} lớp</Tag>}
                            {gd.trang_thai === 'ngung' && <Tag>Ngừng lớp này</Tag>}
                            <Button size="small" style={{ marginLeft: 4 }} aria-label={`Sticker của ${h.ho_ten}`}
                              onClick={(e) => { e.stopPropagation(); setHsSticker(h) }}>⭐ {tong[h.id] ?? 0}</Button>
                          </>}
                          description={[ql && `${vnd(giaGhiDanh(h, gd))}/buổi${gd.don_gia_rieng != null && gd.don_gia_rieng !== h.don_gia ? ' (giá riêng lớp)' : ''}`,
                            h.ten_phu_huynh, h.sdt_phu_huynh].filter(Boolean).join(' · ')} />
                      </List.Item>
                    )
                  }} />,
                }
              })} />
          )}
        </>
      )}

      {man === 'hs' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={quayLaiChon}>Quay lại</Button>
              <h2 style={{ margin: 0, fontSize: 18 }}>Quản lý Học sinh ({hs.length})</h2>
            </Space>
            {ql && (
              <Space wrap>
                <Button icon={<PlusOutlined />} type="primary" onClick={() => moThemHs()}>Thêm học sinh</Button>
                <Button icon={<MergeCellsOutlined />} onClick={() => setMoGop(true)} disabled={hs.length < 2}>Gộp trùng</Button>
              </Space>
            )}
          </div>
          <div style={{ overflowX: 'auto', maxWidth: '100%', paddingBottom: 2 }}>
            <Segmented value={locHs} onChange={(v) => setLocHs(v as LocHs)} options={[
              { value: 'tat_ca', label: `Tất cả (${hs.length})` },
              { value: 'dang_hoc', label: `Đang học (${demDangHoc})` },
              { value: 'chua_xep', label: `Chưa xếp lớp (${demChuaXep})` },
              { value: 'ngung', label: `Đã ngừng (${demNgung})` },
            ]} />
          </div>
          <OChiTimKiem value={tim} onChange={setTim} placeholder="Tìm theo họ tên, mã HS hoặc SĐT phụ huynh" ariaLabel="Tìm học sinh" />
          <List bordered style={{ background: MAU.mat, borderRadius: 12 }} dataSource={hsHienThi}
            locale={{ emptyText: 'Không có học sinh nào' }} renderItem={(h) => {
              const loai = phanLoaiMap.get(h.id) ?? 'chua_xep'
              const dsLopDangHoc = lopCuaHs(gds, h.id, true).map((g) => lopMap.get(g.lop_id)?.ten).filter(Boolean) as string[]
              const dsLopNgung = lopCuaHs(gds, h.id).filter((g) => g.trang_thai === 'ngung').map((g) => lopMap.get(g.lop_id)?.ten).filter(Boolean) as string[]
              return (
                <List.Item style={{ cursor: 'pointer' }} onClick={() => setXem(h)} actions={ql ? [
                  <a key="s" onClick={(e) => { e.stopPropagation(); setSuaHs(h) }}>{loai === 'chua_xep' ? 'Xếp lớp / Sửa' : 'Sửa'}</a>,
                  <a key="x" style={{ color: 'red' }} onClick={(e) => { e.stopPropagation(); setXoaHs(h) }}>Xoá</a>,
                ] : []}>
                  <List.Item.Meta
                    avatar={<Avatar shape="square" size={48} src={h.avatar && url[h.avatar]}>{h.ho_ten.split(' ').pop()?.[0]}</Avatar>}
                    title={<Space wrap size={4}>
                      <span>{h.ho_ten}</span>
                      <Tag>{h.ma_hs}</Tag>
                      {loai === 'chua_xep' && <Tag color="orange">Chưa xếp lớp</Tag>}
                      {loai === 'ngung' && <Tag>Đã ngừng{dsLopNgung.length ? ` (${dsLopNgung.join(', ')})` : ''}</Tag>}
                      {dsLopDangHoc.map((ten) => <Tag key={ten} color="blue">{ten}</Tag>)}
                      <Button size="small" aria-label={`Sticker của ${h.ho_ten}`}
                        onClick={(e) => { e.stopPropagation(); setHsSticker(h) }}>⭐ {tong[h.id] ?? 0}</Button>
                    </Space>}
                    description={[ql && `${vnd(h.don_gia)}/buổi`, h.ten_phu_huynh, h.sdt_phu_huynh].filter(Boolean).join(' · ')} />
                </List.Item>
              )
            }} />
        </>
      )}

      <Modal open={!!suaLop} title={suaLop?.id ? 'Sửa lớp' : 'Thêm lớp'} onCancel={() => setSuaLop(null)} footer={null} destroyOnHidden>
        <Form layout="vertical" initialValues={suaLop ? { ...suaLop, don_gia: goiYDonGiaTuLop(suaLop), gio_thu: gioThuSua(suaLop) } : {}} onFinish={luuLop}>
          <Form.Item name="ten" label="Tên lớp" rules={[{ required: true, whitespace: true }]}><Input /></Form.Item>
          <Form.Item name="don_gia" label="Đơn giá một buổi mặc định (đ)"
            extra="Tuỳ chọn — để trống nếu học phí tính riêng theo từng học sinh.">
            <InputNumber<number> {...O_TIEN} controls={false} inputMode="numeric" placeholder="Tuỳ chọn (vd: 150,000)" />
          </Form.Item>
          <Form.Item name="gio_thu" label="Lịch học trong tuần (giờ bắt đầu → kết thúc)" rules={[{
            validator: (_, v: GioThu = {}) => Object.values(v).every((g) => g.bd && g.kt && g.kt > g.bd) ? Promise.resolve()
              : Promise.reject(new Error('Thứ đã chọn phải có giờ bắt đầu và giờ kết thúc sau giờ bắt đầu')),
          }]}><LichTuan /></Form.Item>
          <Form.Item name="hoat_dong" label="Đang mở" valuePropName="checked"><Checkbox /></Form.Item>
          <Button type="primary" htmlType="submit" block loading={dangLuuLop}>Lưu</Button>
          {suaLop?.id && (
            <div className="ux u269-dg">
              <b>Vùng nguy hiểm</b>
              <div className="u269-dg-row">
                <span>Xoá lớp cùng toàn bộ buổi học, điểm danh và ảnh buổi.</span>
                <Button danger onClick={() => setLopCanXoa(suaLop)}>Xoá lớp</Button>
              </div>
            </div>
          )}
        </Form>
      </Modal>

      {lopThemHs && (
        <ThemHsVaoLopModal
          lop={lopThemHs} hs={hs} gds={gds} url={url} tenCacLop={tenCacLop}
          onCancel={() => setLopThemHs(null)}
          onDone={() => { setLopThemHs(null); tai().catch((e) => message.error((e as Error).message)) }}
          onDongBo={() => { tai().catch((e) => message.error((e as Error).message)) }}
          onTaoMoi={() => { const l = lopThemHs; setLopThemHs(null); moThemHs(l) }}
        />
      )}

      {hsSticker && <CongTruSticker hs={hsSticker} tong={tong[hsSticker.id] ?? 0} dong={(daLuu) => {
        setHsSticker(null)
        if (daLuu) taiTongSticker().then(setTong).catch((e) => message.error(`Đã lưu nhưng chưa tải lại được tổng: ${e.message}`))
      }} />}

      <Modal open={!!suaHs} title={suaHs?.id ? `Sửa học sinh (${suaHs.ma_hs})` : 'Thêm học sinh'} onCancel={() => setSuaHs(null)} footer={null} destroyOnHidden>
        <Form form={formHs} layout="vertical" onFinish={luuHs}>
          {/* Đặt Các lớp học lên trước Họ tên để dropdown AutoComplete mở xuống không che mất ô chọn lớp */}
          <Form.Item name="lop_ids"
            label={khoaHoSo ? 'Các lớp học (chọn ít nhất 1 lớp để gộp)' : 'Các lớp học (không bắt buộc — có thể xếp lớp sau)'}
            rules={[{
              validator: (_, ids?: string[]) => {
                const loiGop = kiemTraGopLopVaoEm(khoaHoSo, ids ?? [])
                return loiGop ? Promise.reject(new Error(loiGop)) : Promise.resolve()
              },
            }]}>
            <Select mode="multiple" allowClear placeholder={lops.length ? 'Chọn một hoặc nhiều lớp, hoặc để trống' : 'Chưa có lớp nào — sẽ lưu ở mục Chưa xếp lớp'}
              options={lops.map((l) => ({ value: l.id, label: l.don_gia > 0 ? `${l.ten} (${vnd(l.don_gia)})` : l.ten }))}
              onChange={(ids: string[]) => {
                if (!suaHs?.id && !emDaChon && formHs.getFieldValue('don_gia') == null && ids.length > 0) {
                  const g = goiYDonGiaTuLop(lops.find((l) => l.id === ids[0]))
                  if (g != null) formHs.setFieldValue('don_gia', g)
                }
              }} />
          </Form.Item>
          {suaHs?.id && (
            <Form.Item noStyle shouldUpdate={(a, b) => a.lop_ids !== b.lop_ids}>{({ getFieldValue }) => {
              const ids: string[] = getFieldValue('lop_ids') ?? []
              const cu = lopCuaHs(gds, suaHs.id!).map((x) => x.lop_id)
              if (!ids.some((id) => !cu.includes(id))) return null
              return (
                <Form.Item name="ngay_vao_lop_moi" label="Ngày vào lớp mới thêm" initialValue={dayjs()} rules={[{ required: true }]}>
                  <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                </Form.Item>
              )
            }}</Form.Item>
          )}
          {suaHs?.id ? (
            <Form.Item name="ho_ten" label="Họ tên" rules={[{ required: true, whitespace: true }]}><Input /></Form.Item>
          ) : (
            <Form.Item noStyle shouldUpdate={(a, b) => a.ho_ten !== b.ho_ten}>{({ getFieldValue }) => {
              const tenDangGo = String(getFieldValue('ho_ten') ?? '')
              const { ketQua: goiY, tong: tongGoiY, biCat } = locGoiYHocSinh(hs, tenDangGo)
              const laMoi = tenDangGo.trim().length > 0 && !emDaChon
              return (
                <Form.Item name="ho_ten" label="Họ tên" rules={[{ required: true, whitespace: true }]}
                  getValueFromEvent={(val: string) => hsMap.get(val)?.ho_ten ?? val}
                  extra={emDaChon
                    ? <span>Đang chọn học sinh sẵn có <b>{emDaChon.ho_ten}</b> ({emDaChon.ma_hs}) · <Button type="link" size="small" style={{ padding: 0, height: 'auto' }} onClick={boChonEm}>Bỏ chọn · Đổi sang tạo mới</Button></span>
                    : biCat
                      ? `Đang gợi ý ${goiY.length}/${tongGoiY} học sinh — gõ thêm tên, mã HS hoặc SĐT để thu hẹp, hoặc nhập tên mới.`
                      : laMoi ? 'Không chọn từ danh sách → sẽ tạo hồ sơ học sinh mới.' : 'Nhập tên học sinh mới, hoặc chọn học sinh sẵn có để gộp lớp.'}>
                  <AutoComplete
                    listHeight={220}
                    popupRender={(menu) => (
                      <>
                        {menu}
                        {biCat && (
                          <div style={{ padding: '6px 12px', fontSize: 12, color: MAU.chuPhu, borderTop: `1px solid ${MAU.vien}` }}>
                            Đang hiện {goiY.length}/{tongGoiY} kết quả — gõ thêm tên, mã HS hoặc SĐT để thu hẹp
                          </div>
                        )}
                      </>
                    )}
                    options={goiY.map((x) => ({
                      value: x.id,
                      label: (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                          <Avatar shape="square" size={28} src={x.avatar && url[x.avatar]} style={{ flexShrink: 0 }}>
                            {x.ho_ten.split(' ').pop()?.[0]}
                          </Avatar>
                          <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{x.ho_ten}</span>
                              <Tag style={{ marginInlineEnd: 0, flexShrink: 0 }}>{x.ma_hs}</Tag>
                            </div>
                            <div style={{ fontSize: 12, color: MAU.chuPhu, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {[tenCacLop(x.id) || 'Chưa xếp lớp', vnd(x.don_gia), x.sdt_phu_huynh].filter(Boolean).join(' · ')}
                            </div>
                          </div>
                        </div>
                      ),
                    }))}
                    onSearch={(val) => {
                      if (emDaChon && val !== emDaChon.ho_ten) boChonEm()
                    }}
                    onSelect={(id: string) => {
                      const em = hsMap.get(id)
                      if (!em) return
                      setEmDaChon(em)
                      const lopHienTai: string[] = formHs.getFieldValue('lop_ids') ?? []
                      const giaCu = Object.fromEntries(lopCuaHs(gds, em.id).filter((g) => g.don_gia_rieng != null).map((g) => [g.lop_id, g.don_gia_rieng]))
                      const giaHienTai: Record<string, number | null | undefined> = formHs.getFieldValue('gia_rieng') ?? {}
                      formHs.setFieldsValue({
                        ho_ten: em.ho_ten,
                        don_gia: em.don_gia,
                        ten_phu_huynh: em.ten_phu_huynh ?? undefined,
                        sdt_phu_huynh: em.sdt_phu_huynh ?? undefined,
                        sticker_dau_ky: em.sticker_dau_ky,
                        ghi_chu: em.ghi_chu ?? undefined,
                        lop_ids: lopHienTai,
                        gia_rieng: { ...giaCu, ...giaHienTai },
                      })
                    }}>
                    <Input placeholder="Nhập tên học sinh..."
                      suffix={emDaChon
                        ? <Tag color="blue" closable style={{ marginInlineEnd: 0 }} onClose={(e) => { e.preventDefault(); boChonEm() }}>{emDaChon.ma_hs}</Tag>
                        : laMoi ? <Tag color="green" style={{ marginInlineEnd: 0 }}>Mới</Tag> : undefined} />
                  </AutoComplete>
                </Form.Item>
              )
            }}</Form.Item>
          )}
          {khoaHoSo && (
            <Alert type="info" showIcon style={{ marginBottom: 12 }}
              title="Đang gộp lớp vào hồ sơ sẵn có"
              description="6 mục hồ sơ bên dưới giữ theo hồ sơ cũ (chỉ lưu lớp mới, giá riêng và ngày vào lớp). Muốn sửa thông tin cá nhân hãy bấm Sửa ở danh sách, hoặc Bỏ chọn để tạo mới." />
          )}
          <Form.Item noStyle shouldUpdate={(a, b) => a.don_gia !== b.don_gia}>{({ getFieldValue }) => (
            <Form.Item name="don_gia" label="Đơn giá/buổi cố định của học sinh (đ)" rules={[{ required: true, message: 'Nhập đơn giá/buổi' }]}
              extra={khoaHoSo ? 'Giữ theo hồ sơ sẵn có.' : getFieldValue('don_gia') === 0 ? <span style={{ color: MAU.do }}>0 = em học miễn phí.</span> : undefined}>
              <InputNumber<number> {...O_TIEN} controls={false} inputMode="numeric" placeholder="Ví dụ: 150,000" disabled={khoaHoSo} />
            </Form.Item>
          )}</Form.Item>
          <Form.Item noStyle shouldUpdate={(a, b) => a.lop_ids !== b.lop_ids || a.gia_rieng !== b.gia_rieng}>{({ getFieldValue }) => {
            const ids: string[] = getFieldValue('lop_ids') ?? []
            const giaMap: Record<string, unknown> = getFieldValue('gia_rieng') ?? {}
            const lopCuIds = !suaHs?.id && emDaChon ? lopCuaHs(gds, emDaChon.id).map((g) => g.lop_id) : []
            if (!coCanHienGiaRieng(ids, lopCuIds, giaMap)) return null
            return ids.map((id) => {
              const l = lopMap.get(id)
              if (!l) return null
              return (
                <Form.Item key={id} name={['gia_rieng', id]} label={`Giá riêng lớp ${l.ten} (trống = theo giá học sinh)`}>
                  <InputNumber<number> {...O_TIEN} controls={false} inputMode="numeric" placeholder="Theo giá học sinh" />
                </Form.Item>
              )
            })
          }}</Form.Item>
          <Form.Item name="anh" label="Ảnh đại diện" valuePropName="file" getValueFromEvent={(e) => (e?.file?.status === 'removed' ? undefined : e?.file)}>
            <Upload accept="image/*" maxCount={1} beforeUpload={() => false} listType="picture" disabled={khoaHoSo}>
              <Button disabled={khoaHoSo}>Chụp / chọn ảnh</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="ten_phu_huynh" label="Tên phụ huynh"><Input disabled={khoaHoSo} /></Form.Item>
          <Form.Item name="sdt_phu_huynh" label="SĐT phụ huynh (để liên hệ & phân biệt học sinh trùng tên)"><Input inputMode="tel" disabled={khoaHoSo} /></Form.Item>
          <Form.Item name="ngay_vao_d" label="Ngày vào học" rules={[{ required: true }]}><DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="sticker_dau_ky" label="Sticker đã có từ trước (sổ giấy)"><InputNumber<number> min={0} precision={0} style={{ width: '100%' }} disabled={khoaHoSo} /></Form.Item>
          <Form.Item name="ghi_chu" label="Ghi chú"><Input.TextArea rows={2} disabled={khoaHoSo} /></Form.Item>
          <Button type="primary" htmlType="submit" block loading={dangLuuHs}>Lưu</Button>
        </Form>
      </Modal>

      {trungHoi && <TrungTenModal ungVien={trungHoi.ungVien} tenCacLop={tenCacLop}
        coLop={(trungHoi.v.lop_ids?.length ?? 0) > 0}
        onCancel={() => setTrungHoi(null)}
        onGop={(em) => gopLopVaoEm(em, trungHoi.v.lop_ids ?? [], trungHoi.v.ngay_vao_d.format('YYYY-MM-DD'), trungHoi.v.gia_rieng).catch((e) => message.error((e as Error).message))}
        onTaoMoi={() => taoHocSinhMoi(trungHoi.v).catch((e) => message.error((e as Error).message))} />}

      {moGop && <GopHocSinhModal hs={hs} gds={gds} lops={lops} tong={tong}
        onCancel={() => setMoGop(false)} onDone={() => { setMoGop(false); tai() }} />}

      <HopThoaiXoa
        open={!!goHsLop}
        title={goHsLop ? `Gỡ ${goHsLop.h.ho_ten} khỏi lớp ${goHsLop.tenLop}?` : ''}
        description="Hồ sơ học sinh & lịch sử học phí vẫn giữ ở mục Học sinh."
        okText="Gỡ khỏi lớp"
        cancelText="Thôi"
        onCancel={() => setGoHsLop(null)}
        onConfirm={() => goKhoiLop(goHsLop!.h, goHsLop!.gd)}
      />

      <HopThoaiXoa
        open={!!xoaHs}
        title={xoaHs ? `Xoá hẳn hồ sơ ${xoaHs.ho_ten} (${xoaHs.ma_hs})?` : ''}
        description="Chỉ xoá được học sinh nhập nhầm, chưa có điểm danh hay phiếu thu."
        okText="Xoá hẳn"
        cancelText="Thôi"
        onCancel={() => setXoaHs(null)}
        onConfirm={() => xoaHoSoHs(xoaHs!)}
      />

      <HopThoaiXoa
        open={!!xacNhanBoLop}
        title={xacNhanBoLop ? `Gỡ ${xacNhanBoLop.tenHs} khỏi ${xacNhanBoLop.soLop} lớp?` : ''}
        description={xacNhanBoLop ? `Sẽ gỡ khỏi lớp: ${xacNhanBoLop.tenBo} (hồ sơ học sinh vẫn được giữ nguyên). Muốn giữ lịch sử nghỉ học hãy dùng nút "Ngừng" ở danh sách lớp.` : undefined}
        okText="Gỡ khỏi lớp"
        cancelText="Quay lại"
        onCancel={() => {
          xacNhanBoLop?.resolve(false)
          setXacNhanBoLop(null)
        }}
        onConfirm={() => {
          xacNhanBoLop?.resolve(true)
        }}
      />

      <HopThoaiXoaXacNhanTen
        open={!!lopCanXoa}
        title={`Xoá hẳn lớp ${lopCanXoa?.ten ?? ''}?`}
        tenCanGo={lopCanXoa?.ten ?? ''}
        nhanOInput="Gõ lại tên lớp"
        placeholder="Gõ lại tên lớp để xác nhận"
        okText="Xoá lớp"
        cancelText="Thôi"
        description={(() => {
          const soHsLop = gds.filter((g) => g.lop_id === lopCanXoa?.id).length
          return <>Xoá lớp cùng toàn bộ buổi học, điểm danh và ảnh buổi của lớp.{soHsLop > 0 ? ` Toàn bộ hồ sơ, gói học và lịch sử thu tiền của ${soHsLop} học sinh vẫn được giữ nguyên ở mục Học sinh (các em không còn lớp nào sẽ chuyển về "Chưa xếp lớp").` : ''} Lớp có dữ liệu ở tháng đã chốt sổ thì phải mở khoá tháng đó trước.</>
        })()}
        onCancel={() => setLopCanXoa(null)}
        onConfirm={async () => {
          if (!lopCanXoa?.id || !lopCanXoa.ten) return
          try {
            const anh = await q(sb.rpc('xoa_lop', { p_lop: lopCanXoa.id, p_ten: lopCanXoa.ten })) as string[]
            if (anh.length) await sb.storage.from('anh').remove(anh)
            const msg = `Đã xoá lớp ${lopCanXoa.ten}`
            message.success(msg)
            setThongBaoXoa(msg)
            setLopCanXoa(null)
            setSuaLop(null)
            tai()
          } catch (e) { message.error((e as Error).message) }
        }}
      />

      <ThongBaoThanhTienDo text={thongBaoXoa} onDone={() => setThongBaoXoa(null)} />
    </Space>
  )
}

function ThemHsVaoLopModal({ lop, hs, gds, url, tenCacLop, onCancel, onDone, onDongBo, onTaoMoi }: {
  lop: Lop; hs: HocSinh[]; gds: GhiDanh[]; url: Record<string, string>; tenCacLop: (id: string) => string
  onCancel: () => void; onDone: () => void; onDongBo: () => void; onTaoMoi: () => void
}) {
  const { message } = App.useApp()
  const [chonIds, setChonIds] = useState<string[]>([])
  const [tim, setTim] = useState('')
  const [loc, setLoc] = useState<'tat_ca' | 'chua_xep'>('tat_ca')
  const [ngayVao, setNgayVao] = useState<dayjs.Dayjs>(dayjs())

  const ungVien = dsHocSinhCoTheThemVaoLop(hs, gds, lop.id)
  const soChuaXep = ungVien.filter((x) => x.chuaXep).length
  const dsLoc = loc === 'chua_xep' ? ungVien.filter((x) => x.chuaXep) : ungVien
  const khopIds = new Set(locHocSinh(dsLoc.map((x) => x.h), tim).map((h) => h.id))
  const dsHien = dsLoc.filter((x) => khopIds.has(x.h.id))

  const doiChon = (id: string) => {
    setChonIds((cu) => (cu.includes(id) ? cu.filter((x) => x !== id) : [...cu, id]))
  }

  const [luu, dangLuu] = useMotLan(async () => {
    if (!chonIds.length) return
    const ngay = ngayVao.format('YYYY-MM-DD')
    const tungHocSet = new Set(ungVien.filter((x) => x.tungHoc).map((x) => x.h.id))
    const kq = await thucHienThemHsVaoLop(chonIds, tungHocSet, ngay, {
      themGhiDanh: (hsIds) => q(sb.from('ghi_danh').insert(hsIds.map((hoc_sinh_id) => ({
        hoc_sinh_id, lop_id: lop.id, ngay_vao: ngay,
      })))).then(() => undefined),
      batLaiGhiDanh: (hoc_sinh_id, payload) => q(sb.from('ghi_danh').update(payload)
        .eq('hoc_sinh_id', hoc_sinh_id).eq('lop_id', lop.id)).then(() => undefined),
      datDangHoc: (hsIds) => q(sb.from('hoc_sinh').update({ trang_thai: 'dang_hoc' }).in('id', hsIds)).then(() => undefined),
    })
    if (kq.loi) {
      message.error(kq.loi)
      if (kq.daGhi) {
        setChonIds((cu) => cu.filter((id) => !kq.daThemIds.includes(id)))
        onDongBo()
      }
      return
    }
    message.success(`Đã thêm ${chonIds.length} học sinh vào lớp ${lop.ten}`)
    onDone()
  })

  return (
    <Modal open title={`Thêm học sinh vào lớp ${lop.ten}`} onCancel={dangLuu ? undefined : onCancel} width={540}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <Button icon={<PlusOutlined />} onClick={onTaoMoi} disabled={dangLuu}>Tạo học sinh mới</Button>
          <Space>
            <Button onClick={onCancel} disabled={dangLuu}>Huỷ</Button>
            <Button type="primary" loading={dangLuu} disabled={!chonIds.length} onClick={() => luu()}>
              Thêm {chonIds.length > 0 ? `${chonIds.length} HS` : ''} vào lớp
            </Button>
          </Space>
        </div>
      }>
      <Space direction="vertical" style={{ width: '100%' }} size={10}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <Segmented value={loc} onChange={(v) => setLoc(v as 'tat_ca' | 'chua_xep')} options={[
            { value: 'tat_ca', label: `Tất cả (${ungVien.length})` },
            { value: 'chua_xep', label: `Chưa xếp lớp (${soChuaXep})` },
          ]} />
          <Space size={8}>
            <span style={{ fontSize: 13, color: MAU.chuPhu }}>Ngày vào:</span>
            <DatePicker format="DD/MM/YYYY" allowClear={false} value={ngayVao} onChange={(d) => d && setNgayVao(d)} style={{ width: 130 }} />
            <HuyHieuDem count={chonIds.length} />
          </Space>
        </div>
        <OChiTimKiem value={tim} onChange={setTim} placeholder="Tìm tên, mã HS hoặc SĐT để chọn nhanh" ariaLabel="Tìm học sinh để thêm vào lớp" />
        <div style={{ maxHeight: 340, overflowY: 'auto', border: `1px solid ${MAU.vien}`, borderRadius: 12 }}>
          {dsHien.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={ungVien.length === 0 ? 'Tất cả học sinh đã ở trong lớp này' : 'Không tìm thấy học sinh phù hợp'} style={{ margin: '20px 0' }} />
          ) : (
            <List dataSource={dsHien} renderItem={({ h, chuaXep, tungHoc, donGiaRiengCu }, idx) => {
              const daChon = chonIds.includes(h.id)
              const ghiChuGia = tungHoc && donGiaRiengCu != null && donGiaRiengCu !== h.don_gia
                ? `giá cũ lớp này ${vnd(donGiaRiengCu)} → áp giá HS ${vnd(h.don_gia)}/buổi`
                : `${vnd(h.don_gia)}/buổi`
              return (
                <List.Item
                  className="u300-rw"
                  style={{ cursor: 'pointer', padding: '10px 12px', background: daChon ? MAU.chinhNhat : undefined, animationDelay: `${Math.min(idx, 10) * 0.03}s` }}
                  onClick={() => doiChon(h.id)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', minWidth: 0 }}>
                    <Checkbox checked={daChon} onClick={(e) => e.stopPropagation()} onChange={() => doiChon(h.id)} />
                    <Avatar shape="square" size={36} src={h.avatar && url[h.avatar]} style={{ flexShrink: 0 }}>
                      {h.ho_ten.split(' ').pop()?.[0]}
                    </Avatar>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <Space wrap size={4}>
                        <span style={{ fontWeight: 500 }}>{h.ho_ten}</span>
                        <Tag style={{ marginInlineEnd: 0 }}>{h.ma_hs}</Tag>
                        {chuaXep && <Tag color="orange" style={{ marginInlineEnd: 0 }}>Chưa xếp lớp</Tag>}
                        {tungHoc && <Tag color="default" style={{ marginInlineEnd: 0 }}>Từng học lớp này</Tag>}
                      </Space>
                      <div style={{ fontSize: 12, color: MAU.chuPhu, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {[chuaXep ? '' : tenCacLop(h.id), ghiChuGia, h.sdt_phu_huynh].filter(Boolean).join(' · ')}
                      </div>
                    </div>
                    <NutChonNhanh selected={daChon} onToggle={() => doiChon(h.id)} itemLabel={h.ho_ten} />
                  </div>
                </List.Item>
              )
            }} />
          )}
        </div>
      </Space>
    </Modal>
  )
}

function TrungTenModal({ ungVien, tenCacLop, coLop, onCancel, onGop, onTaoMoi }: {
  ungVien: HocSinh[]; tenCacLop: (id: string) => string; coLop: boolean; onCancel: () => void; onGop: (em: HocSinh) => Promise<unknown>; onTaoMoi: () => Promise<unknown>
}) {
  const [chon, setChon] = useState(ungVien[0].id)
  const [hanhDong, setHanhDong] = useState<'gop' | 'tao' | null>(null)
  // Dùng chung một useMotLan để bấm đúp hoặc bấm chéo 2 nút lúc đang lưu không tạo trùng hồ sơ
  const [thucHien, dangXuLy] = useMotLan(async (loai: 'gop' | 'tao', fn: () => Promise<unknown>) => {
    setHanhDong(loai)
    try { await fn() } finally { setHanhDong(null) }
  })
  const emChon = ungVien.find((x) => x.id === chon) ?? ungVien[0]
  return (
    <Modal open title={`Đã có học sinh tên "${ungVien[0].ho_ten}"`} onCancel={dangXuLy ? undefined : onCancel}
      footer={<Space wrap>
        <Button onClick={onCancel} disabled={dangXuLy}>Thôi</Button>
        <Button type={coLop ? 'default' : 'primary'} loading={hanhDong === 'tao'} disabled={dangXuLy && hanhDong !== 'tao'} onClick={() => thucHien('tao', onTaoMoi)}>
          {coLop ? 'Tạo học sinh mới khác người' : 'Vẫn tạo học sinh mới khác người'}
        </Button>
        {coLop && (
          <Button type="primary" loading={hanhDong === 'gop'} disabled={dangXuLy && hanhDong !== 'gop'} onClick={() => thucHien('gop', () => onGop(emChon))}>
            Gộp vào {emChon.ma_hs}
          </Button>
        )}
      </Space>}>
      <p>{coLop
        ? 'Nếu đây là cùng một em học thêm lớp mới, hãy gộp vào hồ sơ sẵn có thay vì tạo thành 2 học sinh khác nhau:'
        : 'Trung tâm đã có hồ sơ trùng tên bên dưới. Hãy kiểm tra trước khi tạo hồ sơ mới để tránh trùng lặp:'}</p>
      <Select style={{ width: '100%' }} value={chon} onChange={setChon} options={ungVien.map((x) => ({
        value: x.id,
        label: `${x.ho_ten} (${x.ma_hs}) · ${tenCacLop(x.id) || 'Chưa xếp lớp'}${x.sdt_phu_huynh ? ` · ${x.sdt_phu_huynh}` : ''}`,
      }))} />
    </Modal>
  )
}

function GopHocSinhModal({ hs, gds, lops, tong, onCancel, onDone }: {
  hs: HocSinh[]; gds: GhiDanh[]; lops: Lop[]; tong: Record<string, number>; onCancel: () => void; onDone: () => void
}) {
  const { message } = App.useApp()
  const [giuId, setGiuId] = useState<string>()
  const [boId, setBoId] = useState<string>()
  const lopMap = new Map(lops.map((l) => [l.id, l.ten]))
  const tenLopCua = (hsId: string) => lopCuaHs(gds, hsId).map((g) => lopMap.get(g.lop_id)).filter(Boolean).join(', ')

  // tự gợi ý các nhóm trùng họ tên đang tồn tại trong dữ liệu
  const nhomTrung = Object.values(hs.reduce<Record<string, HocSinh[]>>((acc, h) => {
    const k = khoa(h.ho_ten); (acc[k] ??= []).push(h); return acc
  }, {})).filter((nh) => nh.length > 1)

  const giu = hs.find((h) => h.id === giuId)
  const bo = hs.find((h) => h.id === boId)
  const lopSauGop = giu && bo ? [...new Set([...lopCuaHs(gds, giu.id), ...lopCuaHs(gds, bo.id)].map((g) => lopMap.get(g.lop_id)).filter(Boolean))] : []

  const [gop, dangGop] = useMotLan(async () => {
    if (!giuId || !boId) return
    try {
      const anhThua = await q(sb.rpc('gop_hoc_sinh', { p_giu: giuId, p_bo: boId })) as string | null
      if (anhThua) await sb.storage.from('anh').remove([anhThua])
      message.success(`Đã gộp ${bo?.ho_ten} (${bo?.ma_hs}) vào ${giu?.ma_hs}`)
      onDone()
    } catch (e) { message.error((e as Error).message) }
  })

  const opts = hs.map((h) => ({
    value: h.id,
    label: `${h.ho_ten} (${h.ma_hs}) · ${tenLopCua(h.id) || 'Chưa xếp lớp'} · ${vnd(h.don_gia)}${h.sdt_phu_huynh ? ` · ${h.sdt_phu_huynh}` : ''}`,
  }))

  return (
    <Modal open title="Gộp 2 hồ sơ học sinh trùng thành 1" onCancel={onCancel}
      okText="Xác nhận gộp" okButtonProps={{ danger: true, disabled: !giuId || !boId || giuId === boId }}
      confirmLoading={dangGop} onOk={() => gop()}>
      <Space direction="vertical" style={{ width: '100%' }}>
        {nhomTrung.length > 0 && (
          <Alert type="info" showIcon title={`Phát hiện ${nhomTrung.length} tên có từ 2 hồ sơ trở lên (bấm để chọn nhanh)`}
            description={<div style={{ maxHeight: 160, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {nhomTrung.map((nh) => (
                <Button key={nh[0].id} size="small" style={{ height: 'auto', textAlign: 'left', whiteSpace: 'normal', padding: '4px 8px' }}
                  onClick={() => { setGiuId(nh[0].id); setBoId(nh[1].id) }}>
                  {nh[0].ho_ten}: {nh.map((x) => `${x.ma_hs} (${tenLopCua(x.id) || 'Chưa xếp lớp'})`).join(' + ')}
                </Button>
              ))}
            </div>} />
        )}
        <div>
          <div style={{ marginBottom: 4, fontWeight: 500 }}>Học sinh giữ lại (hồ sơ chính)</div>
          <Select showSearch optionFilterProp="label" placeholder="Chọn hồ sơ chính" style={{ width: '100%' }}
            value={giuId} onChange={(v) => { setGiuId(v); if (v === boId) setBoId(undefined) }} options={opts} />
        </div>
        <div>
          <div style={{ marginBottom: 4, fontWeight: 500 }}>Học sinh gộp vào (sẽ xoá sau khi chuyển hết dữ liệu)</div>
          <Select showSearch optionFilterProp="label" placeholder="Chọn hồ sơ cần gộp" style={{ width: '100%' }}
            value={boId} onChange={setBoId} options={opts.filter((o) => o.value !== giuId)} />
        </div>
        {giu && bo && (
          <div style={{ padding: 10, borderRadius: 6, background: MAU.nen, border: `1px solid ${MAU.vien}`, fontSize: 13 }}>
            <div><b>Sau khi gộp:</b> {giu.ho_ten} ({giu.ma_hs})</div>
            <div>Các lớp: {lopSauGop.join(', ') || 'Chưa xếp lớp'}</div>
            <div>Đơn giá giữ lại: <b>{vnd(giu.don_gia)}/buổi</b>{giu.don_gia !== bo.don_gia && <span style={{ color: MAU.do }}> (hồ sơ bị gộp đang là {vnd(bo.don_gia)})</span>}</div>
            <div>Tổng sticker dự kiến: <b>⭐ {(tong[giu.id] ?? 0) + (tong[bo.id] ?? 0)}</b></div>
          </div>
        )}
      </Space>
    </Modal>
  )
}

// Thứ có trong lịch mà chưa có giờ (lớp cũ ghi giờ bằng chữ) vẫn hiện là đã chọn, để form bắt nhập giờ thay vì làm mất lịch.
const gioThuSua = (l: Partial<Lop>): GioThu =>
  Object.fromEntries((l.lich ?? []).map((t) => [t, l.gio_thu?.[t] ?? { bd: '', kt: '' }]))

/** 7 dòng T2…CN: tick thứ có học, nhập giờ bằng ô giờ gốc của trình duyệt (điện thoại hiện bánh xe chọn giờ). */
function LichTuan({ value = {}, onChange }: { value?: GioThu; onChange?: (v: GioThu) => void }) {
  const [gan, setGan] = useState<{ bd: string; kt: string }>()
  const doi = (t: number, g?: { bd: string; kt: string }) => {
    const v = { ...value }
    if (g) v[t] = g; else delete v[t]
    onChange?.(v)
  }
  const sua = (t: number, g: { bd: string; kt: string }) => { setGan(g); doi(t, g) }
  return (
    <div>
      {[1, 2, 3, 4, 5, 6, 0].map((t) => {
        const g = value[t]
        return (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Checkbox checked={!!g} style={{ width: 52 }}
              onChange={(e) => doi(t, e.target.checked ? (gan ?? Object.values(value).find((x) => x.bd) ?? { bd: '', kt: '' }) : undefined)}>
              {THU[t]}
            </Checkbox>
            {g && <>
              <Input type="time" aria-label={`${THU[t]} bắt đầu`} value={g.bd} style={{ width: 120 }}
                onChange={(e) => sua(t, { bd: e.target.value, kt: g.kt || (e.target.value ? cong2Gio(e.target.value) : '') })} />
              <span>→</span>
              <Input type="time" aria-label={`${THU[t]} kết thúc`} value={g.kt} style={{ width: 120 }}
                onChange={(e) => sua(t, { ...g, kt: e.target.value })} />
            </>}
          </div>
        )
      })}
    </div>
  )
}

const DOI_QUA = 'Đổi quà'

function CongTruSticker({ hs, tong, dong }: { hs: HocSinh; tong: number; dong: (daLuu: boolean) => void }) {
  const { message } = App.useApp()
  const [chieu, setChieu] = useState<'cong' | 'tru'>('tru')
  const [soLuong, setSoLuong] = useState<number | null>(null)
  const [lyDo, setLyDo] = useState(DOI_QUA)
  const [baoLoi, setBaoLoi] = useState(false)
  const n = soLuong ?? 0
  const moi = tong + (chieu === 'cong' ? n : -n)
  const thieuLyDo = chieu === 'tru' && !lyDo.trim()
  const doiChieu = (c: 'cong' | 'tru') => {
    setChieu(c)
    if (c === 'cong' && lyDo === DOI_QUA) setLyDo('')
    if (c === 'tru' && !lyDo.trim()) setLyDo(DOI_QUA)
  }
  const [luu, dangLuu] = useMotLan(async () => {
    if (!n || thieuLyDo) return setBaoLoi(true)
    try {
      await q(sb.from('sticker_cong_tru').insert({ hoc_sinh_id: hs.id, so: chieu === 'cong' ? n : -n, ly_do: lyDo.trim() || null }))
      message.success(`Đã ${chieu === 'cong' ? 'cộng' : 'trừ'} ${n} sticker`); dong(true)
    } catch (e) { message.error((e as Error).message) }
  })
  return (
    <Modal open onCancel={() => dong(false)} destroyOnHidden width={400}
      title={<div><div>{hs.ho_ten}</div><div style={{ fontWeight: 400, fontSize: 14, color: MAU.chuPhu }}>Đang có {tong} sticker</div></div>}
      footer={<Button block size="large" type="primary" loading={dangLuu} disabled={!n} onClick={() => luu()} style={{ height: 48, fontWeight: 600 }}>
        {n ? `${chieu === 'cong' ? 'Cộng' : 'Trừ'} ${n} sticker` : 'Nhập số sticker'}</Button>}>
      <Segmented block size="large" value={chieu} onChange={(v) => doiChieu(v as 'cong' | 'tru')}
        options={[{ value: 'tru', label: 'Trừ' }, { value: 'cong', label: 'Cộng' }]} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, margin: '24px 0 4px' }}>
        <Button shape="circle" size="large" aria-label="Bớt 1" icon={<MinusOutlined />} disabled={n <= 1} onClick={() => setSoLuong(Math.max(1, n - 1))} />
        <InputNumber<number> aria-label="Số sticker" autoFocus variant="borderless" min={1} precision={0} value={soLuong} onChange={setSoLuong}
          inputMode="numeric" placeholder="0" controls={false} style={{ width: 120 }} onPressEnter={() => luu()}
          styles={{ input: { textAlign: 'center', fontSize: 44, fontWeight: 700, lineHeight: 1.1, padding: 0 } }} />
        <Button shape="circle" size="large" aria-label="Thêm 1" icon={<PlusOutlined />} onClick={() => setSoLuong(n + 1)} />
      </div>
      <div style={{ textAlign: 'center', color: MAU.chuPhu, minHeight: 22 }} aria-live="polite">
        {n > 0 && <>Thành <b style={{ color: moi < 0 ? MAU.do : MAU.chu }}>{moi}</b> sticker{moi < 0 && <span style={{ color: MAU.do }}> (thiếu {-moi})</span>}</>}
      </div>
      <div style={{ marginTop: 20 }}>
        <label htmlFor="ly-do-sticker" style={{ display: 'block', marginBottom: 6, color: MAU.chuPhu, fontSize: 13 }}>
          Lý do{chieu === 'cong' && ' (không bắt buộc)'}</label>
        <Input id="ly-do-sticker" aria-label="Lý do" variant="filled" size="large" value={lyDo}
          onChange={(e) => { setLyDo(e.target.value); setBaoLoi(false) }} status={baoLoi && thieuLyDo ? 'error' : undefined} />
        {chieu === 'tru' && lyDo !== DOI_QUA && (
          <Button type="link" size="small" style={{ padding: 0, marginTop: 4 }} onClick={() => { setLyDo(DOI_QUA); setBaoLoi(false) }}>Dùng "{DOI_QUA}"</Button>)}
        {baoLoi && thieuLyDo && <div style={{ color: MAU.do, marginTop: 4, fontSize: 13 }}>Trừ sticker phải ghi lý do</div>}
      </div>
    </Modal>
  )
}
