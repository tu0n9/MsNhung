// Dọn mọi thứ do test tạo: tên bắt đầu "TEST", chi phí ghi chú "TEST e2e", tài khoản theo SĐT test. Không đụng dữ liệu khác.
import { createClient } from '@supabase/supabase-js'
const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } })
const chk = ({ error }) => { if (error) throw new Error(error.message) }
const lop = (await sb.from('lop').select('id').like('ten', 'TEST %')).data.map((x) => x.id)
const hs = (await sb.from('hoc_sinh').select('id').like('ho_ten', 'TEST %')).data.map((x) => x.id)
const buoi = lop.length ? (await sb.from('buoi_hoc').select('id').in('lop_id', lop)).data.map((x) => x.id) : []
const goi = hs.length ? (await sb.from('goi_hoc').select('id').in('hoc_sinh_id', hs)).data.map((x) => x.id) : []
const anh = buoi.length ? (await sb.from('anh_buoi').select('duong_dan').in('buoi_id', buoi)).data.map((x) => x.duong_dan) : []
const avatar = hs.length ? (await sb.from('hoc_sinh').select('avatar').in('id', hs)).data.map((x) => x.avatar).filter(Boolean) : []
if (anh.length + avatar.length) await sb.storage.from('anh').remove([...anh, ...avatar])
if (goi.length) chk(await sb.from('phieu_thu').delete().in('goi_id', goi))
if (goi.length) chk(await sb.from('goi_hoc').delete().in('id', goi))
if (buoi.length) for (const t of ['diem_danh', 'tro_giang_buoi', 'anh_buoi']) chk(await sb.from(t).delete().in('buoi_id', buoi))
if (hs.length) chk(await sb.from('diem_danh').delete().in('hoc_sinh_id', hs))
chk(await sb.from('chi_phi').delete().eq('ghi_chu', 'TEST e2e'))
if (hs.length) chk(await sb.from('hoc_sinh').delete().in('id', hs))
if (buoi.length) chk(await sb.from('buoi_hoc').delete().in('id', buoi))
if (lop.length) chk(await sb.from('lop').delete().in('id', lop))
const tk = (await sb.from('tai_khoan').select('id').or('ten_dang_nhap.eq.testlan,so_dien_thoai.in.(0911000001,0922000002,0900000101,0900000103)')).data
for (const x of tk) await sb.auth.admin.deleteUser(x.id)
console.log(`đã dọn: ${lop.length} lớp, ${hs.length} học sinh, ${buoi.length} buổi, ${goi.length} gói, ${anh.length + avatar.length} ảnh, ${tk.length} tài khoản`)
