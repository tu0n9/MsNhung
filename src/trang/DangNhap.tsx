import { useState } from 'react'
import { App, Button, Card, Form, Input } from 'antd'
import { sb } from '../supabase'

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
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 16, background: '#fff2e8' }}>
      <Card title="Anh ngữ Ms.Nhung" style={{ width: '100%', maxWidth: 360 }}>
        <Form layout="vertical" onFinish={dangNhap}>
          <Form.Item name="dinh_danh" label="Tên đăng nhập hoặc số điện thoại" rules={[{ required: true }]}>
            <Input autoComplete="username" autoCapitalize="none" />
          </Form.Item>
          <Form.Item name="mat_khau" label="Mật khẩu" rules={[{ required: true }]}>
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={dang}>Đăng nhập</Button>
        </Form>
      </Card>
    </div>
  )
}
