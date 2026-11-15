// Xoá sạch dữ liệu như app mới (người dùng chốt 2026-11-15). Chạy: npm run lam-moi
// Giữ mọi tài khoản đăng nhập (admin, trợ giảng, phụ huynh...). Xoá: lớp, học sinh, buổi, điểm danh, trợ giảng buổi,
// ảnh (cả file trong Storage, cả avatar), gói học, phiếu thu, chi phí, nhật ký chốt sổ; mở khoá sổ.
// Trước khi xoá tải bản sao lưu JSON về sao-luu-may/ (không có file ảnh). Bản sao lưu đêm trên nhánh `sao-luu` vẫn còn.
import { createClient } from '@supabase/supabase-js'
import { mkdirSync, writeFileSync } from 'node:fs'
import { createInterface } from 'node:readline/promises'

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } })
const ok = ({ data, error }) => { if (error) throw new Error(error.message); return data }
// thứ tự xoá theo khoá ngoại: bảng con trước
const BANG = ['phieu_thu', 'goi_hoc', 'diem_danh', 'tro_giang_buoi', 'anh_buoi', 'chi_phi', 'hoc_sinh', 'buoi_hoc', 'lop', 'nhat_ky_chot_so']
const KHOA = { diem_danh: 'buoi_id', tro_giang_buoi: 'buoi_id' }

const rl = createInterface({ input: process.stdin, output: process.stdout })
const tl = await rl.question('Xoá TOÀN BỘ dữ liệu (giữ tài khoản). Gõ XOA HET để tiếp tục: ')
rl.close()
if (tl.trim() !== 'XOA HET') { console.log('Đã huỷ, không xoá gì.'); process.exit(1) }

async function docHet(b) {
  const kq = []
  for (let o = 0; ; o += 1000) {
    const d = ok(await sb.from(b).select('*').range(o, o + 999))
    kq.push(...d)
    if (d.length < 1000) return kq
  }
}
async function fileAnh(thuMuc = '') {
  const kq = []
  for (const x of ok(await sb.storage.from('anh').list(thuMuc, { limit: 1000 }))) {
    const duong = thuMuc ? `${thuMuc}/${x.name}` : x.name
    if (x.id === null) kq.push(...await fileAnh(duong)); else kq.push(duong)
  }
  return kq
}

const du = { luc: new Date().toISOString(), khoa_so: ok(await sb.from('khoa_so').select('*')), tai_khoan: await docHet('tai_khoan') }
for (const b of BANG) du[b] = await docHet(b)
mkdirSync('sao-luu-may', { recursive: true })
const tep = `sao-luu-may/truoc-lam-moi-${du.luc.slice(0, 19).replace(/[:T]/g, '-')}.json`
writeFileSync(tep, JSON.stringify(du))
console.log(`Đã sao lưu vào ${tep}`)

const anh = await fileAnh()
for (let i = 0; i < anh.length; i += 1000) ok(await sb.storage.from('anh').remove(anh.slice(i, i + 1000)))
console.log(`Đã xoá ${anh.length} file ảnh`)
// trigger khoá sổ chặn xoá dòng thuộc tháng đã chốt, nên mở khoá trước
ok(await sb.from('khoa_so').update({ khoa_den: null }).eq('id', true))
for (const b of BANG) ok(await sb.from(b).delete().not(KHOA[b] ?? 'id', 'is', null))

for (const b of BANG) {
  const { count } = await sb.from(b).select('*', { count: 'exact', head: true })
  console.log(`${b}: ${count}`)
}
console.log(`Tài khoản giữ lại: ${du.tai_khoan.length}. Xong, app như mới.`)
