import { useEffect, useState } from 'react'
import { App, AutoComplete, Button, Card, DatePicker, Form, Input, InputNumber, Modal, Popconfirm, Space, Table } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { taiDuLieuThang, type ChiPhi as CP, type DuLieuThang } from '../du-lieu'
import { vnd, type Thang } from '../hoc-phi'
import { q, sb } from '../supabase'

const MAC_DINH = ['Thuê phòng', 'Điện nước', 'Tài liệu', 'Sticker / quà', 'Hoàn học phí', 'Khác']

export default function ChiPhi() {
  const { message } = App.useApp()
  const [thang, setThang] = useState<Thang>(dayjs().format('YYYY-MM'))
  const [d, setD] = useState<DuLieuThang>()
  const [danhMuc, setDanhMuc] = useState<string[]>(MAC_DINH)
  const [sua, setSua] = useState<Partial<CP> | null>(null)

  const tai = async () => {
    const [x, dm] = await Promise.all([taiDuLieuThang(thang), q(sb.from('chi_phi').select('danh_muc'))])
    setD(x)
    // giáo viên thêm mục mới bằng cách gõ tên mới; các mục đã dùng tự hiện lại lần sau
    setDanhMuc([...new Set([...MAC_DINH, ...(dm as { danh_muc: string }[]).map((r) => r.danh_muc)])])
  }
  useEffect(() => { tai().catch((e) => message.error(e.message)) }, [thang])

  const luu = async (v: CP & { ngay_d: dayjs.Dayjs }) => {
    const ban = { ngay: v.ngay_d.format('YYYY-MM-DD'), danh_muc: v.danh_muc, so_tien: v.so_tien, ghi_chu: v.ghi_chu || null }
    try {
      await q(sua?.id ? sb.from('chi_phi').update(ban).eq('id', sua.id) : sb.from('chi_phi').insert(ban))
      setSua(null); tai()
    } catch (e) { message.error((e as Error).message) }
  }
  if (!d) return null
  const luong = d.luongTg.reduce((s, x) => s + x.thanhTien, 0)

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space wrap>
        <DatePicker picker="month" value={dayjs(thang)} onChange={(x) => x && setThang(x.format('YYYY-MM'))} format="MM/YYYY" allowClear={false} />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setSua({ ngay: dayjs().format('YYYY-MM-DD') })}>Thêm khoản chi</Button>
        <b>Tổng chi: {vnd(d.chi.reduce((s, x) => s + x.so_tien, 0) + luong)}</b>
      </Space>

      <Card size="small" title={`Lương trợ giảng (tự tính từ điểm danh): ${vnd(luong)}`}>
        <Table size="small" rowKey={(r) => r.tg.id} pagination={false} dataSource={d.luongTg} columns={[
          { title: 'Trợ giảng', render: (_, r) => r.tg.ho_ten },
          { title: 'Số buổi', dataIndex: 'soBuoi' },
          { title: 'Thành tiền', render: (_, r) => vnd(r.thanhTien) },
        ]} />
      </Card>

      <Table size="small" rowKey="id" dataSource={d.chi} pagination={false} scroll={{ x: true }}
        onRow={(r) => ({ onClick: () => setSua(r), style: { cursor: 'pointer' } })} columns={[
          { title: 'Ngày', render: (_, r) => dayjs(r.ngay).format('DD/MM') },
          { title: 'Mục', dataIndex: 'danh_muc' },
          { title: 'Số tiền', render: (_, r) => vnd(r.so_tien) },
          { title: 'Ghi chú', dataIndex: 'ghi_chu' },
          { title: '', render: (_, r) => <Popconfirm title="Xoá khoản chi?" onPopupClick={(e) => e.stopPropagation()} onConfirm={async () => {
            const { error } = await sb.from('chi_phi').delete().eq('id', r.id); if (error) message.error(error.message); else tai()
          }}><a style={{ color: 'red' }} onClick={(e) => e.stopPropagation()}>Xoá</a></Popconfirm> },
        ]} />

      <Modal open={!!sua} title={sua?.id ? 'Sửa khoản chi' : 'Thêm khoản chi'} onCancel={() => setSua(null)} footer={null} destroyOnHidden>
        <Form layout="vertical" onFinish={luu} initialValues={{ ...sua, ngay_d: dayjs(sua?.ngay) }}>
          <Form.Item name="ngay_d" label="Ngày chi" rules={[{ required: true }]}><DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="danh_muc" label="Mục (gõ tên mới để thêm mục)" rules={[{ required: true }]}>
            <AutoComplete options={danhMuc.map((x) => ({ value: x }))} filterOption={(i, o) => !!o?.value.toLowerCase().includes(i.toLowerCase())} />
          </Form.Item>
          <Form.Item name="so_tien" label="Số tiền" rules={[{ required: true }]}>
            <InputNumber<number> min={1} step={10000} style={{ width: '100%' }} formatter={(v) => `${v ?? ''}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} parser={(v) => Number(v?.replace(/\./g, '') || 0)} />
          </Form.Item>
          <Form.Item name="ghi_chu" label="Ghi chú"><Input /></Form.Item>
          <Button type="primary" htmlType="submit" block>Lưu</Button>
        </Form>
      </Modal>
    </Space>
  )
}
