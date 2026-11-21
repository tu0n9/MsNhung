import { createContext, useContext, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Button, Grid, Layout, Menu, Result, Spin } from 'antd'
import { BankOutlined, CheckSquareOutlined, DollarOutlined, MoonOutlined, StarOutlined, SunOutlined, TeamOutlined, UserOutlined, WalletOutlined } from '@ant-design/icons'
import type { Session } from '@supabase/supabase-js'
import { laQuanLy, q, sb, type TaiKhoan } from './supabase'
import { CHU_SO, MAU, useCheDo } from './giao-dien'
import DangNhap from './trang/DangNhap'
import DoiMatKhau from './trang/DoiMatKhau'
import DiemDanh from './trang/DiemDanh'
import LopHoc from './trang/LopHoc'
import HocPhi from './trang/HocPhi'
import ChiPhi from './trang/ChiPhi'
import TaiKhoanTrang from './trang/TaiKhoan'
import PhuHuynh from './trang/PhuHuynh'
import ImportExcel from './trang/ImportExcel'
import HuongDan from './trang/HuongDan'
import DanhGia from './trang/DanhGia'
import PhieuDanhGia from './trang/PhieuDanhGia'
import NhatKy from './trang/NhatKy'

const NguoiDung = createContext<TaiKhoan>(null!)
export const useToi = () => useContext(NguoiDung)

export default function App() {
  const [phien, setPhien] = useState<Session | null | undefined>(undefined)
  const [toi, setToi] = useState<TaiKhoan | null>(null)
  const [loiToi, setLoiToi] = useState<string | null>(null)
  const nav = useNavigate()
  const { cheDo, doi } = useCheDo()
  const loc = useLocation()
  const manHinh = Grid.useBreakpoint()

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => setPhien(data.session))
    const { data } = sb.auth.onAuthStateChange((_e, s) => setPhien(s))
    return () => data.subscription.unsubscribe()
  }, [])

  // lỗi mạng lúc mở app thì báo và cho thử lại / thoát, không quay Spin mãi
  const taiToi = () => {
    if (!phien) return
    setLoiToi(null)
    return q(sb.from('tai_khoan').select('*').eq('id', phien.user.id).single()).then((t) => setToi(t as TaiKhoan))
      .catch((e: Error) => setLoiToi(e.message))
  }
  useEffect(() => { setToi(null); taiToi() }, [phien?.user.id])

  // phiếu đánh giá: học sinh mở link từ Zalo, không đăng nhập
  if (loc.pathname.startsWith('/danh-gia/')) return <PhieuDanhGia ma={loc.pathname.slice('/danh-gia/'.length)} />
  if (phien && loiToi) return <Result status="warning" title="Không tải được tài khoản" subTitle={`Kiểm tra mạng rồi thử lại. (${loiToi})`}
    extra={[<Button key="t" type="primary" onClick={taiToi}>Thử lại</Button>, <Button key="x" onClick={() => sb.auth.signOut()}>Thoát</Button>]} />
  if (phien === undefined || (phien && !toi)) return <Spin fullscreen />
  if (!phien) return <DangNhap />
  if (!toi) return null
  if (toi.phai_doi_mat_khau) return <DoiMatKhau batBuoc xong={taiToi} />

  const ql = laQuanLy(toi.vai_tro)
  const menu = toi.vai_tro === 'phu_huynh'
    ? [{ key: '/', label: 'Con tôi', icon: <UserOutlined /> }]
    : [
        { key: '/', label: 'Điểm danh', icon: <CheckSquareOutlined /> },
        { key: '/lop', label: 'Lớp', icon: <TeamOutlined /> },
        ...(ql ? [{ key: '/hoc-phi', label: 'Học phí', icon: <DollarOutlined /> }, { key: '/chi-phi', label: 'Chi phí', icon: <WalletOutlined /> }] : []),
        ...(ql ? [{ key: '/danh-gia', label: 'Đánh giá', icon: <StarOutlined /> }] : []),
        { key: '/tai-khoan', label: 'Tài khoản', icon: <BankOutlined /> },
      ]
  // điện thoại: thanh điều hướng dưới đáy, vì menu ngang bị gom vào nút "..." khó bấm
  const dienThoai = !manHinh.md
  const dangO = (k: string) => loc.pathname === k || (k === '/lop' && loc.pathname === '/import')

  return (
    <NguoiDung.Provider value={toi}>
      <Layout style={{ minHeight: '100vh' }}>
        <Layout.Header style={{ display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8, borderBottom: `1px solid ${MAU.vien}` }}>
          <img src="/logo-hinh.png" alt="" height={34} style={{ width: 'auto' }} />
          <b style={{ color: MAU.chinh, whiteSpace: 'nowrap', fontFamily: CHU_SO, fontSize: 18 }}>Ms.Nhung</b>
          {dienThoai ? <span style={{ flex: 1 }} /> : <Menu theme={cheDo === 'toi' ? 'dark' : 'light'} mode="horizontal" selectedKeys={[loc.pathname === '/import' ? '/lop' : loc.pathname]} items={menu}
            onClick={(e) => nav(e.key)} style={{ flex: 1, minWidth: 0 }} />}
          {/* thanh dưới đã đủ 5 mục, thêm mục thứ 6 thì chật trên điện thoại; phụ huynh có liên kết riêng ở trang Con tôi */}
          <Button shape="circle" icon={cheDo === 'toi' ? <SunOutlined /> : <MoonOutlined />} onClick={doi}
            aria-label={cheDo === 'toi' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'} />
          {toi.vai_tro !== 'phu_huynh' && <Button size="small" onClick={() => nav('/huong-dan')}>Hướng dẫn</Button>}
          <Button size="small" onClick={() => sb.auth.signOut()}>Thoát</Button>
        </Layout.Header>
        <Layout.Content style={{ padding: 12, paddingBottom: dienThoai ? 76 : 12, maxWidth: 1200, width: '100%', margin: '0 auto' }}>
          <Routes>
            {toi.vai_tro === 'phu_huynh' ? (
              <Route path="/" element={<PhuHuynh />} />
            ) : (
              <>
                <Route path="/" element={<DiemDanh />} />
                <Route path="/lop" element={<LopHoc />} />
                {ql && <Route path="/hoc-phi" element={<HocPhi />} />}
                {ql && <Route path="/chi-phi" element={<ChiPhi />} />}
                {ql && <Route path="/import" element={<ImportExcel />} />}
                {ql && <Route path="/danh-gia" element={<DanhGia />} />}
                {ql && <Route path="/nhat-ky" element={<NhatKy />} />}
                <Route path="/tai-khoan" element={<TaiKhoanTrang />} />
              </>
            )}
            <Route path="/doi-mat-khau" element={<DoiMatKhau xong={() => nav('/')} />} />
            <Route path="/huong-dan" element={<HuongDan />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout.Content>
        {/* Đánh giá không vào thanh dưới (đã đủ 5 mục); trên điện thoại vào từ nút ở trang Học phí */}
        {dienThoai && menu.length > 1 && (
          <nav className="thanh-duoi" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', background: MAU.dau, borderTop: `1px solid ${MAU.vien}`, zIndex: 10 }}>
            {menu.filter((m) => m.key !== '/danh-gia').map((m) => (
              <button key={m.key} onClick={() => nav(m.key)} style={{
                flex: 1, border: 0, background: 'none', padding: '8px 0 10px', fontSize: 11,
                color: dangO(m.key) ? MAU.chinh : MAU.chuMo, fontWeight: dangO(m.key) ? 600 : 400, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              }}><span style={{ fontSize: 20 }}>{m.icon}</span>{m.label}</button>
            ))}
          </nav>
        )}
      </Layout>
    </NguoiDung.Provider>
  )
}
