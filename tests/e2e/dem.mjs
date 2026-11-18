import { createClient } from '@supabase/supabase-js'
const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } })
const kq = {}
for (const t of ['tai_khoan','lop','hoc_sinh','buoi_hoc','diem_danh','tro_giang_buoi','anh_buoi','goi_hoc','phieu_thu','chi_phi','nhat_ky_chot_so','danh_gia','link_danh_gia']) kq[t] = (await sb.from(t).select('*', { count: 'exact', head: true })).count
kq.khoa_den = (await sb.from('khoa_so').select('khoa_den').single()).data.khoa_den
console.log(JSON.stringify(kq))
