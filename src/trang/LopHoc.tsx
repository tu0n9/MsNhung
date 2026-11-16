import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { App, Avatar, Button, Checkbox, Collapse, DatePicker, Form, Input, InputNumber, List, Modal, Popconfirm, Select, Space, Tag, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useToi } from '../App'
import { goiTaiKhoan, laQuanLy, q, sb, useMotLan, taiAnhLen, THU, urlAnh, type HocSinh, type Lop } from '../supabase'
import { vnd } from '../hoc-phi'
import { cong2Gio, moTaLich, thieuGio, type GioThu } from '../gio-hoc'
import { O_TIEN } from '../giao-dien'
import HocSinhChiTiet from './HocSinhChiTiet'

export default function LopHoc() {
  const { message, modal } = App.useApp()
  const toi = useToi()
  const ql = laQuanLy(toi.vai_tro)
  const nav = useNavigate()
  const [lops, setLops] = useState<Lop[]>([])
  const [hs, setHs] = useState<HocSinh[]>([])
  const [url, setUrl] = useState<Record<string, string>>({})
  const [suaLop, setSuaLop] = useState<Partial<Lop> | null>(null)
  const [suaHs, setSuaHs] = useState<Partial<HocSinh> | null>(null)
  const [xem, setXem] = useState<HocSinh | null>(null)
  const [hienNgung, setHienNgung] = useState(false)

  const tai = async () => {
    const [l, h] = await Promise.all([q(sb.from('lop').select('*').order('ten')), q(sb.from('hoc_sinh').select('*').order('ho_ten'))])
    setLops(l as Lop[]); setHs(h as HocSinh[])
    setUrl(await urlAnh((h as HocSinh[]).map((x) => x.avatar!).filter(Boolean)))
  }
  useEffect(() => { tai().catch((e) => message.error(e.message)) }, [])

  const [luuLop, dangLuuLop] = useMotLan(async (v: Lop) => {
    try {
      const gio_thu = v.gio_thu ?? {}
      const ban = { ten: v.ten, don_gia: v.don_gia, lich: Object.keys(gio_thu).map(Number), gio_thu, hoat_dong: v.hoat_dong ?? true }
      await q(suaLop?.id ? sb.from('lop').update(ban).eq('id', suaLop.id) : sb.from('lop').insert(ban))
      setSuaLop(null); tai()
    } catch (e) { message.error((e as Error).message) }
  })

  const [luuHs, dangLuuHs] = useMotLan(async (v: HocSinh & { ngay_vao_d: dayjs.Dayjs; anh?: File }) => {
    try {
      let phu_huynh_id = suaHs?.phu_huynh_id ?? null
      const sdt = v.sdt_phu_huynh?.replace(/\D/g, '') || null
      if (sdt && sdt !== suaHs?.sdt_phu_huynh) {
        // tạo (hoặc lấy lại) tài khoản phụ huynh theo số điện thoại; mật khẩu đầu = số điện thoại
        phu_huynh_id = (await goiTaiKhoan({ hanh_dong: 'tao', vai_tro: 'phu_huynh', so_dien_thoai: sdt, ho_ten: v.ten_phu_huynh || sdt })).id
      }
      const ban = {
        ho_ten: v.ho_ten, lop_id: v.lop_id, ten_phu_huynh: v.ten_phu_huynh || null, sdt_phu_huynh: sdt, phu_huynh_id,
        ngay_vao: v.ngay_vao_d.format('YYYY-MM-DD'), don_gia_rieng: v.don_gia_rieng ?? null, ghi_chu: v.ghi_chu || null,
        sticker_dau_ky: v.sticker_dau_ky ?? 0,
      }
      const luu = await q(suaHs?.id
        ? sb.from('hoc_sinh').update(ban).eq('id', suaHs.id).select().single()
        : sb.from('hoc_sinh').insert(ban).select().single()) as HocSinh
      if (v.anh) {
        const duong = await taiAnhLen(`avatar/${luu.id}-${Date.now()}.jpg`, v.anh, 400)
        await q(sb.from('hoc_sinh').update({ avatar: duong }).eq('id', luu.id))
      }
      setSuaHs(null); tai()
    } catch (e) { message.error((e as Error).message) }
  })

  const xoaLop = (l: Partial<Lop>) => {
    const soHs = hs.filter((h) => h.lop_id === l.id).length
    // nút chỉ bật khi gõ đúng tên: không cần ném lỗi để giữ hộp mở (lỗi ném ra từ onOk thành promise không ai bắt)
    const hop = modal.confirm({
      title: `Xoá hẳn lớp ${l.ten}?`, okText: 'Xoá hẳn', okButtonProps: { danger: true, disabled: true },
      content: <>
        <p>Xoá luôn {soHs} học sinh của lớp cùng toàn bộ buổi học, điểm danh, ảnh, gói học, phiếu thu của các em. Không lấy
          lại được trong app (chỉ còn trong bản sao lưu đêm). Lớp có dữ liệu ở tháng đã chốt sổ thì phải mở khoá tháng đó trước.</p>
        <Input placeholder="Gõ lại tên lớp để xác nhận" aria-label="Gõ lại tên lớp"
          onChange={(e) => hop.update({ okButtonProps: { danger: true, disabled: e.target.value.trim() !== l.ten } })} />
      </>,
      onOk: async () => {
        try {
          const anh = await q(sb.rpc('xoa_lop', { p_lop: l.id, p_ten: l.ten })) as string[]
          // database đã xoá xong; file ảnh còn sót chỉ tốn chỗ, không làm sai số liệu
          if (anh.length) await sb.storage.from('anh').remove(anh)
          message.success(`Đã xoá lớp ${l.ten}`); setSuaLop(null); tai()
        } catch (e) { message.error((e as Error).message) }
      },
    })
  }

  const doiTrangThai = async (h: HocSinh) => {
    await q(sb.from('hoc_sinh').update({ trang_thai: h.trang_thai === 'ngung' ? 'dang_hoc' : 'ngung' }).eq('id', h.id))
    tai()
  }
  const xoaHs = async (h: HocSinh) => {
    const { error } = await sb.from('hoc_sinh').delete().eq('id', h.id)
    // khoá ngoại chặn xoá học sinh đã có điểm danh / gói học
    if (error) message.error('Học sinh đã có dữ liệu, chỉ chuyển sang "Ngừng học" được'); else tai()
  }

  if (xem) return <HocSinhChiTiet hs={xem} lop={lops.find((l) => l.id === xem.lop_id)!} quayLai={() => { setXem(null); tai() }} />

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {ql && <Space wrap>
        <Button icon={<PlusOutlined />} onClick={() => setSuaLop({ lich: [], hoat_dong: true })}>Thêm lớp</Button>
        <Button icon={<PlusOutlined />} type="primary" disabled={!lops.length} onClick={() => setSuaHs({ ngay_vao: dayjs().format('YYYY-MM-DD') })}>Thêm học sinh</Button>
        <Button onClick={() => nav('/import')}>Import Excel</Button>
        <Checkbox checked={hienNgung} onChange={(e) => setHienNgung(e.target.checked)}>Hiện học sinh đã ngừng học</Checkbox>
      </Space>}
      <Collapse defaultActiveKey={lops.map((l) => l.id)} key={lops.length} items={lops.map((l) => {
        const ds = hs.filter((h) => h.lop_id === l.id && (hienNgung || h.trang_thai === 'dang_hoc'))
        return {
          key: l.id,
          label: <Space wrap><b>{l.ten}</b>{l.lich.length > 0 && <span>{moTaLich(l)}</span>}{thieuGio(l) && <Tag color="red">Chưa có giờ</Tag>}
            {ql && <span>{vnd(l.don_gia)}/buổi</span>}<Tag>{ds.length} HS</Tag>{!l.hoat_dong && <Tag>Ngừng</Tag>}</Space>,
          extra: ql && <Button size="small" onClick={(e) => { e.stopPropagation(); setSuaLop(l) }}>Sửa lớp</Button>,
          children: <List dataSource={ds} locale={{ emptyText: 'Chưa có học sinh' }} renderItem={(h) => (
            <List.Item style={{ cursor: 'pointer' }} onClick={() => setXem(h)} actions={ql ? [
              <a key="s" onClick={(e) => { e.stopPropagation(); setSuaHs(h) }}>Sửa</a>,
              <Popconfirm key="n" title={h.trang_thai === 'ngung' ? 'Cho học lại?' : 'Chuyển sang ngừng học?'} onConfirm={() => doiTrangThai(h)}>
                <a onClick={(e) => e.stopPropagation()}>{h.trang_thai === 'ngung' ? 'Học lại' : 'Ngừng'}</a></Popconfirm>,
              <Popconfirm key="x" title="Xoá hẳn? Chỉ xoá được học sinh nhập nhầm, chưa có dữ liệu." onConfirm={() => xoaHs(h)}>
                <a style={{ color: 'red' }} onClick={(e) => e.stopPropagation()}>Xoá</a></Popconfirm>,
            ] : []}>
              <List.Item.Meta
                avatar={<Avatar shape="square" size={48} src={h.avatar && url[h.avatar]}>{h.ho_ten.split(' ').pop()?.[0]}</Avatar>}
                title={<>{h.ho_ten} {h.trang_thai === 'ngung' && <Tag>Ngừng học</Tag>}</>}
                description={[h.ten_phu_huynh, h.sdt_phu_huynh].filter(Boolean).join(' · ')} />
            </List.Item>
          )} />,
        }
      })} />

      <Modal open={!!suaLop} title={suaLop?.id ? 'Sửa lớp' : 'Thêm lớp'} onCancel={() => setSuaLop(null)} footer={null} destroyOnHidden>
        <Form layout="vertical" initialValues={suaLop ? { ...suaLop, gio_thu: gioThuSua(suaLop) } : {}} onFinish={luuLop}>
          <Form.Item name="ten" label="Tên lớp" rules={[{ required: true }]}><Input /></Form.Item>
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

      <Modal open={!!suaHs} title={suaHs?.id ? 'Sửa học sinh' : 'Thêm học sinh'} onCancel={() => setSuaHs(null)} footer={null} destroyOnHidden>
        <Form layout="vertical" onFinish={luuHs} initialValues={{ ...suaHs, ngay_vao_d: dayjs(suaHs?.ngay_vao) }}>
          <Form.Item name="ho_ten" label="Họ tên" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="lop_id" label="Lớp" rules={[{ required: true }]}><Select options={lops.map((l) => ({ value: l.id, label: l.ten }))} /></Form.Item>
          <Form.Item name="anh" label="Ảnh đại diện" valuePropName="file" getValueFromEvent={(e) => e?.file}>
            <Upload accept="image/*" maxCount={1} beforeUpload={() => false} listType="picture"><Button>Chụp / chọn ảnh</Button></Upload>
          </Form.Item>
          <Form.Item name="ten_phu_huynh" label="Tên phụ huynh"><Input /></Form.Item>
          <Form.Item name="sdt_phu_huynh" label="SĐT phụ huynh (tạo tài khoản phụ huynh, mật khẩu đầu = SĐT)"><Input inputMode="tel" /></Form.Item>
          <Form.Item name="ngay_vao_d" label="Ngày vào học" rules={[{ required: true }]}><DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="don_gia_rieng" label="Đơn giá riêng (để trống = theo lớp)"><InputNumber<number> {...O_TIEN} step={10000} /></Form.Item>
          <Form.Item name="sticker_dau_ky" label="Sticker đã có từ trước (sổ giấy)"><InputNumber<number> min={0} precision={0} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="ghi_chu" label="Ghi chú"><Input.TextArea rows={2} /></Form.Item>
          <Button type="primary" htmlType="submit" block loading={dangLuuHs}>Lưu</Button>
        </Form>
      </Modal>
    </Space>
  )
}


// Thứ có trong lịch mà chưa có giờ (lớp cũ ghi giờ bằng chữ) vẫn hiện là đã chọn, để form bắt nhập giờ thay vì làm mất lịch.
const gioThuSua = (l: Partial<Lop>): GioThu =>
  Object.fromEntries((l.lich ?? []).map((t) => [t, l.gio_thu?.[t] ?? { bd: '', kt: '' }]))

/** 7 dòng T2…CN: tick thứ có học, nhập giờ bằng ô giờ gốc của trình duyệt (điện thoại hiện bánh xe chọn giờ). */
function LichTuan({ value = {}, onChange }: { value?: GioThu; onChange?: (v: GioThu) => void }) {
  // giờ vừa nhập gần nhất: tick thêm thứ thì chép sang, vì đa số lớp học cùng giờ mọi thứ
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
