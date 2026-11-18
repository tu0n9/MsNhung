// Phiếu đánh giá công khai: học sinh mở link cô gửi qua Zalo, không đăng nhập (docs/YEU-CAU.md).
import { useEffect, useState } from 'react'
import { App, Button, Card, Checkbox, Form, Input, Radio, Result, Select, Spin } from 'antd'
import { CAU_VIET, TIEU_CHI } from '../danh-gia'
import { sb, useMotLan } from '../supabase'
import { MAU } from '../giao-dien'

interface DuLieu {
  thang: string; han: string; lops: { id: string; ten: string }[]
  hoc_sinhs: { id: string; ho_ten: string; lop_id: string; da_gui: boolean }[]; tro_giangs: { id: string; ho_ten: string }[]
}
const KHONG = 'khong'
const THANG_DIEM = '1 Rất kém · 2 Kém · 3 Trung bình · 4 Khá · 5 Tốt'

export default function PhieuDanhGia({ ma }: { ma: string }) {
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const [d, setD] = useState<DuLieu>()
  const [loi, setLoi] = useState<string>()
  const [xong, setXong] = useState(false)
  const lop = Form.useWatch('lop', form)
  const chon: string[] = Form.useWatch('tg', form) ?? []

  useEffect(() => {
    sb.rpc('phieu_danh_gia', { p_ma: ma }).then(({ data, error }) => (error ? setLoi(error.message) : setD(data)))
  }, [ma])

  const [gui, dangGui] = useMotLan(async (v: Record<string, any>) => {
    const tg = (v.tg as string[]).filter((x) => x !== KHONG).map((id) => ({ id, ...v.diem[id] }))
    const { error } = await sb.rpc('gui_danh_gia', {
      p_ma: ma, p_lop: v.lop, p_hoc_sinh: v.hs, p_khoa_hoc: v.khoa_hoc ?? '', p_kho_khan: v.kho_khan ?? '', p_tro_giang: tg,
    })
    if (error) message.error(error.message)
    else setXong(true)
  })

  const khung = (x: React.ReactNode) => (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '16px 12px 40px' }}>
      <img src="/logo-day-du.png" alt="Ms Nhung English" style={{ width: '100%', maxWidth: 260, display: 'block', margin: '0 auto' }} />
      {x}
    </div>
  )
  if (loi) return khung(<Result status="warning" title={loi} subTitle="Em hỏi lại cô link mới nhé." />)
  if (!d) return <Spin fullscreen />
  if (xong) return khung(<Result status="success" title="Cảm ơn em đã đánh giá!" subTitle="Ý kiến của em giúp trung tâm dạy tốt hơn." />)

  const [y, m] = d.thang.split('-')
  // "không có trợ giảng" loại trừ các ô kia: tick nó thì bỏ hết, tick trợ giảng thì bỏ nó
  const doiTg = (moi: string[]) => form.setFieldValue('tg', moi.includes(KHONG) && !chon.includes(KHONG) ? [KHONG] : moi.filter((x) => x !== KHONG || moi.length === 1))
  const viet = (name: string | string[], nhan: string, max = 1000) => (
    <Form.Item name={name} label={nhan}><Input.TextArea maxLength={max} showCount autoSize={{ minRows: 2, maxRows: 8 }} /></Form.Item>
  )

  return khung(
    <Form form={form} layout="vertical" onFinish={gui} requiredMark style={{ marginTop: 8 }}>
      <h2 style={{ textAlign: 'center', margin: '0 0 4px' }}>Phiếu đánh giá tháng {m}/{y}</h2>
      <p style={{ textAlign: 'center', color: MAU.chuPhu, marginTop: 0 }}>Nhận phiếu tới hết ngày {d.han.slice(8)}/{d.han.slice(5, 7)}</p>

      <Card size="small" style={{ marginBottom: 12 }}>
        <Form.Item name="lop" label="Em học lớp nào?" rules={[{ required: true, message: 'Em chọn lớp nhé' }]}>
          <Select size="large" placeholder="Chọn lớp" options={d.lops.map((l) => ({ value: l.id, label: l.ten }))} onChange={() => form.setFieldValue('hs', undefined)} />
        </Form.Item>
        <Form.Item name="hs" label="Tên em" rules={[{ required: true, message: 'Em chọn tên mình nhé' }]}>
          <Select size="large" placeholder={lop ? 'Chọn tên' : 'Chọn lớp trước'} disabled={!lop} showSearch optionFilterProp="label"
            options={d.hoc_sinhs.filter((h) => h.lop_id === lop).map((h) => ({ value: h.id, label: h.da_gui ? `${h.ho_ten} (đã gửi)` : h.ho_ten, disabled: h.da_gui }))} />
        </Form.Item>
      </Card>

      <Card size="small" title="Khoá học" style={{ marginBottom: 12 }}>
        {viet('khoa_hoc', CAU_VIET.khoa_hoc)}
        {viet('kho_khan', CAU_VIET.kho_khan)}
      </Card>

      <Card size="small" title="Trợ giảng" style={{ marginBottom: 12 }}>
        <Form.Item name="tg" label="Trợ giảng của em là ai? (chọn được nhiều)" rules={[{ required: true, type: 'array', min: 1, message: 'Em chọn trợ giảng, hoặc "Không có trợ giảng"' }]}>
          <Checkbox.Group onChange={(v) => doiTg(v as string[])} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            options={[...d.tro_giangs.map((t) => ({ value: t.id, label: t.ho_ten })), { value: KHONG, label: 'Không có trợ giảng' }]} />
        </Form.Item>
      </Card>

      {d.tro_giangs.filter((t) => chon.includes(t.id)).map((t) => (
        <Card key={t.id} size="small" title={`Đánh giá ${t.ho_ten}`} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: MAU.chuPhu, marginBottom: 8 }}>{THANG_DIEM}</div>
          {TIEU_CHI.map((c) => (
            <Form.Item key={c.key} name={['diem', t.id, c.key]} label={c.cauHoi} rules={[{ required: true, message: 'Em chấm điểm câu này nhé' }]}>
              <Radio.Group optionType="button" buttonStyle="solid" size="large" options={[1, 2, 3, 4, 5].map((n) => ({ value: n, label: n }))} />
            </Form.Item>
          ))}
          {viet(['diem', t.id, 'nhan_xet'], CAU_VIET.nhan_xet)}
          {viet(['diem', t.id, 'chua_bai'], CAU_VIET.chua_bai)}
        </Card>
      ))}

      <Button type="primary" htmlType="submit" block size="large" loading={dangGui} style={{ fontWeight: 700 }}>Gửi phiếu</Button>
    </Form>,
  )
}
