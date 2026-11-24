import { useMemo, useState, type FormEvent } from 'react'
import { Button, Card, Space, Tag } from 'antd'
import { FileExcelOutlined, HistoryOutlined, KeyOutlined, StarOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useCheDo, MAU, CHU_SO } from '../giao-dien'
import type { ONgay } from '../diem-danh-thang'
import type { Lop } from '../supabase'
import NutDoiGiaoDien from '../thanh-phan/NutDoiGiaoDien'
import MenuNhanh from '../thanh-phan/MenuNhanh'
import ONhapNoi from '../thanh-phan/ONhapNoi'
import NutGuiBienHinh from '../thanh-phan/NutGuiBienHinh'
import HopThoaiXoa from '../thanh-phan/HopThoaiXoa'
import { HopThoaiXoaXacNhanTen, ThongBaoThanhTienDo } from '../thanh-phan/HopThoaiXoaXacNhanTen'
import ThanhBuoc from '../thanh-phan/ThanhBuoc'
import VungTaiFile from '../thanh-phan/VungTaiFile'
import NutTaiXuong from '../thanh-phan/NutTaiXuong'
import KhoaSoThang from '../thanh-phan/KhoaSoThang'
import PhanTrangTruot from '../thanh-phan/PhanTrangTruot'
import LichDiemDanhThang from '../thanh-phan/LichDiemDanhThang'
import { HuyHieuDem, NutChonNhanh, OChiTimKiem } from '../thanh-phan/TimKiemChonNhanh'

const HS_MAU = [
  { id: '1', ten: 'Nguyễn Bảo An', ma: 'HS001', lop: 'Starters 1A', gia: '150.000 đ/buổi' },
  { id: '2', ten: 'Lê Minh Châu', ma: 'HS002', lop: 'Movers 2B', gia: '160.000 đ/buổi' },
  { id: '3', ten: 'Trần Gia Bảo', ma: 'HS003', lop: 'Chưa xếp lớp', gia: '150.000 đ/buổi' },
  { id: '4', ten: 'Phạm Khánh Linh', ma: 'HS004', lop: 'Starters 1A', gia: '150.000 đ/buổi' },
]

const LOP_MAU_MAP = new Map<string, Lop>([
  ['l1', { id: 'l1', ten: 'Starters 1A', don_gia: 150000, lich: [1, 3, 5], gio_thu: {}, hoat_dong: true }],
])
const LOP_IDS_SET = new Set(['l1'])

function taoLuoiMau(thang: string): (ONgay | null)[] {
  const dau = dayjs(`${thang}-01`)
  const offset = (dau.day() + 6) % 7
  const soNgay = dau.daysInMonth()
  const homNayStr = dayjs().format('YYYY-MM-DD')
  const cells: (ONgay | null)[] = Array.from({ length: offset }, () => null)
  for (let d = 1; d <= soNgay; d++) {
    const ngay = `${thang}-${String(d).padStart(2, '0')}`
    const thu = dayjs(ngay).day()
    const coLich = thu === 1 || thu === 3 || thu === 5
    const trang_thai: ONgay['trang_thai'] = !coLich
      ? 'trong'
      : d === 4
        ? 'vang'
        : d === 9
          ? 'hoc_bu'
          : d === 13
            ? 'lop_nghi'
            : d <= 18
              ? 'co_mat'
              : d <= 22
                ? 'chua_diem_danh'
                : 'sap_toi'
    cells.push({
      ngay,
      hom_nay: ngay === homNayStr || (thang === dayjs().format('YYYY-MM') && d === 15),
      trang_thai,
      buoi: coLich ? [{
        buoi: { id: `b-${d}`, lop_id: 'l1', ngay, loai: d === 9 ? 'bu' : 'lich', lop_nghi: d === 13 },
        trang_thai: trang_thai === 'co_mat' || trang_thai === 'vang' || trang_thai === 'hoc_bu' ? trang_thai : trang_thai === 'lop_nghi' ? 'lop_nghi' : 'chua_diem_danh',
        sticker: trang_thai === 'co_mat' ? 3 : trang_thai === 'hoc_bu' ? 2 : 0,
      }] : [],
    })
  }
  return cells
}

/** Trang demo cục bộ 100% offline để duyệt toàn bộ 12 hiệu ứng UX/UI mới trước khi dùng trên app thật. */
export default function DemoGiaoDien() {
  const { cheDo, doi } = useCheDo()

  // #403 Form mẫu
  const [tenDn, setTenDn] = useState('')
  const [mk, setMk] = useState('')
  const [loiForm, setLoiForm] = useState('')
  const [shake, setShake] = useState(0)
  const [btnState, setBtnState] = useState<'idle' | 'busy' | 'ok'>('idle')

  // #436 & #269
  const [moXoa, setMoXoa] = useState(false)
  const [moXoaLop, setMoXoaLop] = useState(false)
  const [toastText, setToastText] = useState<string | null>(null)

  // #444 Stepper
  const [buoc, setBuoc] = useState(1)

  // #350 Khoá sổ
  const [daChot, setDaChot] = useState(false)

  // #431 Lịch
  const [thangLich, setThangLich] = useState(dayjs().format('YYYY-MM'))
  const luoiMau = useMemo(() => taoLuoiMau(thangLich), [thangLich])

  // #449 Phân trang
  const [trang, setTrang] = useState(1)

  // #300 Tìm kiếm & chọn nhanh
  const [tuKhoa, setTuKhoa] = useState('')
  const [daChon, setDaChon] = useState<string[]>(['1'])

  const xuLyForm = (e: FormEvent) => {
    e.preventDefault()
    if (!tenDn.trim() || !mk.trim()) {
      setLoiForm('Vui lòng nhập đầy đủ tên và mật khẩu mẫu')
      setShake((k) => k + 1)
      return
    }
    setLoiForm('')
    setBtnState('busy')
    window.setTimeout(() => {
      setBtnState('ok')
      window.setTimeout(() => setBtnState('idle'), 1800)
    }, 650)
  }

  const dsLoc = HS_MAU.filter((x) =>
    `${x.ten} ${x.ma} ${x.lop}`.toLowerCase().includes(tuKhoa.trim().toLowerCase()),
  )

  return (
    <div className="ux" style={{ maxWidth: 960, margin: '0 auto', padding: '16px 12px 48px' }}>
      <Card
        size="small"
        style={{ marginBottom: 14, position: 'relative', zIndex: 60 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <b style={{ fontFamily: CHU_SO, fontSize: 20, color: MAU.chinh }}>Demo Giao Diện UX/UI · Ms.Nhung</b>
            <div style={{ fontSize: 12, color: MAU.chuPhu }}>
              Dữ liệu mẫu 100% offline — không đụng dữ liệu thật hay nhánh main.
            </div>
          </div>
          <Space>
            <MenuNhanh
              label="Tiện ích (#413)"
              items={[
                { key: '1', label: 'Đánh giá học sinh', moTa: 'Phiếu khảo sát tháng', icon: <StarOutlined />, mau: 'c3', onClick: () => setToastText('Đã chọn mục Đánh giá học sinh') },
                { key: '2', label: 'Import Excel', moTa: 'Nhập danh sách nhanh', icon: <FileExcelOutlined />, mau: 'c4', onClick: () => setToastText('Đã chọn mục Import Excel') },
                { key: '3', label: 'Nhật ký thao tác', moTa: 'Lịch sử chỉnh sửa', icon: <HistoryOutlined />, mau: 'c2', onClick: () => setToastText('Đã chọn mục Nhật ký thao tác') },
                { key: '4', label: 'Đổi mật khẩu', moTa: 'Bảo mật tài khoản', icon: <KeyOutlined />, mau: 'c1', onClick: () => setToastText('Đã chọn mục Đổi mật khẩu') },
              ]}
            />
            <NutDoiGiaoDien cheDo={cheDo} onClick={doi} />
          </Space>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(380px, 100%), 1fr))', gap: 14 }}>
        <Card size="small" title="#403 Form nhãn nổi, mắt chớp & nút biến hình">
          <form onSubmit={xuLyForm} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <ONhapNoi
                label="Tên đăng nhập hoặc số điện thoại"
                value={tenDn}
                error={!!loiForm && !tenDn.trim()}
                shakeKey={shake}
                onChange={(v) => { setTenDn(v); setLoiForm('') }}
              />
              <ONhapNoi
                label="Mật khẩu"
                type="password"
                value={mk}
                error={!!loiForm && !mk.trim()}
                shakeKey={shake}
                onChange={(v) => { setMk(v); setLoiForm('') }}
              />
            </div>
            <p className={`u403-msg ${loiForm ? 'is-on' : ''}`.trim()}>{loiForm}</p>
            <NutGuiBienHinh label="Thử đăng nhập" state={btnState} />
          </form>
        </Card>

        <Card size="small" title="#436 & #269 Hộp thoại xoá an toàn">
          <Space orientation="vertical" style={{ width: '100%' }}>
            <div style={{ fontSize: 13, color: MAU.chuPhu }}>
              Hộp thoại thùng rác có hoạt ảnh mở nắp, thả tài liệu và nảy nhẹ khi xác nhận:
            </div>
            <Button danger onClick={() => setMoXoa(true)}>Mở hộp thoại xoá (#436)</Button>

            <div className="u269-dg">
              <b>Vùng nguy hiểm (#269)</b>
              <div className="u269-dg-row">
                <span>Yêu cầu gõ đúng tên lớp "Starters 1A" để mở khoá nút xoá.</span>
                <Button danger onClick={() => setMoXoaLop(true)}>Xoá lớp mẫu</Button>
              </div>
            </div>
          </Space>
        </Card>

        <Card size="small" title="#444 Thanh tiến trình các bước">
          <Space orientation="vertical" style={{ width: '100%' }} size={14}>
            <ThanhBuoc
              steps={['Tải mẫu', 'Chọn file', 'Kiểm tra', 'Hoàn tất']}
              current={buoc}
              onStepClick={setBuoc}
            />
            <Space style={{ justifyContent: 'center', width: '100%' }}>
              <Button size="small" disabled={buoc <= 0} onClick={() => setBuoc((b) => Math.max(0, b - 1))}>Lùi bước</Button>
              <Button size="small" type="primary" onClick={() => setBuoc((b) => (b >= 4 ? 0 : b + 1))}>
                {buoc >= 4 ? 'Đặt lại' : 'Bước tiếp'}
              </Button>
            </Space>
          </Space>
        </Card>

        <Card size="small" title="#432 Kéo thả file & #004 Nút tải biến hình">
          <Space orientation="vertical" style={{ width: '100%' }} size={12}>
            <VungTaiFile
              accept=".xlsx,.png,.jpg"
              title="Kéo thả file mẫu vào đây"
              browseLabel="chọn từ máy"
              subtitle="Chỉ mô phỏng tại trình duyệt"
              onChonFile={async ([f]) => {
                await new Promise((r) => window.setTimeout(r, 700))
                if (f) setToastText(`Đã đọc thử file ${f.name} (offline)`)
              }}
            />
            <Space wrap>
              <NutTaiXuong
                label="Xuất Excel"
                onDownload={() => new Promise((r) => window.setTimeout(r, 850))}
              />
              <NutTaiXuong
                label="Tải file mẫu"
                variant="secondary"
                onDownload={() => new Promise((r) => window.setTimeout(r, 700))}
              />
            </Space>
          </Space>
        </Card>

        <Card size="small" title="#350 Ổ khoá Chốt sổ & #449 Phân trang trượt">
          <Space orientation="vertical" style={{ width: '100%' }} size={14}>
            <KhoaSoThang
              daChot={daChot}
              thang={thangLich}
              onChot={() => setDaChot(true)}
              onMoKhoa={() => setDaChot(false)}
            />
            <div>
              <div style={{ fontSize: 12, color: MAU.chuPhu, marginBottom: 4 }}>Phân trang 20 trang (trang hiện tại: {trang}):</div>
              <PhanTrangTruot current={trang} pageSize={10} total={200} onChange={setTrang} />
            </div>
          </Space>
        </Card>

        <Card size="small" title="#300 Tìm kiếm, huy hiệu nảy & chọn nhanh">
          <Space orientation="vertical" style={{ width: '100%' }} size={10}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <OChiTimKiem
                value={tuKhoa}
                onChange={setTuKhoa}
                placeholder="Tìm học sinh mẫu..."
                ariaLabel="Tìm học sinh mẫu"
              />
              <HuyHieuDem count={daChon.length} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {dsLoc.map((h, idx) => {
                const on = daChon.includes(h.id)
                return (
                  <div
                    key={h.id}
                    className="u300-rw"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8,
                      padding: '8px 10px',
                      borderRadius: 12,
                      background: on ? MAU.chinhNhat : MAU.nen,
                      border: `1px solid ${MAU.vien}`,
                      animationDelay: `${idx * 0.04}s`,
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>
                        {h.ten} <Tag style={{ marginInlineEnd: 0 }}>{h.ma}</Tag>
                      </div>
                      <div style={{ fontSize: 11.5, color: MAU.chuPhu }}>{h.lop} · {h.gia}</div>
                    </div>
                    <NutChonNhanh
                      selected={on}
                      itemLabel={h.ten}
                      onToggle={() => setDaChon((cu) => (cu.includes(h.id) ? cu.filter((x) => x !== h.id) : [...cu, h.id]))}
                    />
                  </div>
                )
              })}
            </div>
          </Space>
        </Card>
      </div>

      <Card size="small" title="#431 Lịch điểm danh tháng trượt chấm tròn" style={{ marginTop: 14 }}>
        <LichDiemDanhThang
          thang={thangLich}
          onDoiThang={setThangLich}
          o={luoiMau}
          lopMap={LOP_MAU_MAP}
          lopIdsEm={LOP_IDS_SET}
        />
      </Card>

      <HopThoaiXoa
        open={moXoa}
        title="Xoá mục mẫu này?"
        description="Đây chỉ là hộp thoại xem thử giao diện thùng rác, không xoá dữ liệu thật."
        okText="Xoá thử"
        cancelText="Huỷ"
        onCancel={() => setMoXoa(false)}
        onConfirm={async () => {
          await new Promise((r) => window.setTimeout(r, 300))
          setToastText('Đã chạy xong hoạt ảnh xoá mẫu (#436)')
        }}
      />

      <HopThoaiXoaXacNhanTen
        open={moXoaLop}
        title='Xoá hẳn lớp "Starters 1A"?'
        description="Gõ chính xác tên lớp bên dưới để mở khoá nút xoá (dữ liệu mẫu offline)."
        tenCanGo="Starters 1A"
        onCancel={() => setMoXoaLop(false)}
        onConfirm={async () => {
          setMoXoaLop(false)
          setToastText('Đã xác nhận xoá lớp mẫu Starters 1A (#269)')
        }}
      />

      <ThongBaoThanhTienDo text={toastText} onDone={() => setToastText(null)} />
    </div>
  )
}
