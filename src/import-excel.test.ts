import { describe, expect, it } from 'vitest'
import ExcelJS from 'exceljs'
import { chuanLinkZalo, chuanNgay, chuanSdt, chuanTien, docFile, kiemTra, type DongHsTho, type DongLopTho } from './import-excel'
import type { GhiDanh, HocSinh, Lop } from './supabase'

const HOM_NAY = '2026-11-15'
const lopCo: Lop[] = [
  { id: 'l1', ten: 'Starters 1', don_gia: 100000, lich: [1, 3], gio_thu: {}, hoat_dong: true },
  { id: 'l2', ten: 'Starters 2', don_gia: 130000, lich: [2, 4], gio_thu: {}, hoat_dong: true },
]
const hsCo = [{ id: 'h1', ma_hs: 'HS001', ho_ten: 'Trần Khánh Linh', don_gia: 120000, sdt_phu_huynh: '0903615240' }] as HocSinh[]
const gdCo: GhiDanh[] = [{ id: 'gd1', hoc_sinh_id: 'h1', lop_id: 'l1', ngay_vao: '2026-10-01', trang_thai: 'dang_hoc' }]
const hs = (so: number, o: Partial<DongHsTho>): DongHsTho => ({
  so, maHs: '', hoTen: 'Lê Minh Châu', lop: 'Starters 1', tenPh: '', sdt: '', ngayVao: '', donGia: '', sticker: '', ghiChu: '', linkZalo: '', ...o,
})
// 'g' = ô ghi giờ hợp lệ, '.' = ô trống, ký tự khác giữ nguyên (ví dụ 'x' kiểu file cũ)
const lop = (so: number, ten: string, donGia: unknown, thu: string): DongLopTho =>
  ({ so, ten, donGia, thu: [...thu].map((c) => (c === 'g' ? '17:30-19:00' : c === '.' ? '' : c)) })

describe('chuẩn hoá ô', () => {
  it('SĐT: bỏ ký tự thừa, +84 thành 0, số mất 0 đầu do ô kiểu số, báo lỗi khi thiếu số', () => {
    expect(chuanSdt('0912 487.305').sdt).toBe('0912487305')
    expect(chuanSdt('+84 912 487 305').sdt).toBe('0912487305')
    expect(chuanSdt(912487305).sdt).toBe('0912487305')
    expect(chuanSdt('091248730').loi).toMatch(/10 số/)
    expect(chuanSdt('').sdt).toBeNull()
  })
  it('tiền: "150.000", số, âm, chữ', () => {
    expect(chuanTien('150.000', 'Đơn giá', true).so).toBe(150000)
    expect(chuanTien(120000, 'Đơn giá', true).so).toBe(120000)
    expect(chuanTien('-50000', 'Đơn giá', true).loi).toMatch(/âm/)
    expect(chuanTien('', 'Đơn giá', true).loi).toMatch(/Thiếu/)
    expect(chuanTien('', 'Đơn giá/buổi', false).so).toBeNull()
  })
  it('ngày: ô ngày, chữ dd/mm/yyyy, trống = hôm nay, ngày không có thật', () => {
    expect(chuanNgay(new Date(Date.UTC(2026, 10, 1)), HOM_NAY).ngay).toBe('2026-11-01')
    expect(chuanNgay('3/9/2026', HOM_NAY).ngay).toBe('2026-09-03')
    expect(chuanNgay('', HOM_NAY).ngay).toBe(HOM_NAY)
    expect(chuanNgay('31/02/2026', HOM_NAY).loi).toMatch(/không có thật/)
  })
  it('link Zalo: lọc link khỏi lời mời, thêm https, báo lỗi khi không có link', () => {
    expect(chuanLinkZalo('Tham gia nhóm "Lớp Bảo" trên Zalo: https://zalo.me/g/abc123 nhé').link).toBe('https://zalo.me/g/abc123')
    expect(chuanLinkZalo('zalo.me/g/xyz').link).toBe('https://zalo.me/g/xyz')
    // ô hyperlink có nhãn chữ: link nằm ở .hyperlink
    expect(chuanLinkZalo({ text: 'Nhóm lớp 3', hyperlink: 'https://zalo.me/g/nhan123' }).link).toBe('https://zalo.me/g/nhan123')
    expect(chuanLinkZalo('http://www.zalo.me/g/xyz').link).toBe('https://zalo.me/g/xyz')
    expect(chuanLinkZalo('').link).toBeNull()
    expect(chuanLinkZalo('https://facebook.com/g/1').loi).toMatch(/zalo\.me/)
  })
})

describe('kiemTra', () => {
  it('lớp: đã có thì bỏ qua (không phân biệt hoa thường), lớp mới cần đơn giá và ít nhất một thứ có giờ', () => {
    const { lops } = kiemTra([
      lop(2, 'starters 1', 999, 'g......'),
      lop(3, 'Movers 2', '120.000', '.g.g.g.'),
      lop(4, 'Flyers A', '', 'g......'),
      lop(5, 'Flyers B', 100000, '.......'),
      lop(6, 'Flyers C', 100000, 'x......'),
      lop(7, 'Flyers D', 100000, '.v.....'),
    ], [], lopCo, [], [], HOM_NAY)
    expect(lops.map((l) => l.trangThai)).toEqual(['da_co', 'moi', 'loi', 'loi', 'loi', 'loi'])
    expect(lops[1].lich).toEqual([2, 4, 6])
    expect(lops[1].gio_thu[4]).toEqual({ bd: '17:30', kt: '19:00' })
    expect(lops[4].loi).toBe('Cột T2 ghi giờ dạng 17:30-19:00 (đang có "x")')
    expect(lops[5].loi).toMatch(/Cột T3/)
    expect(lops[1].don_gia).toBe(120000)
  })

  it('học sinh: trùng đúng lớp thì bỏ qua; cùng tên + SĐT ở lớp khác nhau được gộp thành 1 em (them_lop)', () => {
    const { hss } = kiemTra([lop(2, 'Movers 2', 150000, '.g.....')], [
      hs(2, { hoTen: 'Trần Khánh Linh', sdt: '0903 615 240' }), // đã có ở Starters 1
      hs(3, { lop: 'Movers 2', sdt: '0987220413', sticker: 12 }), // mới ở Movers 2
      hs(4, { lop: 'Movers 2', sdt: '0987220413' }), // trùng đúng lớp với dòng 3
      hs(5, { lop: 'Starters 1', sdt: '0987220413' }), // cùng tên + SĐT với dòng 3 ở lớp mới -> gộp lớp
      hs(6, { hoTen: 'Trần Khánh Linh', sdt: '0909000000' }), // trùng tên nhưng khác SĐT -> học sinh mới
    ], lopCo, hsCo, gdCo, HOM_NAY)
    expect(hss.map((h) => h.trangThai)).toEqual(['da_co', 'moi', 'da_co', 'them_lop', 'moi'])
    expect(hss[1].sticker_dau_ky).toBe(12)
    expect(hss[1].ngay_vao).toBe(HOM_NAY)
    expect(hss[1].don_gia).toBe(150000)
    expect(hss[3].gopVoiDong).toBe(3)
    expect(hss[4].don_gia).toBe(100000)
  })

  it('học sinh đã có trong DB (khớp Mã HS hoặc Họ tên + SĐT) nhập lớp mới -> them_lop với hocSinhId', () => {
    const { hss } = kiemTra([], [
      hs(2, { maHs: 'hs001', hoTen: 'Trần Khánh Linh', lop: 'Starters 2' }),
      hs(3, { hoTen: 'Trần Khánh Linh', lop: 'Starters 2', sdt: '0903615240' }), // lặp lại lớp đã thêm ở dòng 2 -> da_co
      hs(4, { maHs: 'HS999', hoTen: 'Không tồn tại', lop: 'Starters 1' }),
    ], lopCo, hsCo, gdCo, HOM_NAY)
    expect(hss.map((h) => h.trangThai)).toEqual(['them_lop', 'da_co', 'loi'])
    expect(hss[0].hocSinhId).toBe('h1')
    expect(hss[2].loi).toMatch(/HS999/)
  })

  it('trùng tên nhưng thiếu cả Mã HS lẫn SĐT -> báo lỗi để tránh gộp nhầm 2 người khác nhau', () => {
    const { hss } = kiemTra([], [
      hs(2, { hoTen: 'Trần Khánh Linh', lop: 'Starters 2', sdt: '' }),
    ], lopCo, hsCo, gdCo, HOM_NAY)
    expect(hss[0].trangThai).toBe('loi')
    expect(hss[0].loi).toMatch(/Mã HS/)
  })

  it('học sinh đã có: link khác thì cập nhật, trống hoặc trùng thì giữ; học sinh mới mang link theo; link sai là lỗi', () => {
    const co = [{ ...hsCo[0], link_zalo: 'https://zalo.me/g/cu' }] as HocSinh[]
    const { hss } = kiemTra([], [
      hs(2, { hoTen: 'Trần Khánh Linh', sdt: '0903615240', linkZalo: 'https://zalo.me/g/moi' }),
      hs(3, { hoTen: 'Trần Khánh Linh', sdt: '0903615240', linkZalo: '' }),
      hs(4, { hoTen: 'Trần Khánh Linh', sdt: '0903615240', linkZalo: 'https://zalo.me/g/cu' }),
      hs(5, { linkZalo: 'zalo.me/g/em-moi' }),
      hs(6, { hoTen: 'Lê Văn A', linkZalo: 'nhóm lớp' }),
    ], lopCo, co, gdCo, HOM_NAY)
    expect(hss.map((h) => h.trangThai)).toEqual(['da_co', 'da_co', 'da_co', 'moi', 'loi'])
    expect(hss.map((h) => h.capNhatLink)).toEqual(['h1', undefined, undefined, undefined, undefined])
    expect(hss[0].link_zalo).toBe('https://zalo.me/g/moi')
    expect(hss[3].link_zalo).toBe('https://zalo.me/g/em-moi')
  })

  it('học sinh lỗi: thiếu tên, thiếu lớp, lớp không có, SĐT sai', () => {
    const { hss } = kiemTra([], [
      hs(2, { hoTen: '' }), hs(3, { lop: '' }), hs(4, { lop: 'Lớp ma' }), hs(5, { sdt: '091248730' }),
    ], lopCo, [], [], HOM_NAY)
    expect(hss.every((h) => h.trangThai === 'loi')).toBe(true)
    expect(hss.map((h) => h.loi)).toEqual([
      'Thiếu họ tên', 'Chưa chọn lớp', 'Lớp "Lớp ma" chưa có (hoặc dòng lớp đó đang lỗi)',
      'SĐT phụ huynh "091248730" phải có 10 số, bắt đầu bằng 0',
    ])
  })
})

describe('docFile', () => {
  it('đọc đúng trang Lớp và file Học sinh mẫu mới 10 cột (có Mã HS)', async () => {
    const wb = new ExcelJS.Workbook()
    const l = wb.addWorksheet('Lớp')
    l.addRow(['Tên lớp *', 'Đơn giá/buổi *', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'])
    l.addRow(['Ví dụ: Movers 2', 120000, '', 'x'])
    l.addRow(['Flyers A', 150000, '8:00-9:30', '', '17:30 – 19:00'])
    const h = wb.addWorksheet('Học sinh')
    h.addRow(['Mã HS', 'Họ tên *', 'Lớp *', 'Tên phụ huynh', 'SĐT phụ huynh', 'Ngày vào học', 'Đơn giá/buổi', 'Sticker đã có', 'Ghi chú', 'Link nhóm Zalo'])
    h.addRow(['', 'Ví dụ: Nguyễn Gia Bảo', 'Movers 2'])
    h.addRow([])
    h.addRow(['', 'Đỗ Hải Yến', 'Flyers A', 'Chị Mai', '0911222333', new Date(Date.UTC(2026, 9, 5)), 160000, 4, '', ''])
    const buf = await wb.xlsx.writeBuffer()
    const { lopTho, hsTho } = await docFile(buf as ArrayBuffer)
    expect(lopTho.map((x) => x.so)).toEqual([3])
    expect(hsTho.map((x) => x.so)).toEqual([4])
    const { lops, hss } = kiemTra(lopTho, hsTho, [], [], [], HOM_NAY)
    expect(lops[0]).toMatchObject({ trangThai: 'moi', ten: 'Flyers A', lich: [1, 3], gio_thu: { 1: { bd: '08:00', kt: '09:30' }, 3: { bd: '17:30', kt: '19:00' } } })
    expect(hss[0]).toMatchObject({ trangThai: 'moi', ngay_vao: '2026-10-05', sdt_phu_huynh: '0911222333', don_gia: 160000, sticker_dau_ky: 4 })
  })

  it('vẫn đọc được file mẫu cũ 9 cột không có Mã HS', async () => {
    const wb = new ExcelJS.Workbook()
    wb.addWorksheet('Lớp').addRow(['Tên lớp *'])
    const h = wb.addWorksheet('Học sinh')
    h.addRow(['Họ tên *', 'Lớp *', 'Tên phụ huynh', 'SĐT phụ huynh', 'Ngày vào học', 'Đơn giá riêng', 'Sticker đã có', 'Ghi chú', 'Link nhóm Zalo'])
    h.addRow(['Đỗ Hải Yến', 'Starters 1', 'Chị Mai', '0911222333', new Date(Date.UTC(2026, 9, 5)), '', 4, '', ''])
    const { hsTho } = await docFile((await wb.xlsx.writeBuffer()) as ArrayBuffer)
    const { hss } = kiemTra([], hsTho, lopCo, [], [], HOM_NAY)
    expect(hss[0]).toMatchObject({ trangThai: 'moi', ho_ten: 'Đỗ Hải Yến', don_gia: 100000, sdt_phu_huynh: '0911222333' })
  })

  it('file thiếu trang thì báo rõ', async () => {
    const wb = new ExcelJS.Workbook()
    wb.addWorksheet('Sheet1')
    await expect(docFile((await wb.xlsx.writeBuffer()) as ArrayBuffer)).rejects.toThrow(/Lớp/)
  })
})
