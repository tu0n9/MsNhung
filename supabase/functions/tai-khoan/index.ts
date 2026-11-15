// Tạo tài khoản và đặt lại mật khẩu. Cần service role nên không làm được từ trình duyệt.
// Quyền: admin làm mọi việc; giáo viên tạo/đặt lại trợ giảng và phụ huynh; trợ giảng chỉ đặt lại phụ huynh.
import { createClient } from 'npm:@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
const tra = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

const QUYEN: Record<string, string[]> = {
  admin: ['giao_vien', 'tro_giang', 'phu_huynh'],
  giao_vien: ['tro_giang', 'phu_huynh'],
  tro_giang: ['phu_huynh'],
}
const chuanSdt = (s?: string) => (s ?? '').replace(/\D/g, '') || null

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

  const jwt = req.headers.get('Authorization')?.replace('Bearer ', '') ?? ''
  const { data: u } = await sb.auth.getUser(jwt)
  if (!u.user) return tra({ loi: 'Chưa đăng nhập' }, 401)
  const { data: toi } = await sb.from('tai_khoan').select('vai_tro, hoat_dong').eq('id', u.user.id).single()
  if (!toi?.hoat_dong) return tra({ loi: 'Tài khoản bị khoá' }, 403)
  const duocPhep = QUYEN[toi.vai_tro] ?? []

  const b = await req.json()

  if (b.hanh_dong === 'tao') {
    if (!duocPhep.includes(b.vai_tro) || (toi.vai_tro === 'tro_giang')) return tra({ loi: 'Không có quyền tạo vai trò này' }, 403)
    const sdt = chuanSdt(b.so_dien_thoai)
    const ten = b.ten_dang_nhap?.trim().toLowerCase() || null
    if (!sdt && !ten) return tra({ loi: 'Cần tên đăng nhập hoặc số điện thoại' }, 400)
    // Phụ huynh nhiều con dùng chung một số: trả lại tài khoản sẵn có thay vì báo lỗi
    if (b.vai_tro === 'phu_huynh' && sdt) {
      const { data: co } = await sb.from('tai_khoan').select('id, vai_tro').eq('so_dien_thoai', sdt).maybeSingle()
      if (co?.vai_tro === 'phu_huynh') return tra({ id: co.id, da_co: true })
    }
    const matKhau = b.mat_khau || sdt
    if (!matKhau || matKhau.length < 6) return tra({ loi: 'Mật khẩu tối thiểu 6 ký tự' }, 400)
    const email = `${crypto.randomUUID()}@msnhung.local`
    const { data: tao, error } = await sb.auth.admin.createUser({ email, password: matKhau, email_confirm: true })
    if (error) return tra({ loi: error.message }, 400)
    const { error: e2 } = await sb.from('tai_khoan').insert({
      id: tao.user.id, email, ten_dang_nhap: ten, so_dien_thoai: sdt, ho_ten: b.ho_ten || ten || sdt,
      vai_tro: b.vai_tro, don_gia_buoi: b.don_gia_buoi ?? 0, phai_doi_mat_khau: true,
    })
    if (e2) {
      await sb.auth.admin.deleteUser(tao.user.id)  // không để user auth mồ côi khi trùng tên/sđt
      return tra({ loi: e2.code === '23505' ? 'Tên đăng nhập hoặc số điện thoại đã tồn tại' : e2.message }, 400)
    }
    return tra({ id: tao.user.id })
  }

  if (b.hanh_dong === 'dat_lai') {
    const { data: tk } = await sb.from('tai_khoan').select('id, vai_tro, so_dien_thoai').eq('id', b.id).single()
    if (!tk || !duocPhep.includes(tk.vai_tro)) return tra({ loi: 'Không có quyền đặt lại tài khoản này' }, 403)
    const matKhau = b.mat_khau || tk.so_dien_thoai
    if (!matKhau || matKhau.length < 6) return tra({ loi: 'Tài khoản không có số điện thoại, hãy nhập mật khẩu mới' }, 400)
    const { error } = await sb.auth.admin.updateUserById(tk.id, { password: matKhau })
    if (error) return tra({ loi: error.message }, 400)
    await sb.from('tai_khoan').update({ phai_doi_mat_khau: true }).eq('id', tk.id)
    return tra({ ok: true })
  }

  return tra({ loi: 'Hành động không hợp lệ' }, 400)
})
