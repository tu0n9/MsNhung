import { useState, type FormEvent } from 'react'
import { App } from 'antd'
import { sb } from '../supabase'
import { useCheDo } from '../giao-dien'
import NutDoiGiaoDien from '../thanh-phan/NutDoiGiaoDien'
import ONhapNoi from '../thanh-phan/ONhapNoi'
import NutGuiBienHinh from '../thanh-phan/NutGuiBienHinh'

export default function DangNhap() {
  const { message } = App.useApp()
  const { cheDo, doi } = useCheDo()
  const [dinhDanh, setDinhDanh] = useState('')
  const [matKhau, setMatKhau] = useState('')
  const [loiDd, setLoiDd] = useState(false)
  const [loiMk, setLoiMk] = useState(false)
  const [shakeDd, setShakeDd] = useState(0)
  const [shakeMk, setShakeMk] = useState(0)
  const [thongBaoLoi, setThongBaoLoi] = useState('')
  const [trangThai, setTrangThai] = useState<'idle' | 'busy' | 'ok'>('idle')

  const dangNhap = async (e: FormEvent) => {
    e.preventDefault()
    if (trangThai === 'busy') return
    if (!dinhDanh.trim()) {
      setLoiDd(true)
      setShakeDd((k) => k + 1)
      setThongBaoLoi('Nhập tên đăng nhập hoặc số điện thoại')
      return
    }
    if (!matKhau) {
      setLoiMk(true)
      setShakeMk((k) => k + 1)
      setThongBaoLoi('Nhập mật khẩu')
      return
    }

    setTrangThai('busy')
    setThongBaoLoi('')
    let daThanhCong = false
    try {
      // lỗi mạng phải báo khác "sai mật khẩu", không thì người dùng đi đặt lại mật khẩu vô ích
      const { data: email, error: loiTim } = await sb.rpc('email_dang_nhap', { dinh_danh: dinhDanh.trim() })
      if (loiTim) {
        const msg = 'Không kết nối được máy chủ, kiểm tra mạng rồi thử lại'
        setThongBaoLoi(msg)
        return void message.error(msg)
      }
      const { error } = await sb.auth.signInWithPassword({ email: email ?? 'khong-co@msnhung.local', password: matKhau })
      if (error) {
        const msg = error.status === 400 ? 'Sai tên đăng nhập/số điện thoại hoặc mật khẩu' : `Không đăng nhập được: ${error.message}`
        setLoiMk(true)
        setShakeMk((k) => k + 1)
        setThongBaoLoi(msg)
        return void message.error(msg)
      }
      daThanhCong = true
      setTrangThai('ok')
      // ghi nhật ký đăng nhập; lỗi thì bỏ qua, không chặn người dùng vào app
      await sb.rpc('ghi_dang_nhap')
    } finally {
      if (!daThanhCong) setTrangThai('idle')
    }
  }

  return (
    // logo đã tách nền (trong suốt), nền lấy từ body (chuyển màu ở bản sáng) như các màn khác
    <div className="ux" style={{ position: 'relative', minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px 40px' }}>
      <div style={{ position: 'absolute', top: 16, right: 16 }}>
        <NutDoiGiaoDien cheDo={cheDo} onClick={doi} />
      </div>
      <img src="/logo-day-du.png" alt="Ms Nhung English" style={{ width: '100%', maxWidth: 340, marginTop: '3vh', marginBottom: 12 }} />
      <form className="u403-card" onSubmit={dangNhap} noValidate>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <ONhapNoi
            label="Tên đăng nhập hoặc số điện thoại"
            value={dinhDanh}
            autoComplete="username"
            autoCapitalize="none"
            error={loiDd}
            shakeKey={shakeDd}
            onChange={(val) => {
              setDinhDanh(val)
              if (loiDd) setLoiDd(false)
              if (thongBaoLoi) setThongBaoLoi('')
            }}
          />
          <ONhapNoi
            label="Mật khẩu"
            type="password"
            value={matKhau}
            autoComplete="current-password"
            error={loiMk}
            shakeKey={shakeMk}
            onChange={(val) => {
              setMatKhau(val)
              if (loiMk) setLoiMk(false)
              if (thongBaoLoi) setThongBaoLoi('')
            }}
          />
        </div>
        <p className={`u403-msg ${thongBaoLoi ? 'is-on' : ''}`.trim()} aria-live="polite">
          {thongBaoLoi}
        </p>
        <NutGuiBienHinh label="Đăng nhập" state={trangThai} />
      </form>
    </div>
  )
}
