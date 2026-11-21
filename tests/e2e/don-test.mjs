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
if (hs.length) chk(await sb.from('sticker_cong_tru').delete().in('hoc_sinh_id', hs))
chk(await sb.from('chi_phi').delete().eq('ghi_chu', 'TEST e2e'))
chk(await sb.from('danh_gia').delete().like('ten_lop', 'TEST %'))
if (hs.length) chk(await sb.from('hoc_sinh').delete().in('id', hs))
if (buoi.length) chk(await sb.from('buoi_hoc').delete().in('id', buoi))
if (lop.length) chk(await sb.from('lop').delete().in('id', lop))
const tk = (await sb.from('tai_khoan').select('id').or('ten_dang_nhap.eq.testlan,so_dien_thoai.in.(0911000001,0922000002,0900000101,0900000103)')).data
for (const x of tk) await sb.auth.admin.deleteUser(x.id)
// nhật ký do test sinh ra (cả các lệnh xoá ở trên), từ mốc TU_LUC: mọi dòng của tài khoản test và admin break-glass
// (test đăng nhập bằng nó); dòng "Hệ thống" (Edge Function, script này) CHỈ khi dính dữ liệu TEST, vì người thật có thể
// đang tạo tài khoản thật cùng lúc (dòng đó cũng là Hệ thống).
let nk = 0
if (process.env.TU_LUC) {
  const admin = (await sb.from('tai_khoan').select('id').eq('ten_dang_nhap', 'admin')).data.map((x) => x.id)
  const ids = [...tk.map((x) => x.id), ...admin]
  const xoa = async (loc) => { const r = await loc(sb.from('nhat_ky').delete({ count: 'exact' }).gte('luc', process.env.TU_LUC)); chk(r); nk += r.count ?? 0 }
  if (ids.length) await xoa((r) => r.in('nguoi', ids))
  await xoa((r) => r.is('nguoi', null).or(['doi_tuong.ilike.*TEST*', 'thay_doi->>ghi_chu.eq.TEST e2e',
    ...(tk.length ? [`thay_doi->>id.in.(${tk.map((x) => x.id).join(',')})`] : [])].join(',')))
}
console.log(`đã dọn: ${lop.length} lớp, ${hs.length} học sinh, ${buoi.length} buổi, ${goi.length} gói, ${anh.length + avatar.length} ảnh, ${tk.length} tài khoản, ${nk} dòng nhật ký`)
