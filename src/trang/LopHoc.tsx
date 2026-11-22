import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, App, Avatar, Button, Checkbox, Collapse, DatePicker, Form, Input, InputNumber, List, Modal, Popconfirm, Segmented, Select, Space, Tag, Upload } from 'antd'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useToi } from '../App'
import { giaGhiDanh, hsDangHoc, laQuanLy, lopCuaHs, q, sb, taiAnhLen, taiHet, taiTongSticker, THU, urlAnh, useMotLan, type GhiDanh, type HocSinh, type Lop } from '../supabase'
import { vnd } from '../hoc-phi'
import { cong2Gio, moTaLich, thieuGio, type GioThu } from '../gio-hoc'
import { khoa } from '../import-excel'
import { MAU, O_TIEN } from '../giao-dien'
import HocSinhChiTiet from './HocSinhChiTiet'

const khongDau = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase()

type FormHsGiaTri = HocSinh & { lop_ids: string[]; gia_rieng?: Record<string, number | null | undefined>; ngay_vao_d: dayjs.Dayjs; anh?: File }
const giaSo = (x: unknown): number | null => (typeof x === 'number' && !Number.isNaN(x) ? x : null)

export default function LopHoc() {
  const { message, modal } = App.useApp()
  const toi = useToi()
  const ql = laQuanLy(toi.vai_tro)
  const nav = useNavigate()
  const [lops, setLops] = useState<Lop[]>([])
  const [hs, setHs] = useState<HocSinh[]>([])
  const [gds, setGds] = useState<GhiDanh[]>([])
  const [url, setUrl] = useState<Record<string, string>>({})
  const [suaLop, setSuaLop] = useState<Partial<Lop> | null>(null)
  const [suaHs, setSuaHs] = useState<(Partial<HocSinh> & { lop_ids?: string[] }) | null>(null)
  const [trungHoi, setTrungHoi] = useState<{ ungVien: HocSinh[]; v: FormHsGiaTri } | null>(null)
  const [moGop, setMoGop] = useState(false)
  const [xem, setXem] = useState<HocSinh | null>(null)
  const [hienNgung, setHienNgung] = useState(false)
  // thu gọn mọi lớp khi mở trang (14 lớp mở cùng lúc rối mắt); tìm tên thì tự mở các lớp có em đó
  const [mo, setMo] = useState<string[]>([])
  const [tim, setTim] = useState('')
  const [tong, setTong] = useState<Record<string, number>>({})
  const [hsSticker, setHsSticker] = useState<HocSinh | null>(null)
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

  const [luuLop, dangLuuLop] = useMotLan(async (v: Lop) => {
    try {
      const gio_thu = v.gio_thu ?? {}
      const ban = { ten: v.ten.trim(), don_gia: v.don_gia, lich: Object.keys(gio_thu).map(Number), gio_thu, hoat_dong: v.hoat_dong ?? true }
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
        await q(sb.from('ghi_danh').update({ trang_thai: 'dang_hoc', ...(gr !== null ? { don_gia_rieng: gr } : {}) })
          .eq('hoc_sinh_id', em.id).eq('lop_id', lop_id))
      }
    }
    await q(sb.from('hoc_sinh').update({ trang_thai: 'dang_hoc' }).eq('id', em.id))
    setSuaHs(null); setTrungHoi(null)
    message.success(them.length || batLai.length ? `Đã gộp thêm lớp vào học sinh ${em.ho_ten} (${em.ma_hs})` : `${em.ho_ten} (${em.ma_hs}) đã có trong các lớp này`)
    tai()
  }

  const taoHocSinhMoi = async (v: FormHsGiaTri) => {
    const sdt = v.sdt_phu_huynh?.replace(/\D/g, '') || null
    const ngayVao = v.ngay_vao_d.format('YYYY-MM-DD')
    const ban = {
      ho_ten: v.ho_ten.trim(), don_gia: v.don_gia, ten_phu_huynh: v.ten_phu_huynh || null, sdt_phu_huynh: sdt,
      ngay_vao: ngayVao, ghi_chu: v.ghi_chu || null, sticker_dau_ky: v.sticker_dau_ky ?? 0,
    }
    const luu = await q(sb.from('hoc_sinh').insert(ban).select().single()) as HocSinh
    await q(sb.from('ghi_danh').insert(v.lop_ids.map((lop_id) => ({
      hoc_sinh_id: luu.id, lop_id, ngay_vao: ngayVao, don_gia_rieng: giaSo(v.gia_rieng?.[lop_id]),
    }))))
    setSuaHs(null); setTrungHoi(null); tai()
    if (v.anh) {
      try {
        const duong = await taiAnhLen(`avatar/${luu.id}-${Date.now()}.jpg`, v.anh, 400)
        await q(sb.from('hoc_sinh').update({ avatar: duong }).eq('id', luu.id)); tai()
      } catch (e) { message.error(`Đã lưu học sinh nhưng chưa tải được ảnh: ${(e as Error).message}`) }
    }
  }

  const [luuHs, dangLuuHs] = useMotLan(async (v: FormHsGiaTri) => {
    try {
      const sdt = v.sdt_phu_huynh?.replace(/\D/g, '') || null
      const ngayVao = v.ngay_vao_d.format('YYYY-MM-DD')
      if (suaHs?.id) {
        const ban = {
          ho_ten: v.ho_ten.trim(), don_gia: v.don_gia, ten_phu_huynh: v.ten_phu_huynh || null, sdt_phu_huynh: sdt,
          ngay_vao: ngayVao, ghi_chu: v.ghi_chu || null, sticker_dau_ky: v.sticker_dau_ky ?? 0,
        }
        await q(sb.from('hoc_sinh').update(ban).eq('id', suaHs.id))
        const cuGds = lopCuaHs(gds, suaHs.id)
        const cu = cuGds.map((x) => x.lop_id)
        const them = v.lop_ids.filter((id) => !cu.includes(id))
        const bo = cu.filter((id) => !v.lop_ids.includes(id))
        if (them.length) {
          await q(sb.from('ghi_danh').insert(them.map((lop_id) => ({
            hoc_sinh_id: suaHs.id!, lop_id, ngay_vao: ngayVao, don_gia_rieng: giaSo(v.gia_rieng?.[lop_id]),
          }))))
        }
        if (bo.length) await q(sb.from('ghi_danh').delete().eq('hoc_sinh_id', suaHs.id).in('lop_id', bo))
        for (const g of cuGds) {
          if (!v.lop_ids.includes(g.lop_id)) continue
          const gr = giaSo(v.gia_rieng?.[g.lop_id])
          if ((g.don_gia_rieng ?? null) !== gr) {
            await q(sb.from('ghi_danh').update({ don_gia_rieng: gr }).eq('id', g.id))
          }
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

      // Luồng thêm mới: trùng Họ tên + SĐT -> gộp luôn vào học sinh sẵn có; chỉ trùng Họ tên -> hỏi xác nhận
      const tenK = khoa(v.ho_ten)
      const trungChinhXac = sdt ? hs.find((x) => khoa(x.ho_ten) === tenK && x.sdt_phu_huynh === sdt) : undefined
      if (trungChinhXac) return await gopLopVaoEm(trungChinhXac, v.lop_ids, ngayVao, v.gia_rieng)

      const trungTen = hs.filter((x) => khoa(x.ho_ten) === tenK)
      if (trungTen.length > 0) {
        setTrungHoi({ ungVien: trungTen, v })
        return
      }
      await taoHocSinhMoi(v)
    } catch (e) { message.error((e as Error).message) }
  })

  const xoaLop = (l: Partial<Lop>) => {
    const dsGd = gds.filter((g) => g.lop_id === l.id)
    const chiLopNay = dsGd.filter((g) => lopCuaHs(gds, g.hoc_sinh_id).length === 1).length
    const conLopKhac = dsGd.length - chiLopNay
    const hop = modal.confirm({
      title: `Xoá hẳn lớp ${l.ten}?`, okText: 'Xoá hẳn', okButtonProps: { danger: true, disabled: true },
      content: <>
        <p>Xoá luôn {chiLopNay} học sinh chỉ học lớp này{conLopKhac > 0 ? ` (giữ nguyên hồ sơ ${conLopKhac} em còn học lớp khác)` : ''} cùng toàn bộ buổi học, điểm danh, ảnh của lớp. Không lấy
          lại được trong app (chỉ còn trong bản sao lưu đêm). Lớp có dữ liệu ở tháng đã chốt sổ thì phải mở khoá tháng đó trước.</p>
        <Input placeholder="Gõ lại tên lớp để xác nhận" aria-label="Gõ lại tên lớp"
          onChange={(e) => hop.update({ okButtonProps: { danger: true, disabled: e.target.value.trim() !== l.ten?.trim() } })} />
      </>,
      onOk: async () => {
        try {
          const anh = await q(sb.rpc('xoa_lop', { p_lop: l.id, p_ten: l.ten })) as string[]
          if (anh.length) await sb.storage.from('anh').remove(anh)
          message.success(`Đã xoá lớp ${l.ten}`); setSuaLop(null); tai()
        } catch (e) { message.error((e as Error).message) }
      },
    })
  }

  const doiTrangThai = async (h: HocSinh, gd: GhiDanh) => {
    try {
      const moi = gd.trang_thai === 'ngung' ? 'dang_hoc' : 'ngung'
      await q(sb.from('ghi_danh').update({ trang_thai: moi }).eq('id', gd.id))
      const conDangHoc = moi === 'dang_hoc' || gds.some((g) => g.hoc_sinh_id === h.id && g.id !== gd.id && g.trang_thai === 'dang_hoc')
      await q(sb.from('hoc_sinh').update({ trang_thai: conDangHoc ? 'dang_hoc' : 'ngung' }).eq('id', h.id))
    } catch (e) { return message.error((e as Error).message) }
    tai()
  }

  const xoaKhoiLop = async (h: HocSinh, gd: GhiDanh) => {
    try {
      const tatCaGd = lopCuaHs(gds, h.id)
      if (tatCaGd.length > 1) {
        await q(sb.from('ghi_danh').delete().eq('id', gd.id))
        const conDangHoc = tatCaGd.some((g) => g.id !== gd.id && g.trang_thai === 'dang_hoc')
        await q(sb.from('hoc_sinh').update({ trang_thai: conDangHoc ? 'dang_hoc' : 'ngung' }).eq('id', h.id))
        message.success(`Đã gỡ ${h.ho_ten} khỏi lớp này`)
        tai()
        return
      }
      // kiểm tra dữ liệu trước khi xoá ghi_danh cuối cùng để tránh làm mồ côi hoc_sinh nếu bảng con chặn xoá
      const [{ count: c1 }, { count: c2 }, { count: c3 }, { count: c4 }] = await Promise.all([
        sb.from('diem_danh').select('hoc_sinh_id', { count: 'exact', head: true }).eq('hoc_sinh_id', h.id),
        sb.from('goi_hoc').select('id', { count: 'exact', head: true }).eq('hoc_sinh_id', h.id),
        sb.from('sticker_cong_tru').select('id', { count: 'exact', head: true }).eq('hoc_sinh_id', h.id),
        sb.from('chi_phi').select('id', { count: 'exact', head: true }).eq('hoc_sinh_id', h.id),
      ])
      if ((c1 ?? 0) + (c2 ?? 0) + (c3 ?? 0) + (c4 ?? 0) > 0) {
        message.error('Học sinh đã có dữ liệu, chỉ chuyển sang "Ngừng học" được')
        return
      }
      await q(sb.from('ghi_danh').delete().eq('id', gd.id))
      await q(sb.from('hoc_sinh').delete().eq('id', h.id))
      if (h.avatar) await sb.storage.from('anh').remove([h.avatar])
      tai()
    } catch (e) { message.error((e as Error).message) }
  }

  const moThemHs = (lopMacDinh?: Lop) => {
    setSuaHs({ ngay_vao: dayjs().format('YYYY-MM-DD'), ...(lopMacDinh ? { lop_ids: [lopMacDinh.id], don_gia: lopMacDinh.don_gia } : { lop_ids: [] }) })
  }

  useEffect(() => {
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
    } as Partial<FormHsGiaTri>)
  }, [suaHs])

  if (xem) return <HocSinhChiTiet hs={xem} lops={lops} ghiDanh={gds} quayLai={() => { setXem(null); tai() }} />

  // tìm không dấu theo tên hoặc mã HS
  const timKhong = khongDau(tim.trim())
  const dsCuaLop = (lopId: string) => gds
    .filter((g) => g.lop_id === lopId && (hienNgung || g.trang_thai === 'dang_hoc'))
    .map((g) => ({ gd: g, h: hsMap.get(g.hoc_sinh_id)! }))
    .filter((x) => x.h && (!timKhong || khongDau(x.h.ho_ten).includes(timKhong) || khongDau(x.h.ma_hs).includes(timKhong)))
    .sort((a, b) => a.h.ho_ten.localeCompare(b.h.ho_ten))
  const lopTimThay = lops.filter((l) => dsCuaLop(l.id).length > 0)

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {ql && <Space wrap>
        <Button icon={<PlusOutlined />} onClick={() => setSuaLop({ lich: [], hoat_dong: true })}>Thêm lớp</Button>
        <Button icon={<PlusOutlined />} type="primary" disabled={!lops.length} onClick={() => moThemHs()}>Thêm học sinh</Button>
        <Button onClick={() => nav('/import')}>Import Excel</Button>
        <Button onClick={() => setMoGop(true)} disabled={hs.length < 2}>Gộp học sinh</Button>
        <Checkbox checked={hienNgung} onChange={(e) => setHienNgung(e.target.checked)}>Hiện học sinh đã ngừng học</Checkbox>
      </Space>}
      <Input.Search allowClear size="large" placeholder="Tìm tên hoặc mã học sinh" aria-label="Tìm tên học sinh" value={tim}
        onChange={(e) => setTim(e.target.value)} />
      <Collapse activeKey={timKhong ? lopTimThay.map((l) => l.id) : mo} onChange={(k) => { if (timKhong) return; setMo(k as string[]) }}
        items={(timKhong ? lopTimThay : lops).map((l) => {
        const ds = dsCuaLop(l.id)
        return {
          key: l.id,
          label: <Space wrap><b>{l.ten}</b>{l.lich.length > 0 && <span>{moTaLich(l)}</span>}{thieuGio(l) && <Tag color="red">Chưa có giờ</Tag>}
            {ql && <span>{vnd(l.don_gia)}/buổi</span>}<Tag>{ds.length} HS</Tag>{!l.hoat_dong && <Tag>Ngừng</Tag>}</Space>,
          extra: ql && <Space size="small" onClick={(e) => e.stopPropagation()}>
            <Button size="small" onClick={() => moThemHs(l)}>+ HS</Button>
            <Button size="small" onClick={() => setSuaLop(l)}>Sửa lớp</Button>
          </Space>,
          children: <List dataSource={ds} locale={{ emptyText: 'Chưa có học sinh' }} renderItem={({ gd, h }) => {
            const soLopKhac = lopCuaHs(gds, h.id, true).filter((x) => x.lop_id !== l.id).length
            const nhieuLop = lopCuaHs(gds, h.id).length > 1
            return (
              <List.Item style={{ cursor: 'pointer' }} onClick={() => setXem(h)} actions={ql ? [
                <a key="s" onClick={(e) => { e.stopPropagation(); setSuaHs(h) }}>Sửa</a>,
                <Popconfirm key="n" title={gd.trang_thai === 'ngung' ? 'Cho học lại lớp này?' : 'Chuyển sang ngừng học lớp này?'} onConfirm={() => doiTrangThai(h, gd)}>
                  <a onClick={(e) => e.stopPropagation()}>{gd.trang_thai === 'ngung' ? 'Học lại' : 'Ngừng'}</a></Popconfirm>,
                <Popconfirm key="x" title={nhieuLop ? `Gỡ ${h.ho_ten} khỏi lớp ${l.ten}? (Vẫn giữ hồ sơ ở lớp khác)` : 'Xoá hẳn? Chỉ xoá được học sinh nhập nhầm, chưa có dữ liệu.'}
                  onConfirm={() => xoaKhoiLop(h, gd)}>
                  <a style={{ color: 'red' }} onClick={(e) => e.stopPropagation()}>{nhieuLop ? 'Gỡ' : 'Xoá'}</a></Popconfirm>,
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

      <Modal open={!!suaLop} title={suaLop?.id ? 'Sửa lớp' : 'Thêm lớp'} onCancel={() => setSuaLop(null)} footer={null} destroyOnHidden>
        <Form layout="vertical" initialValues={suaLop ? { ...suaLop, gio_thu: gioThuSua(suaLop) } : {}} onFinish={luuLop}>
          <Form.Item name="ten" label="Tên lớp" rules={[{ required: true, whitespace: true }]}><Input /></Form.Item>
          <Form.Item name="don_gia" label="Đơn giá một buổi (đ)" rules={[{ required: true }]}>
            <InputNumber<number> {...O_TIEN} step={10000} />
          </Form.Item>
          <Form.Item name="gio_thu" label="Lịch học trong tuần (giờ bắt đầu → kết thúc)" rules={[{
            validator: (_, v: GioThu = {}) => Object.values(v).every((g) => g.bd && g.kt && g.kt > g.bd) ? Promise.resolve()
              : Promise.reject(new Error('Thứ đã chọn phải có giờ bắt đầu và giờ kết thúc sau giờ bắt đầu')),
          }]}><LichTuan /></Form.Item>
          <Form.Item name="hoat_dong" label="Đang mở" valuePropName="checked"><Checkbox /></Form.Item>
          <Button type="primary" htmlType="submit" block loading={dangLuuLop}>Lưu</Button>
          {suaLop?.id && <Button danger block style={{ marginTop: 8 }} onClick={() => xoaLop(suaLop)}>Xoá lớp</Button>}
        </Form>
      </Modal>

      {hsSticker && <CongTruSticker hs={hsSticker} tong={tong[hsSticker.id] ?? 0} dong={(daLuu) => {
        setHsSticker(null)
        if (daLuu) taiTongSticker().then(setTong).catch((e) => message.error(`Đã lưu nhưng chưa tải lại được tổng: ${e.message}`))
      }} />}

      <Modal open={!!suaHs} title={suaHs?.id ? `Sửa học sinh (${suaHs.ma_hs})` : 'Thêm học sinh'} onCancel={() => setSuaHs(null)} footer={null} destroyOnHidden>
        <Form form={formHs} layout="vertical" onFinish={luuHs}>
          <Form.Item name="ho_ten" label="Họ tên" rules={[{ required: true, whitespace: true }]}><Input /></Form.Item>
          <Form.Item name="lop_ids" label="Các lớp học" rules={[{ required: true, type: 'array', min: 1, message: 'Chọn ít nhất một lớp' }]}>
            <Select mode="multiple" placeholder="Chọn một hoặc nhiều lớp"
              options={lops.map((l) => ({ value: l.id, label: `${l.ten} (${vnd(l.don_gia)})` }))}
              onChange={(ids: string[]) => {
                if (!suaHs?.id && formHs.getFieldValue('don_gia') == null && ids.length > 0) {
                  const g = lops.find((l) => l.id === ids[0])?.don_gia
                  if (g != null) formHs.setFieldValue('don_gia', g)
                }
              }} />
          </Form.Item>
          <Form.Item noStyle shouldUpdate={(a, b) => a.don_gia !== b.don_gia}>{({ getFieldValue }) => (
            <Form.Item name="don_gia" label="Đơn giá/buổi cố định của học sinh (đ)" rules={[{ required: true, message: 'Nhập đơn giá/buổi' }]}
              extra={getFieldValue('don_gia') === 0 && <span style={{ color: MAU.do }}>0 = em học miễn phí.</span>}>
              <InputNumber<number> {...O_TIEN} step={10000} />
            </Form.Item>
          )}</Form.Item>
          <Form.Item noStyle shouldUpdate={(a, b) => a.lop_ids !== b.lop_ids || a.gia_rieng !== b.gia_rieng}>{({ getFieldValue }) => {
            const ids: string[] = getFieldValue('lop_ids') ?? []
            const giaMap: Record<string, unknown> = getFieldValue('gia_rieng') ?? {}
            const coGiaRieng = ids.some((id) => giaSo(giaMap[id]) !== null)
            if (ids.length < 2 && !coGiaRieng) return null
            return ids.map((id) => {
              const l = lopMap.get(id)
              if (!l) return null
              return (
                <Form.Item key={id} name={['gia_rieng', id]} label={`Giá riêng lớp ${l.ten} (trống = theo giá học sinh)`}>
                  <InputNumber<number> {...O_TIEN} step={10000} placeholder="Theo giá học sinh" />
                </Form.Item>
              )
            })
          }}</Form.Item>
          <Form.Item name="anh" label="Ảnh đại diện" valuePropName="file" getValueFromEvent={(e) => (e?.file?.status === 'removed' ? undefined : e?.file)}>
            <Upload accept="image/*" maxCount={1} beforeUpload={() => false} listType="picture"><Button>Chụp / chọn ảnh</Button></Upload>
          </Form.Item>
          <Form.Item name="ten_phu_huynh" label="Tên phụ huynh"><Input /></Form.Item>
          <Form.Item name="sdt_phu_huynh" label="SĐT phụ huynh (để liên hệ & phân biệt học sinh trùng tên)"><Input inputMode="tel" /></Form.Item>
          <Form.Item name="ngay_vao_d" label="Ngày vào học" rules={[{ required: true }]}><DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="sticker_dau_ky" label="Sticker đã có từ trước (sổ giấy)"><InputNumber<number> min={0} precision={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="ghi_chu" label="Ghi chú"><Input.TextArea rows={2} /></Form.Item>
          <Button type="primary" htmlType="submit" block loading={dangLuuHs}>Lưu</Button>
        </Form>
      </Modal>

      {trungHoi && <TrungTenModal ungVien={trungHoi.ungVien} tenCacLop={tenCacLop} onCancel={() => setTrungHoi(null)}
        onGop={(em) => gopLopVaoEm(em, trungHoi.v.lop_ids, trungHoi.v.ngay_vao_d.format('YYYY-MM-DD'), trungHoi.v.gia_rieng).catch((e) => message.error((e as Error).message))}
        onTaoMoi={() => taoHocSinhMoi(trungHoi.v).catch((e) => message.error((e as Error).message))} />}

      {moGop && <GopHocSinhModal hs={hs} gds={gds} lops={lops} tong={tong}
        onCancel={() => setMoGop(false)} onDone={() => { setMoGop(false); tai() }} />}
    </Space>
  )
}

function TrungTenModal({ ungVien, tenCacLop, onCancel, onGop, onTaoMoi }: {
  ungVien: HocSinh[]; tenCacLop: (id: string) => string; onCancel: () => void; onGop: (em: HocSinh) => void; onTaoMoi: () => void
}) {
  const [chon, setChon] = useState(ungVien[0].id)
  const emChon = ungVien.find((x) => x.id === chon) ?? ungVien[0]
  return (
    <Modal open title={`Đã có học sinh tên "${ungVien[0].ho_ten}"`} onCancel={onCancel}
      footer={<Space wrap>
        <Button onClick={onCancel}>Thôi</Button>
        <Button onClick={onTaoMoi}>Tạo học sinh mới khác người</Button>
        <Button type="primary" onClick={() => onGop(emChon)}>Gộp vào {emChon.ma_hs}</Button>
      </Space>}>
      <p>Nếu đây là cùng một em học thêm lớp mới, hãy gộp vào hồ sơ sẵn có thay vì tạo thành 2 học sinh khác nhau:</p>
      <Select style={{ width: '100%' }} value={chon} onChange={setChon} options={ungVien.map((x) => ({
        value: x.id,
        label: `${x.ho_ten} (${x.ma_hs}) · ${tenCacLop(x.id) || 'Chưa có lớp'}${x.sdt_phu_huynh ? ` · ${x.sdt_phu_huynh}` : ''}`,
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
    label: `${h.ho_ten} (${h.ma_hs}) · ${tenLopCua(h.id) || 'Chưa có lớp'} · ${vnd(h.don_gia)}${h.sdt_phu_huynh ? ` · ${h.sdt_phu_huynh}` : ''}`,
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
                  {nh[0].ho_ten}: {nh.map((x) => `${x.ma_hs} (${tenLopCua(x.id)})`).join(' + ')}
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
            <div>Các lớp: {lopSauGop.join(', ') || '—'}</div>
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
