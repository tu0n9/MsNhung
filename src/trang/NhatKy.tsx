// Nhật ký thao tác: chỉ giáo viên xem (RLS). Dòng do trigger ghi trong database, trang này chỉ đọc.
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { App, Button, DatePicker, Select, Space, Table, Tag } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { q, sb } from '../supabase'
import PhanTrangTruot from '../thanh-phan/PhanTrangTruot'

interface Dong {
  id: number; luc: string; nguoi: string | null; ten_nguoi: string | null; bang: string; hanh_dong: string
  doi_tuong: string | null; thay_doi: Record<string, unknown> | null
}

const LOAI: Record<string, string> = {
  sticker_cong_tru: 'Sticker ngoài buổi', tro_giang_buoi: 'Trợ giảng có mặt', buoi_hoc: 'Buổi học', lop: 'Lớp',
  hoc_sinh: 'Học sinh', ghi_danh: 'Ghi danh', goi_hoc: 'Gói học', phieu_thu: 'Phiếu thu', chi_phi: 'Chi phí',
  tai_khoan: 'Tài khoản', nhat_ky_chot_so: 'Chốt sổ',
}
const HANH_DONG: Record<string, { ten: string; mau: string }> = {
  them: { ten: 'Thêm', mau: 'green' }, sua: { ten: 'Sửa', mau: 'blue' }, xoa: { ten: 'Xoá', mau: 'red' },
  dang_nhap: { ten: 'Đăng nhập', mau: 'default' }, chot: { ten: 'Chốt sổ', mau: 'purple' }, mo_khoa: { ten: 'Mở khoá sổ', mau: 'orange' },
}
// cột hay gặp đổi sang tiếng Việt; cột khác giữ tên gốc
const COT: Record<string, string> = {
  so: 'Số', ly_do: 'Lý do', ngay: 'Ngày', ma_hs: 'Mã HS', ho_ten: 'Họ tên', ten: 'Tên', lop_nghi: 'Lớp nghỉ',
  trang_thai: 'Trạng thái', so_tien: 'Số tiền', ngay_thu: 'Ngày thu', hinh_thuc: 'Hình thức', don_gia: 'Đơn giá',
  don_gia_buoi: 'Đơn giá/ca', don_gia_rieng: 'Đơn giá riêng', tien_thang: 'Tiền tháng', lop_gia: 'Giá theo lớp',
  danh_muc: 'Mục', ghi_chu: 'Ghi chú', sdt_phu_huynh: 'SĐT phụ huynh',
  ten_phu_huynh: 'Tên phụ huynh', hoat_dong: 'Hoạt động', sticker_dau_ky: 'Sticker đã có', loai: 'Loại',
  bat_dau: 'Bắt đầu', ket_thuc: 'Kết thúc', ngay_vao: 'Ngày vào', thang_bat_dau: 'Từ tháng', so_thang: 'Số tháng',
  tien_du_tru: 'Trừ tiền dư', dieu_chinh: 'Điều chỉnh', ly_do_dieu_chinh: 'Lý do điều chỉnh', link_zalo: 'Link Zalo',
  so_dien_thoai: 'SĐT', ten_dang_nhap: 'Tên đăng nhập', vai_tro: 'Vai trò', phai_doi_mat_khau: 'Phải đổi mật khẩu',
}
// mã nội bộ, người đọc không cần
const AN = new Set(['id', 'tao_luc', 'nguoi', 'ten_nguoi', 'email', 'buoi_id', 'hoc_sinh_id', 'lop_id', 'goi_id',
  'tro_giang_id', 'phu_huynh_id', 'avatar', 'buoi_du_kien', 'gio_thu'])
const HE_THONG = '__he_thong'

const giaTri = (v: unknown) => v === null || v === undefined || v === '' ? '(trống)'
  : typeof v === 'boolean' ? (v ? 'có' : 'không') : typeof v === 'object' ? JSON.stringify(v) : String(v)
function chiTiet(d: Pick<Dong, 'hanh_dong' | 'thay_doi'>): string {
  return Object.entries(d.thay_doi ?? {}).filter(([k]) => !AN.has(k)).map(([k, v]) =>
    d.hanh_dong === 'sua' && Array.isArray(v) ? `${COT[k] ?? k}: ${giaTri(v[0])} → ${giaTri(v[1])}` : `${COT[k] ?? k}: ${giaTri(v)}`).join('; ')
}

const MOI_TRANG = 50

export default function NhatKy() {
  const { message } = App.useApp()
  const nav = useNavigate()
  const [khoang, setKhoang] = useState<[Dayjs, Dayjs]>([dayjs().subtract(6, 'day'), dayjs()])
  const [nguoi, setNguoi] = useState<string>()
  const [loai, setLoai] = useState<string>()
  const [trang, setTrang] = useState(1)
  const [ds, setDs] = useState<Dong[]>([])
  const [tong, setTong] = useState(0)
  const [dang, setDang] = useState(false)
  const [nguois, setNguois] = useState<string[]>([])

  useEffect(() => {
    q(sb.from('tai_khoan').select('ho_ten').neq('vai_tro', 'phu_huynh').order('ho_ten'))
      .then((x) => setNguois((x as { ho_ten: string }[]).map((t) => t.ho_ten))).catch((e) => message.error(e.message))
  }, [])

  useEffect(() => {
    let huy = false
    setDang(true)
    let r = sb.from('nhat_ky').select('*', { count: 'exact' })
      .gte('luc', khoang[0].startOf('day').toISOString()).lt('luc', khoang[1].add(1, 'day').startOf('day').toISOString())
    if (nguoi === HE_THONG) r = r.is('nguoi', null)
    else if (nguoi) r = r.eq('ten_nguoi', nguoi)
    if (loai) r = r.eq('bang', loai)
    r.order('luc', { ascending: false }).order('id', { ascending: false }).range((trang - 1) * MOI_TRANG, trang * MOI_TRANG - 1)
      .then(({ data, count, error }) => {
        if (huy) return
        if (error) message.error(error.message); else { setDs(data as Dong[]); setTong(count ?? 0) }
        setDang(false)
      })
    return () => { huy = true }
  }, [khoang, nguoi, loai, trang])

  return (
    <Space orientation="vertical" style={{ width: '100%' }}>
      <Space wrap>
        <Button onClick={() => nav('/tai-khoan')}>← Quay lại</Button>
        <b style={{ fontSize: 16 }}>Nhật ký thao tác</b>
      </Space>
      <Space wrap>
        <DatePicker.RangePicker value={khoang} format="DD/MM/YYYY" allowClear={false}
          onChange={(v) => { if (v?.[0] && v[1]) { setKhoang([v[0], v[1]]); setTrang(1) } }} />
        <Select allowClear placeholder="Mọi người" style={{ width: 170 }} value={nguoi} onChange={(v) => { setNguoi(v); setTrang(1) }}
          options={[{ value: HE_THONG, label: 'Hệ thống' }, ...nguois.map((t) => ({ value: t, label: t }))]} />
        <Select allowClear placeholder="Mọi loại" style={{ width: 170 }} value={loai} onChange={(v) => { setLoai(v); setTrang(1) }}
          options={Object.entries(LOAI).map(([value, label]) => ({ value, label }))} />
      </Space>
      <Table size="small" rowKey="id" loading={dang} dataSource={ds} scroll={{ x: true }}
        pagination={false} columns={[
          { title: 'Lúc', render: (_, d) => dayjs(d.luc).format('DD/MM HH:mm') },
          { title: 'Người', render: (_, d) => d.ten_nguoi ?? (d.nguoi ? '(tài khoản đã xoá)' : 'Hệ thống') },
          { title: 'Thao tác', render: (_, d) => <><Tag color={HANH_DONG[d.hanh_dong]?.mau}>{HANH_DONG[d.hanh_dong]?.ten ?? d.hanh_dong}</Tag>
            {d.hanh_dong !== 'dang_nhap' && (LOAI[d.bang] ?? d.bang)}</> },
          { title: 'Đối tượng', dataIndex: 'doi_tuong' },
          { title: 'Chi tiết', render: (_, d) => <span style={{ fontSize: 12 }}>{chiTiet(d)}</span> },
        ]} />
      <PhanTrangTruot current={trang} pageSize={MOI_TRANG} total={tong} onChange={setTrang} ariaLabel="Phân trang nhật ký" />
    </Space>
  )
}
