import { App, Button, Card, Form, Input } from 'antd'
import { sb, useMotLan } from '../supabase'

export default function DoiMatKhau({ batBuoc, xong }: { batBuoc?: boolean; xong: () => void }) {
  const { message } = App.useApp()

  const [doi, dangDoi] = useMotLan(async (v: { mat_khau: string }) => {
    const { error } = await sb.auth.updateUser({ password: v.mat_khau })
    if (error) return message.error(error.message)
    await sb.rpc('da_doi_mat_khau')
    message.success('Đã đổi mật khẩu')
    xong()
  })

  return (
    <div style={{ display: 'grid', placeItems: 'center', padding: 16, minHeight: batBuoc ? '100vh' : undefined }}>
      <Card title={batBuoc ? 'Lần đầu đăng nhập: hãy đặt mật khẩu mới' : 'Đổi mật khẩu'} style={{ width: '100%', maxWidth: 360 }}>
        <Form layout="vertical" onFinish={doi}>
          <Form.Item name="mat_khau" label="Mật khẩu mới" rules={[{ required: true, min: 6, message: 'Tối thiểu 6 ký tự' }]}>
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Form.Item name="nhap_lai" label="Nhập lại" dependencies={['mat_khau']} rules={[
            { required: true },
            ({ getFieldValue }) => ({ validator: (_, v) => v === getFieldValue('mat_khau') ? Promise.resolve() : Promise.reject(new Error('Không khớp')) }),
          ]}>
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={dangDoi}>Lưu</Button>
          {batBuoc && <Button type="link" block onClick={() => sb.auth.signOut()}>Thoát</Button>}
        </Form>
      </Card>
    </div>
  )
}
