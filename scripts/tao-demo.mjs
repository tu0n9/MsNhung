// Tạo bộ dữ liệu demo để bàn giao thử (người dùng chốt 2026-11-15). Chạy: npm run tao-demo; xoá: npm run lam-moi.
// Không tạo tài khoản mới: dùng trợ giảng và phụ huynh đang có (TRO_GIANG, PHU_HUYNH bên dưới), đăng nhập thử bằng admin.
// 3 tháng tính tới hôm nay: 3 lớp, 15 học sinh, điểm danh (vắng, học bù lớp khác, 1 buổi lớp nghỉ, 1 buổi quên điểm
// danh), ảnh lớp, gói 1 / 3 tháng với đủ kiểu đóng tiền, chi phí, chốt sổ 2 tháng trước. Số ngẫu nhiên có hạt giống
// nên chạy lại ra y hệt. Thêm bên cạnh dữ liệu đang có, không xoá gì; từ chối chạy khi đã có lớp demo (tránh tạo trùng).
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

const TRO_GIANG = 'tg01'           // ten_dang_nhap
const PHU_HUYNH = '0356998740'     // so_dien_thoai, phụ huynh của hai anh em Minh Anh, Minh Khôi

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, { auth: { persistSession: false } })
const ok = ({ data, error }) => { if (error) throw new Error(error.message); return data }
const them = async (b, dong) => ok(await sb.from(b).insert(dong).select())

const LOP_DEMO = ['Starters 1', 'Movers 2', 'Flyers A']
const daCo = ok(await sb.from('lop').select('ten').in('ten', LOP_DEMO))
if (daCo.length) { console.log(`Đã có lớp demo (${daCo.map((x) => x.ten).join(', ')}), không tạo trùng.`); process.exit(1) }
const tg = ok(await sb.from('tai_khoan').select('id').eq('ten_dang_nhap', TRO_GIANG).single())
const ph = ok(await sb.from('tai_khoan').select('id, ho_ten').eq('so_dien_thoai', PHU_HUYNH).single())

let hat = 20261115
const rnd = () => ((hat = (hat * 1103515245 + 12345) % 2147483648) / 2147483648)
const homNay = new Date().toLocaleDateString('sv-SE')
const congThang = (t, n) => { const [y, m] = t.split('-').map(Number); return new Date(Date.UTC(y, m - 1 + n, 1)).toISOString().slice(0, 7) }
const M = homNay.slice(0, 7), THANG = [congThang(M, -2), congThang(M, -1), M]
const ngayCua = (t) => { const [y, m] = t.split('-').map(Number); const n = new Date(Date.UTC(y, m, 0)).getUTCDate(); return Array.from({ length: n }, (_, i) => `${t}-${String(i + 1).padStart(2, '0')}`) }
const thu = (ngay) => new Date(`${ngay}T00:00:00Z`).getUTCDay()
const chuaQua = (ngay) => (ngay > homNay ? homNay : ngay)  // phiếu thu, chi phí không ghi ngày tương lai

const gio = (thu, bd, kt) => Object.fromEntries(thu.map((t) => [t, { bd, kt }]))
const lop = await them('lop', [
  { ten: 'Starters 1', don_gia: 120000, lich: [1, 3, 5], gio_thu: gio([1, 3, 5], '17:30', '19:00') },
  { ten: 'Movers 2', don_gia: 150000, lich: [2, 4], gio_thu: gio([2, 4], '18:00', '19:30') },
  { ten: 'Flyers A', don_gia: 180000, lich: [6, 0], gio_thu: { ...gio([6], '08:00', '09:30'), ...gio([0], '09:30', '11:00') } },
])
const TEN = [
  ['Nguyễn Minh Anh', 'Trần Bảo Ngọc', 'Lê Gia Huy', 'Phạm Thảo Vy', 'Đỗ Đức Minh'],
  ['Nguyễn Minh Khôi', 'Vũ Khánh Linh', 'Hoàng Nhật Nam', 'Bùi Hà My', 'Đặng Quốc Bảo'],
  ['Ngô Thanh Trúc', 'Phan Anh Tuấn', 'Lý Mai Chi', 'Trịnh Hoàng Long', 'Mai Phương Thảo'],
]
const hs = []
for (const [li, l] of lop.entries()) for (const [i, ten] of TEN[li].entries()) {
  const anhEm = ten.startsWith('Nguyễn Minh')
  hs.push({
    ho_ten: ten, lop_id: l.id, ngay_vao: li === 2 && i === 4 ? `${THANG[1]}-15` : `${THANG[0]}-01`,  // Thảo vào giữa tháng
    ten_phu_huynh: anhEm ? ph.ho_ten : `Phụ huynh ${ten.split(' ').pop()}`,
    sdt_phu_huynh: anhEm ? PHU_HUYNH : `0900200${String(li * 5 + i).padStart(3, '0')}`, phu_huynh_id: anhEm ? ph.id : null,
    sticker_dau_ky: Math.floor(rnd() * 10), ghi_chu: null,
  })
}
const dsHs = await them('hoc_sinh', hs)
const avatar = readFileSync('tests/e2e/avatar.jpg'), anhLop = readFileSync('tests/e2e/lop.jpg')
for (const h of dsHs.filter((_, i) => i % 4 === 0)) {
  const duong = `avatar/${h.id}-demo.jpg`
  ok(await sb.storage.from('anh').upload(duong, avatar, { contentType: 'image/jpeg' }))
  ok(await sb.from('hoc_sinh').update({ avatar: duong }).eq('id', h.id))
}

// buổi theo lịch cả 3 tháng (tháng này sinh cả các ngày tới, như app tự sinh khi mở tháng)
const buoi = await them('buoi_hoc', lop.flatMap((l) => THANG.flatMap(ngayCua).filter((d) => l.lich.includes(thu(d))).map((ngay) => ({ lop_id: l.id, ngay, bat_dau: l.gio_thu[thu(ngay)].bd, ket_thuc: l.gio_thu[thu(ngay)].kt }))))
const buoiLop = (l) => buoi.filter((b) => b.lop_id === l.id).sort((a, b) => a.ngay.localeCompare(b.ngay))
const nghi = buoiLop(lop[1]).filter((b) => b.ngay.startsWith(THANG[1]))[1]
ok(await sb.from('buoi_hoc').update({ lop_nghi: true, ghi_chu: 'Nghỉ lễ' }).eq('id', nghi.id))
const qua = buoiLop(lop[0]).filter((b) => b.ngay < homNay)
const quen = qua[qua.length - 1]  // buổi quên điểm danh: ô vàng trên lưới tháng

const dd = [], tgb = [], daDiem = []
for (const l of lop) for (const b of buoiLop(l)) {
  if (b.ngay >= homNay || b.id === nghi.id || b.id === quen.id) continue
  daDiem.push(b)
  for (const h of dsHs.filter((x) => x.lop_id === l.id && x.ngay_vao <= b.ngay)) {
    const vang = rnd() < 0.12
    dd.push({ buoi_id: b.id, hoc_sinh_id: h.id, trang_thai: vang ? 'vang' : 'co_mat', sticker: vang ? 0 : Math.floor(rnd() * 4) })
  }
  if (l !== lop[2]) tgb.push({ buoi_id: b.id, tro_giang_id: tg.id })
}
// vài em vắng thì học bù ở buổi gần nhất của lớp khác
for (const v of dd.filter((x) => x.trang_thai === 'vang').slice(0, 6)) {
  const ngay = buoi.find((b) => b.id === v.buoi_id).ngay
  const lopEm = dsHs.find((h) => h.id === v.hoc_sinh_id).lop_id
  const bu = daDiem.filter((b) => b.lop_id !== lopEm && b.ngay > ngay).sort((a, b) => a.ngay.localeCompare(b.ngay))[0]
  if (bu && !dd.some((x) => x.buoi_id === bu.id && x.hoc_sinh_id === v.hoc_sinh_id))
    dd.push({ buoi_id: bu.id, hoc_sinh_id: v.hoc_sinh_id, trang_thai: 'hoc_bu', sticker: 1 })
}
for (let i = 0; i < dd.length; i += 500) await them('diem_danh', dd.slice(i, i + 500))
await them('tro_giang_buoi', tgb)

for (const l of lop) for (const b of daDiem.filter((x) => x.lop_id === l.id).slice(-3)) {
  const duong = `buoi/${b.id}/demo.jpg`
  ok(await sb.storage.from('anh').upload(duong, anhLop, { contentType: 'image/jpeg' }))
  await them('anh_buoi', { buoi_id: b.id, duong_dan: duong })
}

// gói học: 5 kiểu đóng tiền xoay vòng theo học sinh
const soBuoi = (l, t, tu) => ngayCua(t).filter((d) => l.lich.includes(thu(d)) && d >= tu).length
const goi = async (h, l, tu, n, thu1, tienDu = 0) => {
  const thangs = THANG.slice(THANG.indexOf(tu.slice(0, 7)), THANG.indexOf(tu.slice(0, 7)) + n)
  const [g] = await them('goi_hoc', {
    hoc_sinh_id: h.id, thang_bat_dau: `${thangs[0]}-01`, so_thang: n, don_gia: l.don_gia, tien_du_tru: tienDu, dieu_chinh: 0,
    buoi_du_kien: Object.fromEntries(thangs.map((t) => [t, soBuoi(l, t, h.ngay_vao)])),
  })
  const tong = Object.values(g.buoi_du_kien).reduce((s, x) => s + x, 0) * l.don_gia - tienDu
  // đóng đủ thì đúng bằng học phí; đóng thiếu thì làm tròn 50 nghìn như tiền thật
  const tien = thu1 === 1 ? tong : Math.round(tong * thu1 / 50000) * 50000
  if (tien > 0) await them('phieu_thu', { goi_id: g.id, so_tien: tien, ngay_thu: chuaQua(`${thangs[0]}-05`), hinh_thuc: h.ho_ten.length % 2 ? 'tien_mat' : 'chuyen_khoan' })
}
for (const [i, h] of dsHs.entries()) {
  const l = lop.find((x) => x.id === h.lop_id), dau = h.ngay_vao.slice(0, 7)
  const tuThang = (t) => (t === dau ? h.ngay_vao : `${t}-01`)
  const kieu = i % 5
  if (kieu === 0 && dau === THANG[0]) { await goi(h, l, h.ngay_vao, 3, 1); continue }  // đóng trước 3 tháng
  for (const t of THANG.filter((x) => x >= dau)) {
    const cuoi = t === M
    // kiểu 1: tháng này mới đóng một nửa; 2: tháng này chưa đóng; 3: tháng trước đóng thiếu (nợ kỳ trước)
    const phan = cuoi && kieu === 1 ? 0.5 : cuoi && kieu === 2 ? 0 : t === THANG[1] && kieu === 3 ? 0.6 : 1
    // buổi lớp nghỉ tháng trước thành tiền dư, trừ vào gói tháng này của lớp Movers
    await goi(h, l, tuThang(t), 1, phan, cuoi && l === lop[1] ? l.don_gia : 0)
  }
}

await them('chi_phi', THANG.flatMap((t, i) => [
  { ngay: `${t}-01`, danh_muc: 'Thuê phòng', so_tien: 3000000, ghi_chu: null },
  { ngay: chuaQua(`${t}-25`), danh_muc: 'Điện nước', so_tien: 400000 + i * 50000, ghi_chu: null },
  ...(i === 1 ? [{ ngay: `${t}-08`, danh_muc: 'Tài liệu', so_tien: 650000, ghi_chu: 'Sách Movers' }] : []),
  ...(i === 2 ? [{ ngay: chuaQua(`${t}-03`), danh_muc: 'Sticker / quà', so_tien: 200000, ghi_chu: null }] : []),
]))

// chốt sổ 2 tháng trước, như giáo viên bấm "Chốt sổ tháng" cuối mỗi tháng
await them('nhat_ky_chot_so', [{ thang: `${THANG[0]}-01`, hanh_dong: 'chot' }, { thang: `${THANG[1]}-01`, hanh_dong: 'chot' }])
const { khoa_den: k } = ok(await sb.from('khoa_so').select('khoa_den').single())
if (!k || k < `${THANG[1]}-01`) ok(await sb.from('khoa_so').update({ khoa_den: `${THANG[1]}-01` }).eq('id', true))

console.log(`Đã tạo demo ${THANG[0]} → ${homNay}: ${lop.length} lớp, ${dsHs.length} học sinh, ${buoi.length} buổi, ${dd.length} điểm danh, ${tgb.length} buổi trợ giảng; chốt sổ đến hết ${THANG[1]}.`)
console.log(`Đăng nhập thử: admin (giáo viên), ${TRO_GIANG} (trợ giảng), ${PHU_HUYNH} (phụ huynh của Nguyễn Minh Anh, Nguyễn Minh Khôi).`)
