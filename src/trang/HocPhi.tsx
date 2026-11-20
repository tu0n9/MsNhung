import { useEffect, useState } from 'react'
import { App, Avatar, Button, Card, DatePicker, Input, Segmented, Space, Tag } from 'antd'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { taiDuLieuThang, tongCong, type DongHs, type DuLieuThang } from '../du-lieu'
import { demBuoiDuKien, tinhTrangGoi, tinNhanGiaHan, trangThaiThang, vnd, type Thang } from '../hoc-phi'
import { homNay, q, sb, taiHet, urlAnh, useMotLan, type HocSinh } from '../supabase'
import HocSinhChiTiet from './HocSinhChiTiet'
import { CHU_SO, MAU } from '../giao-dien'

// bảng → khoá chính, để đọc theo trang không trùng / sót dòng
const BANG: Record<string, string[]> = {
  tai_khoan: ['id'], lop: ['id'], hoc_sinh: ['id'], buoi_hoc: ['id'], diem_danh: ['buoi_id', 'hoc_sinh_id'],
  tro_giang_buoi: ['buoi_id', 'tro_giang_id'], anh_buoi: ['id'], goi_hoc: ['id'], phieu_thu: ['id'], chi_phi: ['id'],
  sticker_cong_tru: ['id'], khoa_so: ['id'], nhat_ky_chot_so: ['id'], link_danh_gia: ['thang'], danh_gia: ['id'],
  tom_tat_danh_gia: ['thang', 'lop_id'],
}

export async function saoLuuToanBo() {
  const du: Record<string, unknown> = { luc: new Date().toISOString() }
  // tro_giang_buoi: client không được đọc cột đơn giá; bản sao lưu đêm (pg_dump) mới có đủ
  for (const [b, khoa] of Object.entries(BANG)) du[b] = await taiHet((tu, den) => {
    let r = sb.from(b).select(b === 'tro_giang_buoi' ? 'buoi_id, tro_giang_id' : '*')
    for (const k of khoa) r = r.order(k)
    return r.range(tu, den)
  })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([JSON.stringify(du)], { type: 'application/json' }))
  a.download = `sao-luu-msnhung-${dayjs().format('YYYY-MM-DD-HHmm')}.json`
  a.click()
}

export default function HocPhi() {
  const { message, modal } = App.useApp()
  const nav = useNavigate()
  const [thang, setThang] = useState<Thang>(dayjs().format('YYYY-MM'))
  const [d, setD] = useState<DuLieuThang>()
  const [loc, setLoc] = useState<'tat_ca' | 'no' | 'du' | 'gia_han'>('tat_ca')
  const [khoaDen, setKhoaDen] = useState<string | null>(null)
  const [xem, setXem] = useState<HocSinh | null>(null)
  const [url, setUrl] = useState<Record<string, string>>({})
  const [dangXuat, setDangXuat] = useState(false)
  const [dungLuong, setDungLuong] = useState<number>()
  useEffect(() => { sb.rpc('dung_luong_anh').then(({ data }) => setDungLuong(data ?? undefined)) }, [])

  // daHuy: đổi tháng nhanh thì số của tháng cũ về muộn không được hiện dưới tên tháng mới
  const tai = async (daHuy = () => false) => {
    const [x, k] = await Promise.all([taiDuLieuThang(thang), q(sb.from('khoa_so').select('khoa_den').single())])
    if (daHuy()) return
    setD(x); setKhoaDen((k as { khoa_den: string | null }).khoa_den)
    setUrl(await urlAnh(x.dong.map((r) => r.hs.avatar!).filter(Boolean)))
  }
  const taiLai = () => tai().catch((e) => message.error(e.message))
  useEffect(() => {
    let huy = false
    tai(() => huy).catch((e) => message.error(e.message))
    return () => { huy = true }
  }, [thang])
  const [saoLuu, dangSaoLuu] = useMotLan(() => saoLuuToanBo().catch((e) => message.error(e.message)))

  if (xem && d) return <HocSinhChiTiet hs={xem} lop={d.lops.find((l) => l.id === xem.lop_id)!} quayLai={() => { setXem(null); taiLai() }} />
  if (!d) return null

  const t = tongCong(d)
  const daChot = !!khoaDen && `${thang}-01` <= khoaDen
  const loc1 = (r: DongHs) => loc === 'tat_ca' || (loc === 'no' ? r.conPhaiThu > 0 : r.conPhaiThu <= 0)
  // báo gia hạn tính theo hôm nay, không theo tháng đang chọn; em chưa có gói không hiện ở Công nợ nên phải bắt ở đây
  const hn = homNay()
  const giaHan = d.dong.filter((r) => r.hs.trang_thai === 'dang_hoc').flatMap((r) => {
    const lop = d.lops.find((l) => l.id === r.hs.lop_id)
    if (!lop) return []
    const tt = tinhTrangGoi(d.goi.filter((g) => g.hoc_sinh_id === r.hs.id), lop.lich, r.hs.ngay_vao, hn)
    if (tt.loai === 'con') return []
    const donGia = r.hs.don_gia_rieng ?? lop.don_gia
    const soBuoiKe = demBuoiDuKien(lop.lich, tt.thangKe, 1, r.hs.ngay_vao > `${tt.thangKe}-01` ? r.hs.ngay_vao : undefined)[tt.thangKe]
    return [{ r, tt, tinNhan: tinNhanGiaHan(r.hs.ho_ten, tt, soBuoiKe, donGia) }]
  }).sort((a, b) => a.tt.conBuoi - b.tt.conBuoi)
  const nhanGoi = (tt: (typeof giaHan)[number]['tt']) => tt.loai === 'chua_co' ? 'Chưa có gói'
    : tt.loai === 'het' ? `Hết gói ${tt.buoiCuoi?.slice(8)}/${tt.buoiCuoi?.slice(5, 7)}` : `Còn ${tt.conBuoi} buổi · hết ${tt.buoiCuoi?.slice(8)}/${tt.buoiCuoi?.slice(5, 7)}`

  const chot = () => modal.confirm({
    title: `Chốt sổ tháng ${thang.slice(5)}/${thang.slice(0, 4)}?`,
    content: 'Sau khi chốt, điểm danh, phiếu thu, chi phí đến hết tháng này không sửa được nữa.',
    onOk: async () => {
      try {
        await q(sb.rpc('chot_so', { thang: `${thang}-01` })); taiLai()
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

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space wrap>
        <DatePicker picker="month" value={dayjs(thang)} onChange={(x) => x && setThang(x.format('YYYY-MM'))} format="MM/YYYY" allowClear={false} />
        {daChot ? <><Tag color="green">Đã chốt sổ</Tag><Button onClick={moKhoa}>Mở khoá</Button></> : <Button onClick={chot}>Chốt sổ tháng</Button>}
        <Button type="primary" loading={dangXuat} onClick={xuat}>Xuất Excel</Button>
        <Button loading={dangSaoLuu} onClick={() => saoLuu()}>Sao lưu toàn bộ</Button>
        <Button onClick={() => nav('/danh-gia')}>Đánh giá học sinh</Button>
      </Space>
      {dungLuong !== undefined && <div style={{ fontSize: 13, color: dungLuong > 800 * 2 ** 20 ? MAU.do : MAU.chuPhu }} data-dung-luong-anh>
        Ảnh đang dùng: {(dungLuong / 2 ** 20).toFixed(1)} MB / 1 GB. Ảnh lớp cũ hơn 3 tháng tự cất lên GitHub và xoá khỏi đây mỗi tháng.
      </div>}

      {/* phong cách 3: một khối kẻ ô như trang sổ, không tách thành nhiều thẻ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', border: `1px solid ${MAU.vien}`, borderRadius: 14, background: MAU.mat }}>
        {([['Phải thu', t.phaiThu], ['Nợ kỳ trước', t.noKyTruoc], ['Đã thu', t.daThu], ['Thực thu trong tháng', t.thucThu, MAU.tot],
          ['Tổng chi', t.tongChi], ['Chênh lệch thu chi', t.chenhLech, t.chenhLech < 0 ? MAU.do : MAU.tot]] as const).map(([ten, v, mau], i) => (
          <div key={ten} style={{ padding: '10px 12px', borderBottom: `1px solid ${MAU.vien}`, borderRight: i % 2 === 0 ? `1px solid ${MAU.vien}` : undefined }}>
            <div style={{ fontSize: 12, color: MAU.chuPhu }}>{ten}</div>
            <b style={{ fontSize: 17, color: mau }}>{vnd(v)}</b>
          </div>
        ))}
        <div style={{ gridColumn: 'span 2', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ color: MAU.chuPhu }}>Còn phải thu</span>
          <b style={{ fontSize: 28, fontFamily: CHU_SO, color: t.conPhaiThu > 0 ? MAU.do : MAU.tot }}>{vnd(t.conPhaiThu)}</b>
        </div>
      </div>

      <Segmented value={loc} onChange={(v) => setLoc(v as typeof loc)} options={[
        { value: 'tat_ca', label: 'Tất cả' }, { value: 'no', label: `Còn nợ ${d.dong.filter((r) => r.conPhaiThu > 0).length}` }, { value: 'du', label: 'Đã đủ' }, { value: 'gia_han', label: `Sắp hết gói ${giaHan.length}` }]} />

      {loc === 'gia_han' && d.lops.map((l) => {
        const ds = giaHan.filter((x) => x.r.hs.lop_id === l.id)
        if (!ds.length) return null
        return (
          <Card key={l.id} size="small" title={l.ten} styles={{ body: { padding: 0 } }}>
            {ds.map(({ r, tt, tinNhan }) => (
              <div key={r.hs.id} style={{ padding: '10px 12px', borderTop: `1px solid ${MAU.vien}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <a onClick={() => setXem(r.hs)} style={{ fontWeight: 500 }}>{r.hs.ho_ten}</a>
                  <Tag color={tt.loai === 'sap_het' ? 'orange' : 'red'} style={{ marginInlineEnd: 0 }}>{nhanGoi(tt)}</Tag>
                </div>
                {r.hs.sdt_phu_huynh && <div style={{ fontSize: 12, color: MAU.chuPhu }}>{r.hs.ten_phu_huynh ? `${r.hs.ten_phu_huynh} · ` : ''}{r.hs.sdt_phu_huynh}</div>}
                <Space wrap size="small" style={{ marginTop: 6 }}>
                  <Button size="small" onClick={() => navigator.clipboard.writeText(tinNhan).then(() => message.success('Đã sao chép, dán vào Zalo')).catch(() => message.error('Không sao chép được, hãy chép tay'))}>Sao chép tin nhắn</Button>
                  {r.hs.sdt_phu_huynh && <Button size="small" href={`https://zalo.me/${r.hs.sdt_phu_huynh}`} target="_blank">Mở Zalo PH</Button>}
                  {r.hs.link_zalo && <Button size="small" href={r.hs.link_zalo} target="_blank" rel="noreferrer">Mở nhóm Zalo</Button>}
                </Space>
              </div>
            ))}
          </Card>
        )
      })}
      {loc !== 'gia_han' && d.lops.map((l) => {
        const ds = d.dong.filter((r) => r.hs.lop_id === l.id && loc1(r))
        if (!ds.length) return null
        return (
          <Card key={l.id} size="small" title={l.ten} styles={{ body: { padding: 0 } }}>
            {ds.map((r) => (
              <button key={r.hs.id} type="button" onClick={() => setXem(r.hs)} style={{
                all: 'unset', boxSizing: 'border-box', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderTop: `1px solid ${MAU.vien}`,
              }}>
                <Avatar shape="square" src={r.hs.avatar && url[r.hs.avatar]}>{r.hs.ho_ten.split(' ').pop()?.[0]}</Avatar>
                <div style={{ flexGrow: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500 }}>{r.hs.ho_ten}</div>
                  <div style={{ fontSize: 12, color: MAU.chuPhu }}>
                    {r.soBuoi} buổi · học phí {vnd(r.phaiThu)}{r.noKyTruoc ? ` · nợ trước ${vnd(r.noKyTruoc)}` : ''}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <b style={{ color: r.conPhaiThu > 0 ? MAU.do : MAU.tot }}>{r.conPhaiThu > 0 ? vnd(r.conPhaiThu) : trangThaiThang(r) === 'dong_truoc' ? 'Đã đủ (đóng trước)' : 'Đã đủ'}</b>
                  {r.conPhaiThu > 0 && <div style={{ fontSize: 12, color: MAU.chuPhu }}>còn nợ</div>}
                </div>
              </button>
            ))}
          </Card>
        )
      })}
    </Space>
  )
}
