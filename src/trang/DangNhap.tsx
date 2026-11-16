import { useState } from 'react'
import { App, Button, ConfigProvider, Form, Input } from 'antd'
import { sb } from '../supabase'
import { MAU, theme } from '../giao-dien'

export default function DangNhap() {
  const { message } = App.useApp()
  const [dang, setDang] = useState(false)

  const dangNhap = async (v: { dinh_danh: string; mat_khau: string }) => {
    setDang(true)
    try {
      const { data: email } = await sb.rpc('email_dang_nhap', { dinh_danh: v.dinh_danh })
      const { error } = await sb.auth.signInWithPassword({ email: email ?? 'khong-co@msnhung.local', password: v.mat_khau })
      if (error) message.error('Sai tên đăng nhập/số điện thoại hoặc mật khẩu')
    } finally {
      setDang(false)
    }
  }

  return (
    // luôn tối ở cả hai chế độ: nền đen trùng nền logo nên logo liền vào màn, không thành một khung ảnh
    <ConfigProvider theme={theme('toi')}>
    <div data-che-do="toi" style={{ minHeight: '100dvh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 20px 40px' }}>
      <img src="/logo.jpg" alt="Ms Nhung English" style={{ width: '100%', maxWidth: 380, marginTop: '3vh' }} />
      <Form layout="vertical" onFinish={dangNhap} style={{ width: '100%', maxWidth: 360, marginTop: 8 }}>
        <Form.Item name="dinh_danh" label="Tên đăng nhập hoặc số điện thoại" rules={[{ required: true }]}>
          <Input size="large" autoComplete="username" autoCapitalize="none" style={{ background: MAU.mat }} />
        </Form.Item>
        <Form.Item name="mat_khau" label="Mật khẩu" rules={[{ required: true }]}>
          <Input.Password size="large" autoComplete="current-password" style={{ background: MAU.mat }} />
        </Form.Item>
        <Button type="primary" htmlType="submit" block size="large" loading={dang} style={{ marginTop: 8, fontWeight: 700 }}>Đăng nhập</Button>
      </Form>
    </div>
    </ConfigProvider>
  )
}
