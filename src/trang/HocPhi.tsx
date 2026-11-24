import { useEffect, useState } from 'react'
import { App, Avatar, Button, Card, DatePicker, Empty, Input, Segmented, Select, Space, Tag } from 'antd'
import dayjs from 'dayjs'
import { taiDuLieuThang, tongCong, type DongHs, type DuLieuThang } from '../du-lieu'
import { chuaCoGoiThang, demBuoiDuKienNhieuLop, goiCuaThang, moTaGiaThang, tinhTienThangNhieuLop, tinhTrangGoiNhieuLop, tinNhanGiaHan, trangThaiThang, vnd, type Thang } from '../hoc-phi'
import { giaGhiDanh, homNay, hsDangHoc, q, sb, taiHet, urlAnh, useMotLan, type HocSinh } from '../supabase'
import HocSinhChiTiet from './HocSinhChiTiet'
import { CHU_SO, MAU } from '../giao-dien'
import KhoaSoThang from '../thanh-phan/KhoaSoThang'
import NutTaiXuong from '../thanh-phan/NutTaiXuong'
import { OChiTimKiem } from '../thanh-phan/TimKiemChonNhanh'

const khongDau = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase()

// bảng → khoá chính, để đọc theo trang không trùng / sót dòng
const BANG: Record<string, string[]> = {
  tai_khoan: ['id'], lop: ['id'], hoc_sinh: ['id'], ghi_danh: ['id'], buoi_hoc: ['id'], diem_danh: ['buoi_id', 'hoc_sinh_id'],
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
  const [thang, setThang] = useState<Thang>(dayjs().format('YYYY-MM'))
  const [d, setD] = useState<DuLieuThang>()
  const [loc, setLoc] = useState<'tat_ca' | 'no' | 'du' | 'gia_han'>('tat_ca')
  const [tim, setTim] = useState('')
  const [lopId, setLopId] = useState('')
  const [khoaDen, setKhoaDen] = useState<string | null>(null)
  const [xem, setXem] = useState<HocSinh | null>(null)
  const [url, setUrl] = useState<Record<string, string>>({})
  const [dungLuong, setDungLuong] = useState<number>()
  useEffect(() => { sb.rpc('dung_luong_anh').then(({ data }) => setDungLuong(data ?? undefined)) }, [])

  // daHuy: đổi tháng nhanh thì số của tháng cũ về muộn không được hiện dưới tên tháng mới
  const tai = async (daHuy: (() => boolean) | unknown = () => false) => {
    const [x, k] = await Promise.all([taiDuLieuThang(thang), q(sb.from('khoa_so').select('khoa_den').single())])
    if (typeof daHuy === 'function' && daHuy()) return
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
  // await và khoá bấm đúp qua useMotLan để bắt đủ lỗi xuất Excel vào UI thay vì unhandled rejection
  const [xuat, dangXuat] = useMotLan(async () => {
    if (!d) return
    try {
      await (await import('../xuat-excel')).xuatExcel(d)
    } catch (e) {
      message.error((e as Error).message)
    }
  })

  if (xem && d) return <HocSinhChiTiet hs={xem} lops={d.lops} ghiDanh={d.ghiDanh} quayLai={() => { setXem(null); taiLai() }} />
  if (!d) return null

  const t = tongCong(d)
  const daChot = !!khoaDen && `${thang}-01` <= khoaDen
  const lopMap = new Map(d.lops.map((l) => [l.id, l]))
  const timK = khongDau(tim.trim())
  const khopBoLoc = (r: DongHs) =>
    (!lopId || r.lopIds.includes(lopId)) && (!timK || khongDau(r.hs.ho_ten).includes(timK) || khongDau(r.hs.ma_hs).includes(timK))
  const chuaGoi = (r: DongHs) => chuaCoGoiThang(r, d.goi, thang)
  const loc1 = (r: DongHs) => (loc === 'tat_ca' || (loc === 'no' ? r.conPhaiThu > 0 : r.conPhaiThu <= 0 && !chuaGoi(r))) && khopBoLoc(r)

  const moTaGia = (r: DongHs) =>
    moTaGiaThang(r.hs, r.ghiDanh, goiCuaThang(d.goi.filter((x) => x.hoc_sinh_id === r.hs.id), thang))

  // báo gia hạn tính theo hôm nay trên mọi lớp đang học của em
  const hn = homNay()
  const giaHan = d.dong.filter((r) => hsDangHoc(d.ghiDanh, r.hs.id)).flatMap((r) => {
    const dsLop = r.ghiDanh.filter((g) => g.trang_thai === 'dang_hoc').flatMap((g) => {
      const l = lopMap.get(g.lop_id)
      return l ? [{ lop_id: l.id, lich: l.lich, ngay_vao: g.ngay_vao, don_gia: giaGhiDanh(r.hs, g) }] : []
    })
    if (!dsLop.length || dsLop.every((x) => x.don_gia === 0)) return []
    const tt = tinhTrangGoiNhieuLop(d.goi.filter((g) => g.hoc_sinh_id === r.hs.id), dsLop, hn)
    if (tt.loai === 'con') return []
    const soBuoiKe = demBuoiDuKienNhieuLop(dsLop, tt.thangKe, 1)[tt.thangKe]
    const tienKe = tinhTienThangNhieuLop(dsLop, r.hs.don_gia, tt.thangKe, 1)?.[tt.thangKe]
    return [{ r, tt, tinNhan: tinNhanGiaHan(r.hs.ho_ten, tt, soBuoiKe, r.hs.don_gia, tienKe) }]
  }).sort((a, b) => a.tt.conBuoi - b.tt.conBuoi)
  const ngayKt = (buoiCuoi?: string) => (buoiCuoi ? `${buoiCuoi.slice(8)}/${buoiCuoi.slice(5, 7)}` : 'chưa có lịch')
  const nhanGoi = (tt: (typeof giaHan)[number]['tt']) => tt.loai === 'chua_co' ? 'Chưa có gói'
    : tt.loai === 'het' ? `Hết gói ${ngayKt(tt.buoiCuoi)}` : `Còn ${tt.conBuoi} buổi · hết ${ngayKt(tt.buoiCuoi)}`

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
      onOk: () => q(sb.rpc('mo_khoa', { thang: `${thang}-01`, ly_do: lyDo })).then(() => tai()).catch((e) => { message.error(e.message); throw e }),
    })
  }

  const dsGiaHan = giaHan.filter((x) => khopBoLoc(x.r))
  const dsDong = d.dong.filter(loc1)

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space wrap>
        <DatePicker picker="month" value={dayjs(thang)} onChange={(x) => x && setThang(x.format('YYYY-MM'))} format="MM/YYYY" allowClear={false} />
        <NutTaiXuong label="Xuất Excel" loading={dangXuat} onDownload={() => xuat()} />
        <NutTaiXuong label="Sao lưu toàn bộ" variant="secondary" loading={dangSaoLuu} onDownload={() => saoLuu()} />
      </Space>
      <KhoaSoThang daChot={daChot} thang={thang} onChot={chot} onMoKhoa={moKhoa} />
      {dungLuong !== undefined && <div style={{ fontSize: 13, color: dungLuong > 800 * 2 ** 20 ? MAU.do : MAU.chuPhu }} data-dung-luong-anh>
        Ảnh đang dùng: {(dungLuong / 2 ** 20).toFixed(1)} MB / 1 GB. Ảnh lớp cũ hơn 3 tháng tự cất lên GitHub và xoá khỏi đây mỗi tháng.
      </div>}

      {/* một khối kẻ ô như trang sổ, không tách thành nhiều thẻ */}
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

      <Space wrap style={{ width: '100%' }}>
        <OChiTimKiem value={tim} onChange={setTim} placeholder="Tìm tên hoặc mã HS" ariaLabel="Tìm học sinh" style={{ width: 240, maxWidth: '100%' }} />
        <Select value={lopId} onChange={setLopId} style={{ minWidth: 160 }}
          options={[{ value: '', label: 'Tất cả lớp' }, ...d.lops.map((l) => ({ value: l.id, label: l.ten }))]} />
      </Space>

      {loc === 'gia_han' && (dsGiaHan.length === 0 ? <Empty description="Không có học sinh nào" /> : (
        <Card size="small" styles={{ body: { padding: 0 } }}>
          {dsGiaHan.map(({ r, tt, tinNhan }, idx) => (
            <div key={r.hs.id} style={{ padding: '10px 12px', borderTop: idx ? `1px solid ${MAU.vien}` : undefined }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <a onClick={() => setXem(r.hs)} style={{ fontWeight: 500 }}>{r.hs.ho_ten} <Tag>{r.hs.ma_hs}</Tag></a>
                <Tag color={tt.loai === 'sap_het' ? 'orange' : 'red'} style={{ marginInlineEnd: 0 }}>{nhanGoi(tt)}</Tag>
              </div>
              <div style={{ fontSize: 12, color: MAU.chuPhu }}>
                {[r.tenLops, moTaGia(r), r.hs.ten_phu_huynh, r.hs.sdt_phu_huynh].filter(Boolean).join(' · ')}
              </div>
              <Space wrap size="small" style={{ marginTop: 6 }}>
                <Button size="small" onClick={() => navigator.clipboard.writeText(tinNhan).then(() => message.success('Đã sao chép, dán vào Zalo')).catch(() => message.error('Không sao chép được, hãy chép tay'))}>Sao chép tin nhắn</Button>
                {r.hs.sdt_phu_huynh && <Button size="small" href={`https://zalo.me/${r.hs.sdt_phu_huynh}`} target="_blank">Mở Zalo PH</Button>}
                {r.hs.link_zalo && <Button size="small" href={r.hs.link_zalo} target="_blank" rel="noreferrer">Mở nhóm Zalo</Button>}
              </Space>
            </div>
          ))}
        </Card>
      ))}
      {loc !== 'gia_han' && (dsDong.length === 0 ? <Empty description="Không có học sinh nào" /> : (
        <Card size="small" styles={{ body: { padding: 0 } }}>
          {dsDong.map((r, idx) => (
            <button key={r.hs.id} type="button" onClick={() => setXem(r.hs)} style={{
              all: 'unset', boxSizing: 'border-box', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderTop: idx ? `1px solid ${MAU.vien}` : undefined,
            }}>
              <Avatar shape="square" src={r.hs.avatar && url[r.hs.avatar]}>{r.hs.ho_ten.split(' ').pop()?.[0]}</Avatar>
              <div style={{ flexGrow: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 500 }}>{r.hs.ho_ten} <Tag>{r.hs.ma_hs}</Tag></div>
                <div style={{ fontSize: 12, color: MAU.chuPhu }}>
                  {[r.tenLops, moTaGia(r), `${r.soBuoi} buổi`, `học phí ${vnd(r.phaiThu)}`, r.noKyTruoc ? `nợ trước ${vnd(r.noKyTruoc)}` : ''].filter(Boolean).join(' · ')}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <b style={{ color: r.conPhaiThu > 0 ? MAU.do : chuaGoi(r) ? MAU.chuPhu : MAU.tot }}>
                  {r.conPhaiThu > 0 ? vnd(r.conPhaiThu) : chuaGoi(r) ? 'Chưa có gói' : trangThaiThang(r) === 'dong_truoc' ? 'Đã đủ (đóng trước)' : 'Đã đủ'}
                </b>
                {r.conPhaiThu > 0 && <div style={{ fontSize: 12, color: MAU.chuPhu }}>còn nợ</div>}
              </div>
            </button>
          ))}
        </Card>
      ))}
    </Space>
  )
}
