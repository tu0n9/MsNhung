import { useEffect, useState } from 'react'
import { App, Button, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Switch, Table, Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useToi } from '../App'
import { goiTaiKhoan, laQuanLy, q, sb, useMotLan, type TaiKhoan as TK, type VaiTro } from '../supabase'
import { vnd } from '../hoc-phi'
import { O_TIEN } from '../giao-dien'

const TEN_VAI: Record<VaiTro, string> = { admin: 'Quản trị', giao_vien: 'Giáo viên', tro_giang: 'Trợ giảng', phu_huynh: 'Phụ huynh' }
// khớp QUYEN_DAT_LAI trong supabase/functions/tai-khoan; Edge Function và RLS mới là chốt chặn thật, đây chỉ để ẩn nút
const DUOC_QUAN_LY: Record<VaiTro, VaiTro[]> = { admin: ['giao_vien', 'tro_giang', 'phu_huynh'], giao_vien: ['tro_giang', 'phu_huynh'], tro_giang: ['phu_huynh'], phu_huynh: [] }

export default function TaiKhoan() {
  const { message } = App.useApp()
  const toi = useToi()
  const nav = useNavigate()
  const [ds, setDs] = useState<TK[]>([])
  const [tao, setTao] = useState(false)
  const [loc, setLoc] = useState<VaiTro | 'tat_ca'>('tat_ca')
  const quanLy = DUOC_QUAN_LY[toi.vai_tro]

  const tai = () => q(sb.from('tai_khoan').select('*').order('vai_tro').order('ho_ten')).then((x) => setDs(x as TK[])).catch((e) => message.error(e.message))
  useEffect(() => { tai() }, [])

  const [taoMoi, dangTao] = useMotLan(async (v: Record<string, unknown>) => {
    try { await goiTaiKhoan({ hanh_dong: 'tao', ...v }); message.success('Đã tạo. Mật khẩu đầu là số điện thoại (hoặc mật khẩu đã nhập)'); setTao(false); tai() }
    catch (e) { message.error((e as Error).message) }
  })
  const datLai = (id: string) => goiTaiKhoan({ hanh_dong: 'dat_lai', id }).then(() => message.success('Đã đặt lại mật khẩu về số điện thoại')).catch((e) => message.error(e.message))
  const sua = (id: string, ban: Partial<TK>) => q(sb.from('tai_khoan').update(ban).eq('id', id)).then(tai).catch((e) => message.error(e.message))

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space wrap>
        {laQuanLy(toi.vai_tro) && <Button type="primary" icon={<PlusOutlined />} onClick={() => setTao(true)}>Tạo tài khoản</Button>}
        <Button onClick={() => nav('/doi-mat-khau')}>Đổi mật khẩu của tôi</Button>
        <Select value={loc} onChange={setLoc} style={{ width: 150 }} options={[{ value: 'tat_ca', label: 'Tất cả' }, ...Object.entries(TEN_VAI).map(([v, l]) => ({ value: v, label: l }))]} />
      </Space>
      <Table size="small" rowKey="id" dataSource={ds.filter((x) => loc === 'tat_ca' || x.vai_tro === loc)} scroll={{ x: true }} columns={[
        { title: 'Họ tên', dataIndex: 'ho_ten' },
        { title: 'Đăng nhập', render: (_, r) => [r.ten_dang_nhap, r.so_dien_thoai].filter(Boolean).join(' / ') },
        { title: 'Vai trò', render: (_, r) => <Tag>{TEN_VAI[r.vai_tro]}</Tag> },
        { title: 'Đơn giá/buổi', render: (_, r) => r.vai_tro === 'tro_giang' && (laQuanLy(toi.vai_tro)
          ? <InputNumber size="small" min={0} precision={0} step={10000} defaultValue={r.don_gia_buoi} onBlur={(e) => sua(r.id, { don_gia_buoi: Number(e.target.value.replace(/\D/g, '')) })} />
          : vnd(r.don_gia_buoi)) },
        { title: 'Hoạt động', render: (_, r) => <Switch size="small" checked={r.hoat_dong} disabled={!quanLy.includes(r.vai_tro) || toi.vai_tro === 'tro_giang'}
          onChange={(v) => sua(r.id, { hoat_dong: v })} /> },
        { title: '', render: (_, r) => quanLy.includes(r.vai_tro) && r.id !== toi.id &&
          <Popconfirm title="Đặt lại mật khẩu về số điện thoại?" onConfirm={() => datLai(r.id)}><a>Đặt lại mật khẩu</a></Popconfirm> },
      ]} />

      <Modal open={tao} title="Tạo tài khoản" onCancel={() => setTao(false)} footer={null} destroyOnHidden>
        <Form layout="vertical" onFinish={taoMoi} initialValues={{ vai_tro: 'tro_giang' }}>
          <Form.Item name="vai_tro" label="Vai trò"><Select options={quanLy.map((v) => ({ value: v, label: TEN_VAI[v] }))} /></Form.Item>
          <Form.Item name="ho_ten" label="Họ tên" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="ten_dang_nhap" label="Tên đăng nhập"><Input autoCapitalize="none" /></Form.Item>
          <Form.Item name="so_dien_thoai" label="Số điện thoại"><Input inputMode="tel" /></Form.Item>
          <Form.Item name="mat_khau" label="Mật khẩu ban đầu (để trống = số điện thoại)"><Input.Password /></Form.Item>
          <Form.Item noStyle shouldUpdate>{({ getFieldValue }) => getFieldValue('vai_tro') === 'tro_giang' &&
            <Form.Item name="don_gia_buoi" label="Đơn giá một buổi"><InputNumber<number> {...O_TIEN} step={10000} /></Form.Item>}</Form.Item>
          <Button type="primary" htmlType="submit" block loading={dangTao}>Tạo</Button>
        </Form>
      </Modal>
    </Space>
  )
}
