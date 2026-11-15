// Tạo (hoặc đặt lại mật khẩu) tài khoản break-glass `admin`. Chạy: npm run tao-admin
// Mật khẩu lấy từ BREAK_GLASS_PASSWORD trong .env, không bao giờ ghi vào repo.
import { createClient } from '@supabase/supabase-js'

const { VITE_SUPABASE_URL: url, SUPABASE_SECRET_KEY: key, BREAK_GLASS_PASSWORD: matKhau } = process.env
if (!url || !key || !matKhau) throw new Error('Thiếu VITE_SUPABASE_URL / SUPABASE_SECRET_KEY / BREAK_GLASS_PASSWORD trong .env')

const sb = createClient(url, key, { auth: { persistSession: false } })
const email = 'admin@msnhung.local'

const { data: ds } = await sb.auth.admin.listUsers({ perPage: 1000 })
let user = ds.users.find((u) => u.email === email)
if (user) {
  const { error } = await sb.auth.admin.updateUserById(user.id, { password: matKhau })
  if (error) throw error
} else {
  const { data, error } = await sb.auth.admin.createUser({ email, password: matKhau, email_confirm: true })
  if (error) throw error
  user = data.user
}
const { error } = await sb.from('tai_khoan').upsert({
  id: user.id, email, ten_dang_nhap: 'admin', ho_ten: 'Quản trị', vai_tro: 'admin', phai_doi_mat_khau: false,
})
if (error) throw error
console.log('OK: admin', user.id)
