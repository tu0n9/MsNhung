// Kết quả phiếu đánh giá của học sinh, chỉ giáo viên (docs/YEU-CAU.md mục "Đánh giá từ học sinh").
import { useEffect, useState } from 'react'
import { App, Button, Card, Collapse, DatePicker, Select, Space, Table, Tag } from 'antd'
import dayjs from 'dayjs'
import { CAU_VIET, hanNhan, taoMa, TIEU_CHI, tongHop, urlPhieu, type PhieuDanhGia } from '../danh-gia'
import { congThang, type Thang } from '../hoc-phi'
import { q, sb, type HocSinh, type Lop } from '../supabase'
import { MAU } from '../giao-dien'

const TEN_NGAN: Record<keyof typeof CAU_VIET, string> = {
  khoa_hoc: 'Nhận xét khoá học', kho_khan: 'Khó khăn khi học', nhan_xet: 'Nhận xét gửi trợ giảng', chua_bai: 'Chữa bài tập về nhà',
}

export default function DanhGia() {
  const { message, modal } = App.useApp()
  const [thang, setThang] = useState<Thang>(dayjs().format('YYYY-MM'))
  const [ma, setMa] = useState<string | null>()
  const [phieus, setPhieus] = useState<PhieuDanhGia[]>([])
  const [truoc, setTruoc] = useState<PhieuDanhGia[]>([])
  const [lops, setLops] = useState<Lop[]>([])
  const [hss, setHss] = useState<HocSinh[]>([])
  const [lopId, setLopId] = useState<string>()

  const tai = async () => {
    const thangTruoc = `${congThang(thang, -1)}-01`
    const [l, p, pt, lo, hs] = await Promise.all([
      q(sb.from('link_danh_gia').select('ma').eq('thang', `${thang}-01`).maybeSingle()),
      q(sb.from('danh_gia').select('*').eq('thang', `${thang}-01`).order('gui_luc')),
      q(sb.from('danh_gia').select('*').eq('thang', thangTruoc)),
      q(sb.from('lop').select('*').eq('hoat_dong', true).order('ten')),
      q(sb.from('hoc_sinh').select('*').eq('trang_thai', 'dang_hoc').order('ho_ten')),
    ])
    setMa((l as { ma: string } | null)?.ma ?? null)
    setPhieus(p as PhieuDanhGia[]); setTruoc(pt as PhieuDanhGia[]); setLops(lo as Lop[]); setHss(hs as HocSinh[])
  }
  useEffect(() => { tai().catch((e) => message.error(e.message)) }, [thang])

  // tạo và đổi link là một lệnh: ghi mã mới cho tháng, link cũ hết hiệu lực
  const ghiMa = () => q(sb.from('link_danh_gia').upsert({ thang: `${thang}-01`, ma: taoMa() })).then(tai).catch((e) => message.error(e.message))
  const doiLink = () => modal.confirm({
    title: 'Đổi link?', content: 'Link cũ sẽ không mở được nữa. Phiếu đã gửi vẫn giữ nguyên.', okText: 'Đổi link', onOk: ghiMa,
  })
  const xoa = (p: PhieuDanhGia) => modal.confirm({
    title: `Xoá phiếu của ${p.ten_hoc_sinh}?`, content: 'Xoá rồi em đó gửi lại được.', okText: 'Xoá', okButtonProps: { danger: true },
    onOk: () => q(sb.from('danh_gia').delete().eq('id', p.id)).then(tai).catch((e) => message.error(e.message)),
  })

  const k = tongHop(phieus, lopId)
  const kTruoc = tongHop(truoc, lopId)
  const han = hanNhan(thang)
  const conNhan = dayjs().format('YYYY-MM-DD') <= han
  // em chưa gửi: tính trên học sinh đang học của lớp đang hoạt động
  const daGui = new Set(phieus.map((p) => p.hoc_sinh_id))
  const lopXet = lops.filter((l) => !lopId || l.id === lopId)
  const chuaGui = hss.filter((h) => lopXet.some((l) => l.id === h.lop_id) && !daGui.has(h.id))
  const tongEm = hss.filter((h) => lopXet.some((l) => l.id === h.lop_id)).length
  const dsPhieu = lopId ? phieus.filter((p) => p.lop_id === lopId) : phieus

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space wrap>
        <DatePicker picker="month" value={dayjs(thang)} onChange={(x) => x && setThang(x.format('YYYY-MM'))} format="MM/YYYY" allowClear={false} />
        <Select style={{ minWidth: 160 }} value={lopId ?? ''} onChange={(v) => setLopId(v || undefined)}
          options={[{ value: '', label: 'Tất cả lớp' }, ...lops.map((l) => ({ value: l.id, label: l.ten }))]} />
      </Space>

      <Card size="small" title="Link phiếu đánh giá">
        {ma === undefined ? null : ma ? (
          <Space direction="vertical" style={{ width: '100%' }}>
            <code style={{ wordBreak: 'break-all' }} data-link-danh-gia>{urlPhieu(ma)}</code>
            <div style={{ fontSize: 13, color: conNhan ? MAU.chuPhu : MAU.do }}>
              {conNhan ? `Nhận phiếu tới hết ngày ${han.slice(8)}/${han.slice(5, 7)}` : 'Link đã hết hạn nhận phiếu'}
            </div>
            <Space wrap>
              <Button type="primary" onClick={() => navigator.clipboard.writeText(urlPhieu(ma)).then(() => message.success('Đã sao chép, dán vào Zalo'))}>Sao chép link</Button>
              <Button onClick={doiLink}>Đổi link</Button>
            </Space>
          </Space>
        ) : <Button type="primary" onClick={ghiMa}>Tạo link tháng {thang.slice(5)}/{thang.slice(0, 4)}</Button>}
      </Card>

      <Card size="small" title={`Đã gửi ${k.soPhieu} / ${tongEm} em`}>
        {!lopId && k.theoLop.length > 0 && <div style={{ marginBottom: 8 }}>{k.theoLop.map(([l, n]) => <Tag key={l}>{l}: {n}</Tag>)}</div>}
        {chuaGui.length > 0 && <div style={{ fontSize: 13, color: MAU.chuPhu }}>Chưa gửi: {chuaGui.map((h) => h.ho_ten).join(', ')}</div>}
      </Card>

      <Card size="small" title="Trợ giảng" styles={{ body: { padding: 0 } }}>
        <Table size="small" pagination={false} rowKey="id" dataSource={k.troGiang} scroll={{ x: true }} locale={{ emptyText: 'Chưa có phiếu' }}
          columns={[
            { title: 'Trợ giảng', dataIndex: 'ten' },
            { title: 'Phiếu', dataIndex: 'soPhieu', align: 'right' },
            ...TIEU_CHI.map((c) => ({ title: c.ten, dataIndex: c.key, align: 'right' as const })),
            {
              title: 'Chung', dataIndex: 'chung', align: 'right',
              render: (v: number, r) => {
                const cu = kTruoc.troGiang.find((x) => x.id === r.id)?.chung
                const lech = cu === undefined ? 0 : Math.round((v - cu) * 10) / 10
                return <b>{v}{lech !== 0 && <span style={{ color: lech > 0 ? MAU.tot : MAU.do, fontSize: 12 }}> {lech > 0 ? '▲' : '▼'}{Math.abs(lech)}</span>}</b>
              },
            },
          ]} />
        <div style={{ fontSize: 12, color: MAU.chuPhu, padding: '6px 12px' }}>Điểm 1–5. ▲▼ so với điểm chung tháng trước.</div>
      </Card>

      {(Object.keys(CAU_VIET) as (keyof typeof CAU_VIET)[]).map((c) => k.nhanXet[c].length > 0 && (
        // câu hỏi đầy đủ dài, tiêu đề thẻ bị cắt trên điện thoại nên dùng tên ngắn
        <Card key={c} size="small" title={TEN_NGAN[c]}>
          {k.nhanXet[c].map((y, i) => (
            <div key={i} style={{ padding: '6px 0', borderTop: i ? `1px solid ${MAU.vien}` : undefined }}>
              <div style={{ whiteSpace: 'pre-wrap' }}>{y.noiDung}</div>
              <div style={{ fontSize: 12, color: MAU.chuPhu }}>{y.hocSinh} · {y.lop}{y.troGiang && ` · về ${y.troGiang}`}</div>
            </div>
          ))}
        </Card>
      ))}

      {dsPhieu.length > 0 && <Collapse items={[{
        key: '1', label: `Từng phiếu (${dsPhieu.length})`,
        children: dsPhieu.map((p) => (
          <div key={p.id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 0', borderTop: `1px solid ${MAU.vien}` }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <b>{p.ten_hoc_sinh}</b> <span style={{ color: MAU.chuPhu, fontSize: 12 }}>{p.ten_lop} · {dayjs(p.gui_luc).format('DD/MM HH:mm')}</span>
              <div style={{ fontSize: 12, color: MAU.chuPhu }}>
                {p.tro_giang.length ? p.tro_giang.map((t) => `${t.ten}: ${t.kien_thuc}-${t.tuong_tac}-${t.ho_tro}`).join(' · ') : 'Không có trợ giảng'}
              </div>
            </div>
            <Button size="small" danger onClick={() => xoa(p)}>Xoá</Button>
          </div>
        )),
      }]} />}
    </Space>
  )
}
