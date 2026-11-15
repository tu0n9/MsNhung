import { useEffect, useMemo, useState } from 'react'
import { App, Avatar, Button, Card, DatePicker, Descriptions, Form, Input, InputNumber, List, Modal, Popconfirm, Radio, Select, Space, Statistic, Table, Tag } from 'antd'
import dayjs from 'dayjs'
import { useToi } from '../App'
import { goiTaiKhoan, laQuanLy, q, sb, urlAnh, type BuoiHoc, type HocSinh, type Lop } from '../supabase'
import { congThang, demBuoiDuKien, phaiThuTheoThang, tienDu, tinNhanPhuHuynh, tongHopHocSinh, vnd, type Goi, type PhieuThu, type Thang } from '../hoc-phi'

type Phieu = PhieuThu & { id: string; hinh_thuc: string; ghi_chu: string | null }
const TRANG_THAI = { co_mat: ['Có mặt', 'green'], vang: ['Vắng', 'red'], hoc_bu: ['Học bù', 'blue'] } as const

/** Số buổi lớp nghỉ và buổi phụ trong khoảng của gói, để tính tiền dư. */
export function demNghiPhu(g: Goi, buoiDacBiet: BuoiHoc[], ngayVao: string) {
  const tu = [g.thang_bat_dau, ngayVao].sort()[1]
  const den = `${congThang(g.thang_bat_dau.slice(0, 7), g.so_thang)}-01`
  const trong = buoiDacBiet.filter((b) => b.ngay >= tu && b.ngay < den)
  return { nghi: trong.filter((b) => b.loai === 'lich' && b.lop_nghi).length, phu: trong.filter((b) => b.loai === 'phu' && !b.lop_nghi).length }
}

export default function HocSinhChiTiet({ hs, lop, quayLai, chiXem }: { hs: HocSinh; lop: Lop; quayLai?: () => void; chiXem?: boolean }) {
  const { message } = App.useApp()
  const toi = useToi()
  const ql = laQuanLy(toi.vai_tro) && !chiXem
  const [thang, setThang] = useState<Thang>(dayjs().format('YYYY-MM'))
  const [dd, setDd] = useState<{ trang_thai: keyof typeof TRANG_THAI; sticker: number; buoi_hoc: BuoiHoc }[]>([])
  const [goi, setGoi] = useState<(Goi & { ly_do_dieu_chinh: string | null })[]>([])
  const [phieu, setPhieu] = useState<Phieu[]>([])
  const [buoiDb, setBuoiDb] = useState<BuoiHoc[]>([])
  const [avatar, setAvatar] = useState<string>()
  const [thuTien, setThuTien] = useState(false)
  const [anh, setAnh] = useState<{ duong_dan: string; ngay: string }[]>([])
  const [urlA, setUrlA] = useState<Record<string, string>>({})

  const tai = async () => {
    const [d, g, b] = await Promise.all([
      q(sb.from('diem_danh').select('trang_thai, sticker, buoi_hoc(*)').eq('hoc_sinh_id', hs.id)),
      q(sb.from('goi_hoc').select('*').eq('hoc_sinh_id', hs.id).order('thang_bat_dau')),
      q(sb.from('buoi_hoc').select('*').eq('lop_id', hs.lop_id).or('lop_nghi.eq.true,loai.eq.phu')),
    ])
    setDd(d as never); setGoi(g as never); setBuoiDb(b as BuoiHoc[])
    const ids = (g as Goi[]).map((x) => x.id)
    setPhieu(ids.length ? await q(sb.from('phieu_thu').select('*').in('goi_id', ids).order('ngay_thu')) as Phieu[] : [])
    if (hs.avatar) setAvatar((await urlAnh([hs.avatar]))[hs.avatar])
  }
  useEffect(() => { tai().catch((e) => message.error(e.message)) }, [hs.id])

  const trongThang = dd.filter((x) => x.buoi_hoc.ngay.startsWith(thang)).sort((a, b) => a.buoi_hoc.ngay.localeCompare(b.buoi_hoc.ngay))
  const buoiIdsCoMat = trongThang.filter((x) => x.trang_thai !== 'vang').map((x) => x.buoi_hoc.id)
  useEffect(() => {
    if (!buoiIdsCoMat.length) { setAnh([]); return }
    q(sb.from('anh_buoi').select('duong_dan, buoi_hoc(ngay)').in('buoi_id', buoiIdsCoMat)).then(async (a) => {
      const ds = (a as unknown as { duong_dan: string; buoi_hoc: { ngay: string } }[]).map((x) => ({ duong_dan: x.duong_dan, ngay: x.buoi_hoc.ngay }))
      setAnh(ds); setUrlA(await urlAnh(ds.map((x) => x.duong_dan)))
    })
  }, [thang, dd.length])

  const soCoMat = buoiIdsCoMat.length
  const tongSticker = (hs.sticker_dau_ky ?? 0) + dd.reduce((s, x) => s + x.sticker, 0)
  const chuaBu = dd.filter((x) => x.trang_thai === 'vang').length - dd.filter((x) => x.trang_thai === 'hoc_bu').length
  const th = useMemo(() => tongHopHocSinh(goi, phieu, thang), [goi, phieu, thang])
  const tinNhan = tinNhanPhuHuynh(hs.ho_ten, thang, th, soCoMat)

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space wrap>
        {quayLai && <Button onClick={quayLai}>← Quay lại</Button>}
        <Avatar shape="square" size={64} src={avatar}>{hs.ho_ten.split(' ').pop()?.[0]}</Avatar>
        <div><b style={{ fontSize: 18 }}>{hs.ho_ten}</b><br />{lop?.ten} {hs.trang_thai === 'ngung' && <Tag>Ngừng học</Tag>}</div>
        <DatePicker picker="month" value={dayjs(thang)} onChange={(d) => d && setThang(d.format('YYYY-MM'))} format="MM/YYYY" allowClear={false} />
      </Space>

      <Card size="small">
        <Space wrap size="large">
          <Statistic title="Buổi đi học tháng này" value={soCoMat} />
          <Statistic title="Tổng sticker" value={tongSticker} prefix="⭐" />
          <Statistic title="Buổi chưa học bù" value={Math.max(chuaBu, 0)} />
          {(ql || chiXem) && <Statistic title="Cần nộp" value={vnd(Math.max(th.conPhaiThu, 0))} />}
        </Space>
      </Card>

      <Card size="small" title={`Điểm danh tháng ${thang.slice(5)}/${thang.slice(0, 4)}`}>
        <List size="small" dataSource={trongThang} locale={{ emptyText: 'Chưa có buổi nào' }} renderItem={(x) => (
          <List.Item>
            {dayjs(x.buoi_hoc.ngay).format('dd DD/MM')}
            <Space><Tag color={TRANG_THAI[x.trang_thai][1]}>{TRANG_THAI[x.trang_thai][0]}</Tag>⭐ {x.sticker}</Space>
          </List.Item>
        )} />
      </Card>

      {chiXem && anh.length > 0 && <Card size="small" title="Ảnh lớp">
        <Space wrap>{anh.map((a) => <a key={a.duong_dan} href={urlA[a.duong_dan]} target="_blank" rel="noreferrer">
          <img src={urlA[a.duong_dan]} width={100} height={100} style={{ objectFit: 'cover' }} alt={a.ngay} /></a>)}</Space>
      </Card>}

      {(ql || chiXem) && <Card size="small" title="Học phí" extra={ql && <Button type="primary" onClick={() => setThuTien(true)}>Thu tiền</Button>}>
        <Descriptions size="small" column={{ xs: 1, sm: 2 }} items={[
          { label: 'Học phí tháng này', children: vnd(th.phaiThu) },
          { label: 'Nợ kỳ trước', children: vnd(th.noKyTruoc) },
          { label: 'Đã thu', children: vnd(th.daThu) },
          { label: 'Còn phải thu', children: <b>{vnd(th.conPhaiThu)}</b> },
        ]} />
        {ql && <Space wrap style={{ marginTop: 8 }}>
          <Button onClick={() => navigator.clipboard.writeText(tinNhan).then(() => message.success('Đã sao chép, dán vào Zalo'))}>Sao chép tin nhắn</Button>
          {hs.sdt_phu_huynh && <Button href={`https://zalo.me/${hs.sdt_phu_huynh}`} target="_blank">Mở Zalo</Button>}
          {hs.sdt_phu_huynh && <Button href={`sms:${hs.sdt_phu_huynh}?body=${encodeURIComponent(tinNhan)}`}>Gửi SMS</Button>}
        </Space>}

        <Table size="small" style={{ marginTop: 12 }} rowKey="id" pagination={false} dataSource={goi} scroll={{ x: true }} columns={[
          { title: 'Gói', render: (_, g) => `${g.so_thang} tháng từ ${g.thang_bat_dau.slice(5, 7)}/${g.thang_bat_dau.slice(0, 4)}` },
          { title: 'Buổi', render: (_, g) => Object.values(g.buoi_du_kien).reduce((s, x) => s + x, 0) },
          { title: 'Phải thu', render: (_, g) => vnd(Object.values(phaiThuTheoThang(g)).reduce((s, x) => s + x, 0)) },
          { title: 'Đã đóng', render: (_, g) => vnd(phieu.filter((p) => p.goi_id === g.id).reduce((s, p) => s + p.so_tien, 0)) },
          { title: 'Tiền dư', render: (_, g) => { const n = demNghiPhu(g, buoiDb, hs.ngay_vao); return vnd(tienDu(g, n.nghi, n.phu)) } },
          ...(ql ? [{ title: '', render: (_: unknown, g: Goi) => <Popconfirm title="Xoá gói (chỉ khi chưa có phiếu thu)?" onConfirm={async () => {
            const { error } = await sb.from('goi_hoc').delete().eq('id', g.id); if (error) message.error(error.message); else tai()
          }}><a style={{ color: 'red' }}>Xoá</a></Popconfirm> }] : []),
        ]} />

        <Table size="small" style={{ marginTop: 12 }} rowKey="id" pagination={false} dataSource={phieu} scroll={{ x: true }}
          title={() => 'Các lần thu'} columns={[
            { title: 'Ngày', render: (_, p) => dayjs(p.ngay_thu).format('DD/MM/YYYY') },
            { title: 'Số tiền', render: (_, p) => vnd(p.so_tien) },
            { title: 'Hình thức', render: (_, p) => p.hinh_thuc === 'tien_mat' ? 'Tiền mặt' : 'Chuyển khoản' },
            { title: 'Ghi chú', dataIndex: 'ghi_chu' },
            ...(ql ? [{ title: '', render: (_: unknown, p: Phieu) => <Popconfirm title="Xoá phiếu thu?" onConfirm={async () => {
              const { error } = await sb.from('phieu_thu').delete().eq('id', p.id); if (error) message.error(error.message); else tai()
            }}><a style={{ color: 'red' }}>Xoá</a></Popconfirm> }] : []),
          ]} />
      </Card>}

      {!chiXem && hs.phu_huynh_id && <Popconfirm title="Đặt lại mật khẩu phụ huynh về số điện thoại?" onConfirm={() =>
        goiTaiKhoan({ hanh_dong: 'dat_lai', id: hs.phu_huynh_id }).then(() => message.success('Đã đặt lại')).catch((e) => message.error(e.message))}>
        <Button>Đặt lại mật khẩu tài khoản phụ huynh</Button>
      </Popconfirm>}

      {thuTien && <ThuTien hs={hs} lop={lop} goi={goi} phieu={phieu} buoiDb={buoiDb} dong={() => { setThuTien(false); tai() }} />}
    </Space>
  )
}

function ThuTien({ hs, lop, goi, phieu, buoiDb, dong }: { hs: HocSinh; lop: Lop; goi: Goi[]; phieu: Phieu[]; buoiDb: BuoiHoc[]; dong: () => void }) {
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const conNo = (g: Goi) => Object.values(phaiThuTheoThang(g)).reduce((s, x) => s + x, 0) - phieu.filter((p) => p.goi_id === g.id).reduce((s, p) => s + p.so_tien, 0)
  const dangNo = goi.filter((g) => conNo(g) > 0)
  const cuoi = goi[goi.length - 1]
  const duGoiTruoc = cuoi ? (() => { const n = demNghiPhu(cuoi, buoiDb, hs.ngay_vao); return tienDu(cuoi, n.nghi, n.phu) })() : 0
  const thangKe = cuoi ? congThang(cuoi.thang_bat_dau.slice(0, 7), cuoi.so_thang) : dayjs(hs.ngay_vao).format('YYYY-MM')

  const v = Form.useWatch([], form) ?? {}
  const donGia = v.don_gia ?? hs.don_gia_rieng ?? lop.don_gia
  const thangBd: Thang = v.thang?.format?.('YYYY-MM') ?? thangKe
  const buoi = demBuoiDuKien(lop.lich, thangBd, v.so_thang ?? 1, hs.ngay_vao > `${thangBd}-01` ? hs.ngay_vao : undefined)
  const tongGoiMoi = Object.values(buoi).reduce((s, x) => s + x, 0) * donGia - (v.tien_du_tru ?? 0) + (v.dieu_chinh ?? 0)

  const luu = async () => {
    const x = await form.validateFields()
    try {
      let goiId = x.goi_id
      if (x.loai === 'moi') {
        const g = await q(sb.from('goi_hoc').insert({
          hoc_sinh_id: hs.id, thang_bat_dau: `${thangBd}-01`, so_thang: x.so_thang, don_gia: donGia, buoi_du_kien: buoi,
          tien_du_tru: x.tien_du_tru ?? 0, dieu_chinh: x.dieu_chinh ?? 0, ly_do_dieu_chinh: x.ly_do || null,
        }).select().single()) as Goi
        goiId = g.id
      }
      if (x.so_tien > 0) await q(sb.from('phieu_thu').insert({
        goi_id: goiId, so_tien: x.so_tien, ngay_thu: x.ngay_thu.format('YYYY-MM-DD'), hinh_thuc: x.hinh_thuc, ghi_chu: x.ghi_chu || null,
      }))
      message.success('Đã lưu'); dong()
    } catch (e) { message.error((e as Error).message) }
  }

  const tien = { min: 0, step: 50000, style: { width: '100%' }, formatter: (s?: number | string) => `${s ?? ''}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.'), parser: (s?: string) => Number(s?.replace(/\./g, '') || 0) }
  return (
    <Modal open title={`Thu tiền: ${hs.ho_ten}`} onCancel={dong} onOk={luu} okText="Lưu">
      <Form form={form} layout="vertical" initialValues={{
        loai: dangNo.length ? 'no' : 'moi', goi_id: dangNo[0]?.id, so_thang: 1, thang: dayjs(thangKe),
        tien_du_tru: duGoiTruoc, ngay_thu: dayjs(), hinh_thuc: 'tien_mat',
      }}>
        <Form.Item name="loai"><Radio.Group optionType="button" options={[{ value: 'moi', label: 'Đóng gói mới' }, { value: 'no', label: 'Trả gói đang nợ', disabled: !dangNo.length }]} /></Form.Item>
        {v.loai === 'no' ? (
          <Form.Item name="goi_id" label="Gói"><Select options={dangNo.map((g) => ({ value: g.id, label: `${g.so_thang} tháng từ ${g.thang_bat_dau.slice(5, 7)}/${g.thang_bat_dau.slice(0, 4)} · còn nợ ${vnd(conNo(g))}` }))} /></Form.Item>
        ) : <>
          <Form.Item name="so_thang" label="Số tháng"><Radio.Group optionType="button" options={[1, 2, 3].map((n) => ({ value: n, label: `${n} tháng` }))} /></Form.Item>
          <Form.Item name="thang" label="Từ tháng"><DatePicker picker="month" format="MM/YYYY" allowClear={false} /></Form.Item>
          <Form.Item name="don_gia" label={`Đơn giá/buổi (mặc định ${vnd(hs.don_gia_rieng ?? lop.don_gia)})`}><InputNumber {...tien} placeholder={`${donGia}`} /></Form.Item>
          <Form.Item name="tien_du_tru" label="Trừ tiền dư gói trước"><InputNumber {...tien} /></Form.Item>
          <Form.Item name="dieu_chinh" label="Điều chỉnh (giảm thì nhập số âm)"><InputNumber {...tien} min={undefined} /></Form.Item>
          {!!v.dieu_chinh && <Form.Item name="ly_do" label="Lý do điều chỉnh" rules={[{ required: true }]}><Input /></Form.Item>}
          <p>Buổi dự kiến: {Object.entries(buoi).map(([t, n]) => `T${t.slice(5)}: ${n}`).join(', ')} → <b>Tổng gói: {vnd(tongGoiMoi)}</b></p>
        </>}
        <Form.Item name="so_tien" label="Số tiền thu lần này (để 0 nếu chỉ ghi gói, chưa thu)"><InputNumber {...tien} /></Form.Item>
        <Space>
          <Form.Item name="ngay_thu" label="Ngày thu"><DatePicker format="DD/MM/YYYY" allowClear={false} /></Form.Item>
          <Form.Item name="hinh_thuc" label="Hình thức"><Select style={{ width: 140 }} options={[{ value: 'tien_mat', label: 'Tiền mặt' }, { value: 'chuyen_khoan', label: 'Chuyển khoản' }]} /></Form.Item>
        </Space>
        <Form.Item name="ghi_chu" label="Ghi chú"><Input /></Form.Item>
      </Form>
    </Modal>
  )
}
