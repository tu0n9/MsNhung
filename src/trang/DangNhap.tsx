import { useState } from 'react'
import { App, Button, Form, Input } from 'antd'
import { sb } from '../supabase'

export default function DangNhap() {
  const { message } = App.useApp()
  const [dang, setDang] = useState(false)

  const dangNhap = async (v: { dinh_danh: string; mat_khau: string }) => {
    setDang(true)
    try {
      // lỗi mạng phải báo khác "sai mật khẩu", không thì người dùng đi đặt lại mật khẩu vô ích
      const { data: email, error: loiTim } = await sb.rpc('email_dang_nhap', { dinh_danh: v.dinh_danh.trim() })
      if (loiTim) return void message.error('Không kết nối được máy chủ, kiểm tra mạng rồi thử lại')
      const { error } = await sb.auth.signInWithPassword({ email: email ?? 'khong-co@msnhung.local', password: v.mat_khau })
      if (error) return void message.error(error.status === 400 ? 'Sai tên đăng nhập/số điện thoại hoặc mật khẩu' : `Không đăng nhập được: ${error.message}`)
      // ghi nhật ký đăng nhập; lỗi thì bỏ qua, không chặn người dùng vào app
      await sb.rpc('ghi_dang_nhap')
    } finally {
      setDang(false)
    }
  }

  return (
    // logo đã tách nền (trong suốt), nền lấy từ body (chuyển màu ở bản sáng) như các màn khác
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px 40px' }}>
      <img src="/logo-day-du.png" alt="Ms Nhung English" style={{ width: '100%', maxWidth: 380, marginTop: '3vh' }} />
      <Form layout="vertical" onFinish={dangNhap} style={{ width: '100%', maxWidth: 360, marginTop: 8 }}>
        <Form.Item name="dinh_danh" label="Tên đăng nhập hoặc số điện thoại" rules={[{ required: true }]}>
          <Input size="large" autoComplete="username" autoCapitalize="none" />
        </Form.Item>
        <Form.Item name="mat_khau" label="Mật khẩu" rules={[{ required: true }]}>
          <Input.Password size="large" autoComplete="current-password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block size="large" loading={dang} style={{ marginTop: 8, fontWeight: 700 }}>Đăng nhập</Button>
      </Form>
    </div>
  )
}
