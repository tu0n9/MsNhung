import { createContext, useContext, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Button, Grid, Layout, Menu, Spin } from 'antd'
import { BankOutlined, CheckSquareOutlined, DollarOutlined, TeamOutlined, UserOutlined, WalletOutlined } from '@ant-design/icons'
import type { Session } from '@supabase/supabase-js'
import { laQuanLy, q, sb, type TaiKhoan } from './supabase'
import DangNhap from './trang/DangNhap'
import DoiMatKhau from './trang/DoiMatKhau'
import DiemDanh from './trang/DiemDanh'
import LopHoc from './trang/LopHoc'
import HocPhi from './trang/HocPhi'
import ChiPhi from './trang/ChiPhi'
import TaiKhoanTrang from './trang/TaiKhoan'
import PhuHuynh from './trang/PhuHuynh'

const NguoiDung = createContext<TaiKhoan>(null!)
export const useToi = () => useContext(NguoiDung)

export default function App() {
  const [phien, setPhien] = useState<Session | null | undefined>(undefined)
  const [toi, setToi] = useState<TaiKhoan | null>(null)
  const nav = useNavigate()
  const loc = useLocation()
  const manHinh = Grid.useBreakpoint()

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => setPhien(data.session))
    const { data } = sb.auth.onAuthStateChange((_e, s) => setPhien(s))
    return () => data.subscription.unsubscribe()
  }, [])

  const taiToi = () =>
    phien && q(sb.from('tai_khoan').select('*').eq('id', phien.user.id).single()).then((t) => setToi(t as TaiKhoan))
  useEffect(() => { setToi(null); taiToi() }, [phien?.user.id])

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
        { key: '/tai-khoan', label: 'Tài khoản', icon: <BankOutlined /> },
      ]
  // điện thoại: thanh điều hướng dưới đáy, vì menu ngang bị gom vào nút "..." khó bấm
  const dienThoai = !manHinh.md

  return (
    <NguoiDung.Provider value={toi}>
      <Layout style={{ minHeight: '100vh' }}>
        <Layout.Header style={{ display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8 }}>
          <b style={{ color: '#fff', whiteSpace: 'nowrap' }}>Ms.Nhung</b>
          {dienThoai ? <span style={{ flex: 1 }} /> : <Menu theme="dark" mode="horizontal" selectedKeys={[loc.pathname]} items={menu}
            onClick={(e) => nav(e.key)} style={{ flex: 1, minWidth: 0 }} />}
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
                <Route path="/tai-khoan" element={<TaiKhoanTrang />} />
              </>
            )}
            <Route path="/doi-mat-khau" element={<DoiMatKhau xong={() => nav('/')} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout.Content>
        {dienThoai && menu.length > 1 && (
          <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', background: '#fff', borderTop: '1px solid #eee', zIndex: 10 }}>
            {menu.map((m) => (
              <button key={m.key} onClick={() => nav(m.key)} style={{
                flex: 1, border: 0, background: 'none', padding: '8px 0 10px', fontSize: 11,
                color: loc.pathname === m.key ? '#d4380d' : '#666', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              }}><span style={{ fontSize: 20 }}>{m.icon}</span>{m.label}</button>
            ))}
          </nav>
        )}
      </Layout>
    </NguoiDung.Provider>
  )
}
