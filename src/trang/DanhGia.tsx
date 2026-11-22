// Kết quả phiếu đánh giá của học sinh, chỉ giáo viên (docs/YEU-CAU.md mục "Đánh giá từ học sinh").
import { useEffect, useRef, useState } from 'react'
import { App, Button, Card, Collapse, DatePicker, Progress, Select, Space, Table, Tag } from 'antd'
import dayjs from 'dayjs'
import { CAU_VIET, hanNhan, taoMa, thongKeDaGui, TIEU_CHI, tongHop, urlPhieu, type PhieuDanhGia } from '../danh-gia'
import { congThang, type Thang } from '../hoc-phi'
import { goiHam, q, sb, taiHet, useMotLan, type GhiDanh, type HocSinh, type Lop } from '../supabase'
import { MAU } from '../giao-dien'

const TEN_NGAN: Record<keyof typeof CAU_VIET, string> = {
  khoa_hoc: 'Nhận xét khoá học', kho_khan: 'Khó khăn khi học', nhan_xet: 'Nhận xét gửi trợ giảng', chua_bai: 'Chữa bài tập về nhà',
}

interface TomTat {
  so_phieu: number; tao_luc: string
  noi_dung: { khoa_hoc: Record<'y_chinh' | 'kho_khan' | 'de_xuat', string[]>; tro_giang: { ten: string; diem_manh: string[]; can_cai_thien: string[] }[] }
}

const DanhSach = ({ ten, ds }: { ten: string; ds: string[] }) => !ds.length ? null : (
  <div style={{ marginBottom: 8 }}>
    <div style={{ fontWeight: 600 }}>{ten}</div>
    <ul style={{ margin: '2px 0 0', paddingLeft: 20 }}>{ds.map((x, i) => <li key={i}>{x}</li>)}</ul>
  </div>
)

export default function DanhGia() {
  const { message, modal } = App.useApp()
  const [thang, setThang] = useState<Thang>(dayjs().format('YYYY-MM'))
  const [ma, setMa] = useState<string | null>()
  const [phieus, setPhieus] = useState<PhieuDanhGia[]>([])
  const [truoc, setTruoc] = useState<PhieuDanhGia[]>([])
  const [lops, setLops] = useState<Lop[]>([])
  const [hss, setHss] = useState<HocSinh[]>([])
  const [gds, setGds] = useState<GhiDanh[]>([])
  const [lopId, setLopId] = useState<string>()
  const [tomTat, setTomTat] = useState<TomTat | null>(null)

  const tai = async () => {
    const thangTruoc = `${congThang(thang, -1)}-01`
    const [l, p, pt, lo, hs, gd] = await Promise.all([
      q(sb.from('link_danh_gia').select('ma').eq('thang', `${thang}-01`).maybeSingle()),
      q(sb.from('danh_gia').select('*').eq('thang', `${thang}-01`).order('gui_luc')),
      q(sb.from('danh_gia').select('*').eq('thang', thangTruoc)),
      q(sb.from('lop').select('*').eq('hoat_dong', true).order('ten')),
      taiHet((a, b) => sb.from('hoc_sinh').select('*').order('ho_ten').order('id').range(a, b)),
      taiHet((a, b) => sb.from('ghi_danh').select('*').eq('trang_thai', 'dang_hoc').order('id').range(a, b)),
    ])
    setMa((l as { ma: string } | null)?.ma ?? null)
    setPhieus(p as PhieuDanhGia[]); setTruoc(pt as PhieuDanhGia[]); setLops(lo as Lop[]); setHss(hs as HocSinh[]); setGds(gd as GhiDanh[])
  }
  useEffect(() => { tai().catch((e) => message.error(e.message)) }, [thang])
  // bản tóm tắt theo (tháng, lớp): lọc "Tất cả lớp" thì không có
  // dangXem: AI trả lời chậm (tới vài chục giây); đổi lớp / tháng trong lúc chờ thì không hiện tóm tắt của lớp cũ
  const dangXem = useRef({ thang, lopId })
  dangXem.current = { thang, lopId }
  useEffect(() => {
    setTomTat(null)
    let huy = false
    if (lopId) q(sb.from('tom_tat_danh_gia').select('*').eq('thang', `${thang}-01`).eq('lop_id', lopId).maybeSingle())
      .then((data) => { if (!huy) setTomTat(data as never) }).catch((e) => message.error(e.message))
    return () => { huy = true }
  }, [thang, lopId])
  const [tomTatAi, dangTomTat] = useMotLan(async () => {
    const hoi = { thang, lopId }
    try {
      const kq = await goiHam('tom-tat-danh-gia', { thang, lop_id: lopId })
      if (dangXem.current.thang === hoi.thang && dangXem.current.lopId === hoi.lopId) setTomTat(kq)
      else message.success('Đã tóm tắt xong lớp trước, mở lại lớp đó để xem')
    } catch (e) { message.error((e as Error).message) }
  })

  // tạo và đổi link là một lệnh: ghi mã mới cho tháng, link cũ hết hiệu lực
  const [ghiMa, dangGhiMa] = useMotLan(() => q(sb.from('link_danh_gia').upsert({ thang: `${thang}-01`, ma: taoMa() })).then(tai).catch((e) => message.error(e.message)))
  const doiLink = () => modal.confirm({
    title: 'Đổi link?', content: 'Link cũ sẽ không mở được nữa. Phiếu đã gửi vẫn giữ nguyên.', okText: 'Đổi link', onOk: () => ghiMa(),
  })
  const xoa = (p: PhieuDanhGia) => modal.confirm({
    title: `Xoá phiếu của ${p.ten_hoc_sinh}?`, content: 'Xoá rồi em đó gửi lại được.', okText: 'Xoá', okButtonProps: { danger: true },
    onOk: () => q(sb.from('danh_gia').delete().eq('id', p.id)).then(tai).catch((e) => message.error(e.message)),
  })

  const k = tongHop(phieus, lopId)
  const kTruoc = tongHop(truoc, lopId)
  const han = hanNhan(thang)
  const conNhan = dayjs().format('YYYY-MM-DD') <= han
  // em đã gửi & chưa gửi: tính trên ghi_danh đang học của lớp đang hoạt động; mỗi em mỗi tháng chỉ gửi 1 phiếu duy nhất
  const { nhomLop, tongEm, soEmDaGui } = thongKeDaGui(phieus, lops, hss, gds, lopId)
  // mỗi em có nhóm Zalo riêng với phụ huynh (không có nhóm chung của lớp): chép sẵn lời nhắc rồi mở nhóm của em
  const loiNhac = (h: HocSinh) => `Nhắc con ${h.ho_ten} gửi phiếu đánh giá tháng ${thang.slice(5)}/${thang.slice(0, 4)}`
    + ` (hạn ${han.slice(8)}/${han.slice(5, 7)}): ${ma ? urlPhieu(ma) : ''}`
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
              <Button type="primary" onClick={() => navigator.clipboard.writeText(urlPhieu(ma)).then(() => message.success('Đã sao chép, dán vào Zalo')).catch(() => message.error('Không sao chép được, hãy chép tay'))}>Sao chép link</Button>
              <Button onClick={doiLink}>Đổi link</Button>
            </Space>
          </Space>
        ) : <Button type="primary" loading={dangGhiMa} onClick={() => ghiMa()}>Tạo link tháng {thang.slice(5)}/{thang.slice(0, 4)}</Button>}
      </Card>

      {/* mỗi em chỉ gửi 1 phiếu duy nhất mỗi tháng, kể cả khi học nhiều lớp */}
      <Card size="small" title={`Đã gửi ${soEmDaGui} / ${tongEm} học sinh`} extra={<span style={{ fontSize: 12, color: MAU.chuPhu }}>mỗi em một phiếu</span>}>
        <Collapse size="small" key={lopId ?? ''} defaultActiveKey={lopId ? [lopId] : []} items={nhomLop.map(({ l, tong, chua }) => {
          // em có nút nhắc thì mỗi em một dòng; em chưa có link Zalo chỉ cần tên, xếp sát nhau cho danh sách ngắn lại
          const coNut = ma ? chua.filter((h) => h.link_zalo) : []
          const chiTen = chua.filter((h) => !coNut.includes(h))
          return {
            key: l.id, collapsible: chua.length ? undefined : 'disabled' as const,
            label: <div data-lop-chua-gui={l.ten} style={{ padding: '4px 0' }}>
              <b>{l.ten}</b> · đã gửi {tong - chua.length}/{tong}{!chua.length && ' ✓'}
              <Progress percent={Math.round(((tong - chua.length) / tong) * 100)} showInfo={false} size="small"
                strokeColor={chua.length ? MAU.chinh : MAU.tot} style={{ margin: 0 }} />
            </div>,
            children: <>
              {coNut.map((h) => (
                <div key={h.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, minHeight: 44 }}>
                  <span>{h.ho_ten}</span>
                  {/* <a> mở nhóm ngay trong cú chạm (chặn popup nếu mở sau khi chờ chép xong); onClick chép lời nhắc trước */}
                  <Button size="small" href={h.link_zalo!} target="_blank" rel="noreferrer"
                    onClick={() => navigator.clipboard.writeText(loiNhac(h)).then(() => message.success('Đã chép lời nhắc, dán vào nhóm Zalo'))
                      .catch(() => message.error('Không chép được lời nhắc, hãy gõ tay'))}>Nhắc qua Zalo</Button>
                </div>))}
              {chiTen.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: coNut.length ? 8 : 0 }}>
                {chiTen.map((h) => <Tag key={h.id} style={{ margin: 0, padding: '2px 8px', fontSize: 13 }}>{h.ho_ten}</Tag>)}
              </div>}
            </>,
          }
        })} />
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

      {lopId && k.soPhieu > 0 && (
        <Card size="small" title="Tóm tắt bằng AI" extra={tomTat &&
          <Button size="small" loading={dangTomTat} onClick={tomTatAi}>Tóm tắt lại</Button>}>
          {tomTat ? <>
            <DanhSach ten="Ý chính về khoá học" ds={tomTat.noi_dung.khoa_hoc.y_chinh} />
            <DanhSach ten="Khó khăn" ds={tomTat.noi_dung.khoa_hoc.kho_khan} />
            <DanhSach ten="Đề xuất" ds={tomTat.noi_dung.khoa_hoc.de_xuat} />
            {tomTat.noi_dung.tro_giang.map((t) => (
              <div key={t.ten} style={{ borderTop: `1px solid ${MAU.vien}`, paddingTop: 8 }}>
                <b style={{ color: MAU.chinh }}>{t.ten}</b>
                <DanhSach ten="Điểm mạnh" ds={t.diem_manh} />
                <DanhSach ten="Cần cải thiện" ds={t.can_cai_thien} />
              </div>
            ))}
            <div style={{ fontSize: 12, color: MAU.chuPhu }} data-tom-tat>
              Tóm tắt lúc {dayjs(tomTat.tao_luc).format('DD/MM HH:mm')} từ {tomTat.so_phieu} phiếu
              {tomTat.so_phieu !== k.soPhieu && <span style={{ color: MAU.do }}> (số phiếu đã đổi, nên tóm tắt lại)</span>}
            </div>
          </> : <>
            <Button type="primary" loading={dangTomTat} onClick={tomTatAi}>Tóm tắt bằng AI</Button>
            <div style={{ fontSize: 12, color: MAU.chuPhu, marginTop: 6 }}>
              {dangTomTat ? 'Đang đọc phiếu, mất khoảng 10–30 giây…' : 'Gemini đọc nhận xét của lớp này và rút ra ý chính. Tên học sinh không gửi đi.'}
            </div>
          </>}
        </Card>
      )}

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
