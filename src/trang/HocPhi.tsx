import { useEffect, useState } from 'react'
import { App, Avatar, Button, Card, Col, DatePicker, Input, Row, Segmented, Space, Statistic, Table, Tag } from 'antd'
import dayjs from 'dayjs'
import { taiDuLieuThang, tongCong, type DongHs, type DuLieuThang } from '../du-lieu'
import { vnd, type Thang } from '../hoc-phi'
import { q, sb, urlAnh, type HocSinh } from '../supabase'
import HocSinhChiTiet from './HocSinhChiTiet'

const BANG = ['tai_khoan', 'lop', 'hoc_sinh', 'buoi_hoc', 'diem_danh', 'tro_giang_buoi', 'anh_buoi', 'goi_hoc', 'phieu_thu', 'chi_phi', 'khoa_so', 'nhat_ky_chot_so']

export async function saoLuuToanBo() {
  const du: Record<string, unknown> = { luc: new Date().toISOString() }
  // tro_giang_buoi: client không được đọc cột đơn giá; bản sao lưu đêm (pg_dump) mới có đủ
  for (const b of BANG) du[b] = await q(sb.from(b).select(b === 'tro_giang_buoi' ? 'buoi_id, tro_giang_id' : '*'))
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([JSON.stringify(du)], { type: 'application/json' }))
  a.download = `sao-luu-msnhung-${dayjs().format('YYYY-MM-DD-HHmm')}.json`
  a.click()
}

export default function HocPhi() {
  const { message, modal } = App.useApp()
  const [thang, setThang] = useState<Thang>(dayjs().format('YYYY-MM'))
  const [d, setD] = useState<DuLieuThang>()
  const [loc, setLoc] = useState<'tat_ca' | 'no' | 'du'>('tat_ca')
  const [khoaDen, setKhoaDen] = useState<string | null>(null)
  const [xem, setXem] = useState<HocSinh | null>(null)
  const [url, setUrl] = useState<Record<string, string>>({})
  const [dangXuat, setDangXuat] = useState(false)

  const tai = async () => {
    const [x, k] = await Promise.all([taiDuLieuThang(thang), q(sb.from('khoa_so').select('khoa_den').single())])
    setD(x); setKhoaDen((k as { khoa_den: string | null }).khoa_den)
    setUrl(await urlAnh(x.dong.map((r) => r.hs.avatar!).filter(Boolean)))
  }
  useEffect(() => { tai().catch((e) => message.error(e.message)) }, [thang])

  if (xem && d) return <HocSinhChiTiet hs={xem} lop={d.lops.find((l) => l.id === xem.lop_id)!} quayLai={() => { setXem(null); tai() }} />
  if (!d) return null

  const t = tongCong(d)
  const daChot = !!khoaDen && `${thang}-01` <= khoaDen
  const loc1 = (r: DongHs) => loc === 'tat_ca' || (loc === 'no' ? r.conPhaiThu > 0 : r.conPhaiThu <= 0)

  const chot = () => modal.confirm({
    title: `Chốt sổ tháng ${thang.slice(5)}/${thang.slice(0, 4)}?`,
    content: 'Sau khi chốt, điểm danh, phiếu thu, chi phí đến hết tháng này không sửa được nữa.',
    onOk: async () => {
      try {
        await q(sb.rpc('chot_so', { thang: `${thang}-01` })); tai()
        modal.confirm({ title: 'Đã chốt sổ. Tải bản sao lưu về máy luôn?', okText: 'Tải sao lưu', onOk: saoLuuToanBo })
      } catch (e) { message.error((e as Error).message) }
    },
  })
  const moKhoa = () => {
    let lyDo = ''
    modal.confirm({
      title: `Mở khoá tháng ${thang.slice(5)}/${thang.slice(0, 4)} (các tháng sau cũng mở)`,
      content: <Input placeholder="Lý do mở khoá" onChange={(e) => (lyDo = e.target.value)} />,
      onOk: () => q(sb.rpc('mo_khoa', { thang: `${thang}-01`, ly_do: lyDo })).then(tai).catch((e) => { message.error(e.message); throw e }),
    })
  }
  const xuat = async () => {
    setDangXuat(true)
    try { (await import('../xuat-excel')).xuatExcel(d) } catch (e) { message.error((e as Error).message) } finally { setDangXuat(false) }
  }

  const so = (v: number, mau?: string) => <Statistic value={v} formatter={(x) => vnd(Number(x))} valueStyle={{ fontSize: 18, color: mau }} />
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space wrap>
        <DatePicker picker="month" value={dayjs(thang)} onChange={(x) => x && setThang(x.format('YYYY-MM'))} format="MM/YYYY" allowClear={false} />
        {daChot ? <><Tag color="green">Đã chốt sổ</Tag><Button onClick={moKhoa}>Mở khoá</Button></> : <Button onClick={chot}>Chốt sổ tháng</Button>}
        <Button type="primary" loading={dangXuat} onClick={xuat}>Xuất Excel</Button>
        <Button onClick={() => saoLuuToanBo().catch((e) => message.error(e.message))}>Sao lưu toàn bộ</Button>
      </Space>

      <Row gutter={[8, 8]}>
        {([['Phải thu', t.phaiThu], ['Nợ kỳ trước', t.noKyTruoc], ['Đã thu', t.daThu], ['Còn phải thu', t.conPhaiThu, '#cf1322'],
          ['Thực thu trong tháng', t.thucThu, '#389e0d'], ['Tổng chi', t.tongChi], ['Chênh lệch thu chi', t.chenhLech, t.chenhLech < 0 ? '#cf1322' : '#389e0d']] as const)
          .map(([ten, v, mau]) => <Col key={ten} xs={12} md={6}><Card size="small" title={ten}>{so(v, mau)}</Card></Col>)}
      </Row>

      <Segmented value={loc} onChange={(v) => setLoc(v as typeof loc)} options={[{ value: 'tat_ca', label: 'Tất cả' }, { value: 'no', label: 'Còn nợ' }, { value: 'du', label: 'Đã đủ' }]} />

      {d.lops.map((l) => {
        const ds = d.dong.filter((r) => r.hs.lop_id === l.id && loc1(r))
        if (!ds.length) return null
        return (
          <Card key={l.id} size="small" title={l.ten}>
            <Table size="small" rowKey={(r) => r.hs.id} dataSource={ds} pagination={false} scroll={{ x: true }}
              onRow={(r) => ({ onClick: () => setXem(r.hs), style: { cursor: 'pointer' } })} columns={[
                { title: 'Học sinh', fixed: 'left', render: (_, r) => <Space><Avatar src={r.hs.avatar && url[r.hs.avatar]}>{r.hs.ho_ten.split(' ').pop()?.[0]}</Avatar>{r.hs.ho_ten}</Space> },
                { title: 'Buổi', dataIndex: 'soBuoi' },
                { title: 'Học phí', render: (_, r) => vnd(r.phaiThu) },
                { title: 'Nợ trước', render: (_, r) => vnd(r.noKyTruoc) },
                { title: 'Đã thu', render: (_, r) => vnd(r.daThu) },
                { title: 'Còn nợ', render: (_, r) => <b style={{ color: r.conPhaiThu > 0 ? '#cf1322' : undefined }}>{vnd(r.conPhaiThu)}</b> },
                { title: '', render: (_, r) => r.conPhaiThu > 0 ? <Tag color="red">Còn nợ</Tag> : <Tag color="green">Đã đủ</Tag> },
              ]} />
          </Card>
        )
      })}
    </Space>
  )
}
