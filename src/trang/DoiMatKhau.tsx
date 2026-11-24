import { App, Button, Card, Form } from 'antd'
import { q, sb, useMotLan } from '../supabase'
import ONhapNoi from '../thanh-phan/ONhapNoi'
import NutGuiBienHinh from '../thanh-phan/NutGuiBienHinh'

export default function DoiMatKhau({ batBuoc, xong }: { batBuoc?: boolean; xong: () => void }) {
  const { message } = App.useApp()

  const [doi, dangDoi] = useMotLan(async (v: { mat_khau: string }) => {
    const { error } = await sb.auth.updateUser({ password: v.mat_khau })
    if (error) return message.error(error.message)
    // mật khẩu đã đổi, nhưng cờ bắt đổi chưa tắt thì lần sau vẫn bị đòi đổi: báo để bấm Lưu lại
    try { await q(sb.rpc('da_doi_mat_khau')) } catch (e) { return message.error(`Đã đổi mật khẩu nhưng chưa lưu xong, bấm Lưu lại: ${(e as Error).message}`) }
    message.success('Đã đổi mật khẩu')
    xong()
  })

  return (
    <div className="ux" style={{ display: 'grid', placeItems: 'center', padding: 16, minHeight: batBuoc ? '100vh' : undefined }}>
      <Card title={batBuoc ? 'Lần đầu đăng nhập: hãy đặt mật khẩu mới' : 'Đổi mật khẩu'} style={{ width: '100%', maxWidth: 380 }}>
        <Form layout="vertical" onFinish={doi}>
          <Form.Item name="mat_khau" rules={[{ required: true, min: 6, message: 'Tối thiểu 6 ký tự' }]}>
            <ONhapNoi label="Mật khẩu mới" type="password" autoComplete="new-password" />
          </Form.Item>
          <Form.Item name="nhap_lai" dependencies={['mat_khau']} rules={[
            { required: true, message: 'Vui lòng nhập lại mật khẩu' },
            ({ getFieldValue }) => ({ validator: (_, v) => v === getFieldValue('mat_khau') ? Promise.resolve() : Promise.reject(new Error('Không khớp')) }),
          ]}>
            <ONhapNoi label="Nhập lại" type="password" autoComplete="new-password" />
          </Form.Item>
          <NutGuiBienHinh label="Lưu" state={dangDoi ? 'busy' : 'idle'} />
          {batBuoc && <Button type="link" block style={{ marginTop: 6 }} onClick={() => sb.auth.signOut()}>Thoát</Button>}
        </Form>
      </Card>
    </div>
  )
}
