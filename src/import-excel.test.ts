import { describe, expect, it } from 'vitest'
import ExcelJS from 'exceljs'
import { chuanLinkZalo, chuanNgay, chuanSdt, chuanTien, demCongViecImport, docFile, kiemTra, taoBufferFileMau, type DongHsTho, type DongLopTho } from './import-excel'
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
  it('lớp: đã có thì bỏ qua (không phân biệt hoa thường), đơn giá lớp tuỳ chọn (trống -> 0), cần ít nhất một thứ có giờ hợp lệ', () => {
    const { lops } = kiemTra([
      lop(2, 'starters 1', 999, 'g......'),
      lop(3, 'Movers 2', '120.000', '.g.g.g.'),
      lop(4, 'Flyers A', '', 'g......'),
      lop(5, 'Flyers B', 100000, '.......'),
      lop(6, 'Flyers C', 100000, 'x......'),
      lop(7, 'Flyers D', 100000, '.v.....'),
      lop(8, 'Flyers E', -50000, 'g......'),
    ], [], lopCo, [], [], HOM_NAY)
    expect(lops.map((l) => l.trangThai)).toEqual(['da_co', 'moi', 'moi', 'loi', 'loi', 'loi', 'loi'])
    expect(lops[1].lich).toEqual([2, 4, 6])
    expect(lops[1].gio_thu[4]).toEqual({ bd: '17:30', kt: '19:00' })
    expect(lops[2].don_gia).toBe(0)
    expect(lops[4].loi).toBe('Cột T2 ghi giờ dạng 17:30-19:00 (đang có "x")')
    expect(lops[5].loi).toMatch(/Cột T3/)
    expect(lops[6].loi).toMatch(/không hợp lệ/)
    expect(lops[1].don_gia).toBe(120000)
  })

  it('lớp không đặt đơn giá mặc định (don_gia = 0): HS mới để trống đơn giá phải báo lỗi thay vì âm thầm thành 0đ miễn phí', async () => {
    const lopKhongGia: Lop[] = [
      ...lopCo,
      { id: 'l3', ten: 'Lớp Giá Theo HS', don_gia: 0, lich: [1], gio_thu: { 1: { bd: '17:30', kt: '19:00' } }, hoat_dong: true },
    ]
    const { lops, hss } = kiemTra([
      lop(2, 'Lớp Mới Trống Giá', '', '.g.....'),
    ], [
      hs(2, { hoTen: 'Em Quên Ghi Giá DB', lop: 'Lớp Giá Theo HS', donGia: '' }),
      hs(3, { hoTen: 'Em Quên Ghi Giá File', lop: 'Lớp Mới Trống Giá', donGia: '' }),
      hs(4, { hoTen: 'Em Ghi Rõ 0đ', lop: 'Lớp Giá Theo HS', donGia: 0 }),
      hs(5, { hoTen: 'Em Ghi Rõ 150k', lop: 'Lớp Mới Trống Giá', donGia: 150000 }),
    ], lopKhongGia, [], [], HOM_NAY)
    expect(lops[0]).toMatchObject({ trangThai: 'moi', don_gia: 0 })
    expect(hss[0].trangThai).toBe('loi')
    expect(hss[0].loi).toMatch(/chưa đặt đơn giá mặc định/)
    expect(hss[1].trangThai).toBe('loi')
    expect(hss[1].loi).toMatch(/chưa đặt đơn giá mặc định/)
    expect(hss[2]).toMatchObject({ trangThai: 'moi', don_gia: 0 })
    expect(hss[3]).toMatchObject({ trangThai: 'moi', don_gia: 150000 })

    // taoBufferFileMau để trống cột Đơn giá ở trang Lớp khi lop.don_gia === 0 và round-trip vẫn 100% da_co
    const buf = await taoBufferFileMau(lopKhongGia, [], [])
    const { lopTho } = await docFile(buf)
    expect(lopTho.find((x) => x.ten === 'Lớp Giá Theo HS')?.donGia).toBe('')
    const rt = kiemTra(lopTho, [], lopKhongGia, [], [], HOM_NAY)
    expect(rt.lops.every((x) => x.trangThai === 'da_co' && !x.loi)).toBe(true)
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

  it('học sinh đã có trong DB (khớp Mã HS, hoặc Họ tên + SĐT/Link Zalo) nhập lớp mới -> them_lop với hocSinhId và ma_hs từ DB', () => {
    const { hss } = kiemTra([], [
      hs(2, { hoTen: 'Trần Khánh Linh', lop: 'Starters 2', sdt: '0903615240' }),
      hs(3, { hoTen: 'Trần Khánh Linh', lop: 'Starters 2', sdt: '0903615240' }), // lặp lại lớp đã thêm ở dòng 2 -> da_co
      hs(4, { hoTen: 'Lê Văn Mới', lop: 'Starters 1' }),
    ], lopCo, hsCo, gdCo, HOM_NAY)
    expect(hss.map((h) => h.trangThai)).toEqual(['them_lop', 'da_co', 'moi'])
    expect(hss[0]).toMatchObject({ hocSinhId: 'h1', ma_hs: 'HS001' })
    expect(hss[1].ma_hs).toBe('HS001')
    expect(hss[2].ma_hs).toBeNull()
  })

  it('Tầng 1 (Mã HS): khớp chính xác dù DB chưa có SĐT/Link Zalo; báo lỗi nếu mã không tồn tại hoặc sai tên', () => {
    const hsKhongSdt = [
      { id: 'h1', ma_hs: 'HS001', ho_ten: 'Ngọc Minh', don_gia: 0, sdt_phu_huynh: null, link_zalo: null },
    ] as HocSinh[]
    const { hss } = kiemTra([], [
      hs(2, { maHs: 'HS001', hoTen: 'Ngọc Minh', lop: 'Starters 2' }),
      hs(3, { maHs: 'HS999', hoTen: 'Ngọc Minh', lop: 'Starters 2' }),
      hs(4, { maHs: 'HS001', hoTen: 'Nguyễn Khác Tên', lop: 'Starters 2' }),
    ], lopCo, hsKhongSdt, gdCo, HOM_NAY)
    expect(hss[0]).toMatchObject({ trangThai: 'them_lop', hocSinhId: 'h1', ma_hs: 'HS001', don_gia: 0 })
    expect(hss[1].trangThai).toBe('loi')
    expect(hss[1].loi).toMatch(/Không tìm thấy Mã HS/)
    expect(hss[2].trangThai).toBe('loi')
    expect(hss[2].loi).toMatch(/không khớp/)
  })

  it('Tầng 2 & 3 (không có Mã HS): trùng tên thiếu cả SĐT lẫn Link Zalo thì báo lỗi (không tự gộp nhầm); có Link Zalo thì gộp/tách chính xác', () => {
    const hsZaloDb = [
      { id: 'h1', ma_hs: 'HS001', ho_ten: 'Trần Khánh Linh', don_gia: 120000, sdt_phu_huynh: null, link_zalo: 'https://zalo.me/g/linh-1' },
      { id: 'h2', ma_hs: 'HS002', ho_ten: 'Ngọc Minh', don_gia: 0, sdt_phu_huynh: null, link_zalo: null },
    ] as HocSinh[]
    const { hss } = kiemTra([], [
      // Cùng tên + cùng Link nhóm Zalo (không cần SĐT) -> khớp h1, thêm lớp
      hs(2, { hoTen: 'Trần Khánh Linh', lop: 'Starters 2', linkZalo: 'https://zalo.me/g/linh-1' }),
      // Cùng tên + khác Link nhóm Zalo (không cần SĐT) -> tách thành học sinh mới
      hs(3, { hoTen: 'Trần Khánh Linh', lop: 'Starters 2', linkZalo: 'https://zalo.me/g/linh-2' }),
      // Cùng tên nhưng thiếu cả SĐT lẫn Link Zalo -> báo lỗi, không gộp nhầm
      hs(4, { hoTen: 'Trần Khánh Linh', lop: 'Starters 2' }),
      // DB chưa có SĐT & Link Zalo, dòng import cũng không có Mã HS -> báo lỗi, không gộp nhầm
      hs(5, { hoTen: 'Ngọc Minh', lop: 'Starters 2', linkZalo: 'https://zalo.me/g/minh' }),
    ], lopCo, hsZaloDb, gdCo, HOM_NAY)
    expect(hss[0]).toMatchObject({ trangThai: 'them_lop', hocSinhId: 'h1', ma_hs: 'HS001', don_gia: 120000 })
    expect(hss[1]).toMatchObject({ trangThai: 'moi', ma_hs: null, link_zalo: 'https://zalo.me/g/linh-2' })
    expect(hss[2].trangThai).toBe('loi')
    expect(hss[2].loi).toMatch(/Link nhóm Zalo/)
    expect(hss[3].trangThai).toBe('loi')
    expect(hss[3].loi).toMatch(/HS002/)
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

  it('học sinh lỗi: thiếu tên, lớp không có, SĐT sai, hoặc để trống cả Lớp lẫn Đơn giá', () => {
    const { hss } = kiemTra([], [
      hs(2, { hoTen: '' }), hs(3, { lop: '' }), hs(4, { lop: 'Lớp ma' }), hs(5, { sdt: '091248730' }),
    ], lopCo, [], [], HOM_NAY)
    expect(hss.every((h) => h.trangThai === 'loi')).toBe(true)
    expect(hss.map((h) => h.loi)).toEqual([
      'Thiếu họ tên',
      'Chưa chọn lớp nên cần nhập Đơn giá/buổi (nhập 0 nếu miễn phí)',
      'Lớp "Lớp ma" chưa có (hoặc dòng lớp đó đang lỗi)',
      'SĐT phụ huynh "091248730" phải có 10 số, bắt đầu bằng 0',
    ])
  })

  it('cho phép import học sinh chưa xếp lớp (cột Lớp để trống, có Đơn giá) và xuất/round-trip đủ trong file mẫu', async () => {
    const { hss } = kiemTra([], [
      hs(2, { hoTen: 'Nguyễn Chưa Xếp', lop: '', donGia: 150000 }),
      hs(3, { hoTen: 'Nguyễn Miễn Phí', lop: '', donGia: 0 }),
      // Học sinh đã có trong DB để trống cột Lớp + thêm Link Zalo -> da_co kèm capNhatLink
      hs(4, { maHs: 'HS001', hoTen: 'Trần Khánh Linh', lop: '', linkZalo: 'https://zalo.me/g/linh-moi' }),
    ], lopCo, hsCo, gdCo, HOM_NAY)
    expect(hss[0]).toMatchObject({ trangThai: 'moi', tenLop: '', don_gia: 150000 })
    expect(hss[1]).toMatchObject({ trangThai: 'moi', tenLop: '', don_gia: 0 })
    expect(hss[2]).toMatchObject({ trangThai: 'da_co', ma_hs: 'HS001', capNhatLink: 'h1', link_zalo: 'https://zalo.me/g/linh-moi' })

    const hsChuaXep = [
      ...hsCo.map((x) => ({ ...x, ngay_vao: '2026-10-01', sticker_dau_ky: 0, trang_thai: 'dang_hoc' })),
      { id: 'h9', ma_hs: 'HS009', ho_ten: 'Em Chờ Lớp', don_gia: 150000, sdt_phu_huynh: null, link_zalo: null, ngay_vao: '2026-11-10', sticker_dau_ky: 0, trang_thai: 'dang_hoc' },
    ] as HocSinh[]
    const buf = await taoBufferFileMau(lopCo, hsChuaXep, gdCo)
    const { hsTho } = await docFile(buf)
    expect(hsTho.find((x) => x.maHs === 'HS009')).toMatchObject({ hoTen: 'Em Chờ Lớp', lop: '', donGia: 150000 })
    const rt = kiemTra([], hsTho, lopCo, hsChuaXep, gdCo, HOM_NAY)
    expect(rt.hss.every((x) => x.trangThai === 'da_co' && !x.loi)).toBe(true)
  })
})

describe('docFile', () => {
  it('đọc đúng trang Lớp và file Học sinh mẫu mới 9 cột (không có Mã HS)', async () => {
    const wb = new ExcelJS.Workbook()
    const l = wb.addWorksheet('Lớp')
    l.addRow(['Tên lớp *', 'Đơn giá/buổi *', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'])
    l.addRow(['Ví dụ: Movers 2', 120000, '', 'x'])
    l.addRow(['Flyers A', 150000, '8:00-9:30', '', '17:30 – 19:00'])
    const h = wb.addWorksheet('Học sinh')
    h.addRow(['Họ tên *', 'Lớp *', 'Tên phụ huynh', 'SĐT phụ huynh', 'Ngày vào học', 'Đơn giá/buổi', 'Sticker đã có', 'Ghi chú', 'Link nhóm Zalo'])
    h.addRow(['Ví dụ: Nguyễn Gia Bảo', 'Movers 2'])
    h.addRow([])
    h.addRow(['Đỗ Hải Yến', 'Flyers A', 'Chị Mai', '0911222333', new Date(Date.UTC(2026, 9, 5)), 160000, 4, '', ''])
    const buf = await wb.xlsx.writeBuffer()
    const { lopTho, hsTho } = await docFile(buf as ArrayBuffer)
    expect(lopTho.map((x) => x.so)).toEqual([3])
    expect(hsTho.map((x) => x.so)).toEqual([4])
    const { lops, hss } = kiemTra(lopTho, hsTho, [], [], [], HOM_NAY)
    expect(lops[0]).toMatchObject({ trangThai: 'moi', ten: 'Flyers A', lich: [1, 3], gio_thu: { 1: { bd: '08:00', kt: '09:30' }, 3: { bd: '17:30', kt: '19:00' } } })
    expect(hss[0]).toMatchObject({ trangThai: 'moi', ma_hs: null, ngay_vao: '2026-10-05', sdt_phu_huynh: '0911222333', don_gia: 160000, sticker_dau_ky: 4 })
  })

  it('đọc file mẫu chuẩn 10 cột có Mã HS: giữ Mã HS để đối chiếu DB và bỏ qua dòng chỉ có Mã HS rỗng nội dung', async () => {
    const wb = new ExcelJS.Workbook()
    wb.addWorksheet('Lớp').addRow(['Tên lớp *'])
    const h = wb.addWorksheet('Học sinh')
    h.addRow(['Mã HS', 'Họ tên *', 'Lớp *', 'Tên phụ huynh', 'SĐT phụ huynh', 'Ngày vào học', 'Đơn giá/buổi', 'Sticker đã có', 'Ghi chú', 'Link nhóm Zalo'])
    h.addRow(['HS999', '', '', '', '', '', '', '', '', '']) // dòng chỉ có Mã HS rỗng nội dung -> bỏ qua
    h.addRow(['HS001', 'Trần Khánh Linh', 'Starters 2', '', '', new Date(Date.UTC(2026, 9, 5)), '', 4, '', ''])
    h.addRow(['', 'Đỗ Hải Yến', 'Starters 1', 'Chị Mai', '', '', '', 4, '', 'https://zalo.me/g/yen1'])
    h.addRow(['', 'Đỗ Hải Yến', 'Starters 2', 'Chị Mai', '', '', '', '', '', 'https://zalo.me/g/yen1'])
    const { hsTho } = await docFile((await wb.xlsx.writeBuffer()) as ArrayBuffer)
    expect(hsTho).toHaveLength(3)
    const { hss } = kiemTra([], hsTho, lopCo, hsCo, gdCo, HOM_NAY)
    expect(hss.map((x) => [x.trangThai, x.ma_hs, x.hocSinhId, x.gopVoiDong])).toEqual([
      ['them_lop', 'HS001', 'h1', undefined],
      ['moi', null, undefined, undefined],
      ['them_lop', null, undefined, 4],
    ])
    expect(hss[1]).toMatchObject({ ho_ten: 'Đỗ Hải Yến', don_gia: 100000, link_zalo: 'https://zalo.me/g/yen1' })
  })

  it('file thiếu trang thì báo rõ', async () => {
    const wb = new ExcelJS.Workbook()
    wb.addWorksheet('Sheet1')
    await expect(docFile((await wb.xlsx.writeBuffer()) as ArrayBuffer)).rejects.toThrow(/Lớp/)
  })
})

describe('sửa lỗi Bug 8 (gộp theo tên + SĐT/Link Zalo, Mã HS, bật lại ngung, validate, round-trip taiFileMau)', () => {
  it('cùng tên trong cùng file mà thiếu SĐT và Link Zalo (kể cả dòng 1 có SĐT, dòng 2 để trống) -> báo lỗi chống gộp nhầm', () => {
    const { hss: loi1 } = kiemTra([], [
      hs(2, { hoTen: 'Phạm Minh An', lop: 'Starters 1', sdt: '0911223344', donGia: 150000 }),
      hs(3, { hoTen: 'Phạm Minh An', lop: 'Starters 2', sdt: '' }),
    ], lopCo, [], [], HOM_NAY)
    expect(loi1[0].trangThai).toBe('moi')
    expect(loi1[1].trangThai).toBe('loi')
    expect(loi1[1].loi).toMatch(/SĐT phụ huynh hoặc Link nhóm Zalo/)

    const { hss: loi2 } = kiemTra([], [
      hs(2, { hoTen: 'Phạm Minh An', lop: 'Starters 1', donGia: 150000 }),
      hs(3, { hoTen: 'Phạm Minh An', lop: 'Starters 2', donGia: 150000 }),
    ], lopCo, [], [], HOM_NAY)
    expect(loi2[0].trangThai).toBe('moi')
    expect(loi2[1].trangThai).toBe('loi')
  })

  it('8b: DB có >= 2 em trùng tên khác SĐT -> nhập đúng SĐT hoặc Mã HS khớp đúng em, để trống phải báo lỗi', () => {
    const haiEm = [
      ...hsCo,
      { id: 'h2', ma_hs: 'HS002', ho_ten: 'Trần Khánh Linh', don_gia: 150000, sdt_phu_huynh: '0988777666' },
    ] as HocSinh[]
    const { hss } = kiemTra([], [
      hs(2, { hoTen: 'Trần Khánh Linh', lop: 'Starters 2', sdt: '0988777666' }),
      hs(3, { maHs: 'HS001', hoTen: 'Trần Khánh Linh', lop: 'Starters 2' }),
      hs(4, { hoTen: 'Trần Khánh Linh', lop: 'Starters 2' }),
    ], lopCo, haiEm, gdCo, HOM_NAY)
    expect(hss[0]).toMatchObject({ trangThai: 'them_lop', hocSinhId: 'h2', ma_hs: 'HS002', don_gia: 150000 })
    expect(hss[1]).toMatchObject({ trangThai: 'them_lop', hocSinhId: 'h1', ma_hs: 'HS001', don_gia: 120000 })
    expect(hss[2].trangThai).toBe('loi')
    expect(hss[2].loi).toMatch(/SĐT phụ huynh/)
  })

  it('8c: học sinh từng ngung ở lớp cũ khi import lại (khớp Mã HS hoặc SĐT) phải thành them_lop (bật lại)', () => {
    const gdNgung: GhiDanh[] = [
      { id: 'gd1', hoc_sinh_id: 'h1', lop_id: 'l1', ngay_vao: '2026-10-01', trang_thai: 'ngung' },
    ]
    const { hss } = kiemTra([], [
      hs(2, { maHs: 'HS001', hoTen: 'Trần Khánh Linh', lop: 'Starters 1', ngayVao: '15/11/2026' }),
    ], lopCo, hsCo, gdNgung, HOM_NAY)
    expect(hss[0].trangThai).toBe('them_lop')
    expect(hss[0].hocSinhId).toBe('h1')
    expect(hss[0].ma_hs).toBe('HS001')
    expect((hss[0] as { batLai?: boolean }).batLai).toBe(true)
  })

  it('8d: chuanNgay không văng RangeError với NaN/Infinity/Invalid Date và từ chối năm < 2000', () => {
    expect(chuanNgay(Number.NaN, HOM_NAY).loi).toBeTruthy()
    expect(chuanNgay(Number.POSITIVE_INFINITY, HOM_NAY).loi).toBeTruthy()
    expect(chuanNgay(new Date('invalid'), HOM_NAY).loi).toBeTruthy()
    expect(chuanNgay('01/11/0026', HOM_NAY).loi).toBeTruthy()
    expect(chuanNgay('01/11/1999', HOM_NAY).loi).toBeTruthy()
  })

  it('8d: chuanTien từ chối số thập phân ("150.5") và chữ lẫn số ("abc 123")', () => {
    expect(chuanTien('150.5', 'Đơn giá', true).loi).toBeTruthy()
    expect(chuanTien('abc 123', 'Đơn giá', true).loi).toBeTruthy()
    expect(chuanTien('150.000 đ', 'Đơn giá', true).so).toBe(150000)
  })

  it('8d: chuanLinkZalo bỏ dấu câu cuối link và chặn scheme nguy hiểm / giả mạo domain', () => {
    expect(chuanLinkZalo('Vào nhóm: https://zalo.me/g/abc123.').link).toBe('https://zalo.me/g/abc123')
    expect(chuanLinkZalo('(https://zalo.me/g/abc123)').link).toBe('https://zalo.me/g/abc123')
    expect(chuanLinkZalo("javascript:alert('zalo.me/g/1')").loi).toBeTruthy()
    expect(chuanLinkZalo('https://evil.com/zalo.me/g/1').loi).toBeTruthy()
  })

  it('8f: demCongViecImport không đếm trùng dòng them_lop kiêm capNhatLink', () => {
    const { lops, hss } = kiemTra([], [
      hs(2, { maHs: 'HS001', hoTen: 'Trần Khánh Linh', lop: 'Starters 2', linkZalo: 'https://zalo.me/g/moi' }),
    ], lopCo, hsCo, gdCo, HOM_NAY)
    expect(hss[0].trangThai).toBe('them_lop')
    expect(hss[0].capNhatLink).toBe('h1')
    expect(demCongViecImport(lops, hss).tong).toBe(1)
  })

  it('round-trip taiFileMau -> docFile -> kiemTra ra toàn bộ da_co và 0 lỗi', async () => {
    const hsMau = [{
      ...hsCo[0],
      ten_phu_huynh: 'Chị Mai',
      ngay_vao: '2026-10-01',
      sticker_dau_ky: 5,
      ghi_chu: 'Ghi chú',
      link_zalo: 'https://zalo.me/g/mau',
      trang_thai: 'dang_hoc',
    }] as HocSinh[]
    const buf = await taoBufferFileMau(lopCo, hsMau, gdCo)
    const { lopTho, hsTho } = await docFile(buf)
    const { lops, hss } = kiemTra(lopTho, hsTho, lopCo, hsMau, gdCo, HOM_NAY)
    expect(lops.every((l) => l.trangThai === 'da_co' && !l.loi)).toBe(true)
    expect(hss.every((h) => h.trangThai === 'da_co' && !h.loi)).toBe(true)
  })
})

describe('đồng bộ logic chuẩn: 1 học phí cố định/HS & nhận diện 3 tầng (Mã HS -> SĐT hoặc Link nhóm Zalo)', () => {
  it('taoBufferFileMau tạo đúng 10 cột chuẩn (có Mã HS điền sẵn), giữ dropdown Lớp ở cột C và 0đ khi round-trip', async () => {
    const hsDaGia = [
      { id: 'h1', ma_hs: 'HS001', ho_ten: 'Ngọc Minh', don_gia: 0, sdt_phu_huynh: null, link_zalo: null, sticker_dau_ky: 0, trang_thai: 'dang_hoc' },
      { id: 'h2', ma_hs: 'HS002', ho_ten: 'Minh Trang', don_gia: 500000, sdt_phu_huynh: null, link_zalo: null, sticker_dau_ky: 0, trang_thai: 'dang_hoc' },
    ] as HocSinh[]
    const gdsDaGia: GhiDanh[] = [
      { id: 'g1', hoc_sinh_id: 'h1', lop_id: 'l1', ngay_vao: '2026-10-01', trang_thai: 'dang_hoc' },
      { id: 'g2', hoc_sinh_id: 'h2', lop_id: 'l1', ngay_vao: '2026-10-01', trang_thai: 'dang_hoc' },
      { id: 'g3', hoc_sinh_id: 'h2', lop_id: 'l2', ngay_vao: '2026-10-01', trang_thai: 'dang_hoc' },
    ]
    const buf = await taoBufferFileMau(lopCo, hsDaGia, gdsDaGia)
    const wb = new ExcelJS.Workbook()
    await wb.xlsx.load(buf)
    const wsHs = wb.getWorksheet('Học sinh')!
    expect(wsHs.getRow(1).values).toEqual([
      undefined, 'Mã HS', 'Họ tên *', 'Lớp', 'Tên phụ huynh', 'SĐT phụ huynh', 'Ngày vào học', 'Đơn giá/buổi', 'Sticker đã có', 'Ghi chú', 'Link nhóm Zalo',
    ])
    expect(wsHs.getCell('C3').dataValidation?.formulae).toEqual(["'Lớp'!$A$2:$A$500"])
    const { hsTho } = await docFile(buf)
    expect(hsTho.find((x) => x.hoTen === 'Ngọc Minh')).toMatchObject({ maHs: 'HS001', donGia: 0 })
    expect(hsTho.filter((x) => x.hoTen === 'Minh Trang').every((x) => x.maHs === 'HS002' && x.donGia === 500000)).toBe(true)
    const { hss } = kiemTra([], hsTho, lopCo, hsDaGia, gdsDaGia, HOM_NAY)
    expect(hss.every((x) => x.trangThai === 'da_co' && !x.loi && (x.ho_ten !== 'Ngọc Minh' || x.don_gia === 0))).toBe(true)
  })

  it('cùng tên không SĐT nhưng cùng Link nhóm Zalo gộp thành 1 HS cố định 1 mức học phí (Minh Trang 500k, Nhật Duy 150k, Ngọc Minh 0đ)', () => {
    const { hss } = kiemTra([], [
      hs(2, { hoTen: 'Minh Trang', lop: 'Starters 1', donGia: 500000, linkZalo: 'https://zalo.me/g/trang' }),
      hs(3, { hoTen: 'Minh Trang', lop: 'Starters 2', linkZalo: 'https://zalo.me/g/trang' }),
      hs(4, { hoTen: 'Nhật Duy', lop: 'Starters 1', donGia: 150000, linkZalo: 'https://zalo.me/g/duy' }),
      hs(5, { hoTen: 'Nhật Duy', lop: 'Starters 2', donGia: 150000, linkZalo: 'zalo.me/g/duy' }),
      hs(6, { hoTen: 'Ngọc Minh', lop: 'Starters 1', donGia: 0, sdt: '0911000111' }),
      hs(7, { hoTen: 'Ngọc Minh', lop: 'Starters 2', donGia: 0, sdt: '0911000111', linkZalo: 'https://zalo.me/g/minh' }),
    ], lopCo, [], [], HOM_NAY)
    expect(hss.map((x) => [x.trangThai, x.don_gia, x.gopVoiDong])).toEqual([
      ['moi', 500000, undefined],
      ['them_lop', 500000, 2],
      ['moi', 150000, undefined],
      ['them_lop', 150000, 4],
      ['moi', 0, undefined],
      ['them_lop', 0, 6],
    ])
    // Dòng 7 gộp theo SĐT và bổ sung link Zalo mới cho dòng 6
    expect(hss[5].link_zalo).toBe('https://zalo.me/g/minh')
  })

  it('tách thành 2 học sinh khác nhau khi trùng tên nhưng khác SĐT hoặc khác Link nhóm Zalo', () => {
    const { hss } = kiemTra([], [
      hs(2, { hoTen: 'Bảo An', lop: 'Starters 1', sdt: '0911111111', donGia: 150000 }),
      hs(3, { hoTen: 'Bảo An', lop: 'Starters 2', sdt: '0922222222', donGia: 200000 }),
      hs(4, { hoTen: 'Gia Huy', lop: 'Starters 1', linkZalo: 'https://zalo.me/g/huy-1', donGia: 120000 }),
      hs(5, { hoTen: 'Gia Huy', lop: 'Starters 2', linkZalo: 'https://zalo.me/g/huy-2', donGia: 140000 }),
    ], lopCo, [], [], HOM_NAY)
    expect(hss.map((x) => [x.trangThai, x.don_gia])).toEqual([
      ['moi', 150000],
      ['moi', 200000],
      ['moi', 120000],
      ['moi', 140000],
    ])
  })

  it('báo lỗi khi dòng thêm lớp ghi đơn giá khác học phí cố định của học sinh (DB hoặc dòng trên)', () => {
    const hsDb = [
      { id: 'h10', ma_hs: 'HS010', ho_ten: 'Đỗ Hoàng Thuỳ'.normalize('NFD'), don_gia: 150000, sdt_phu_huynh: '0903 615.240' },
    ] as HocSinh[]
    const gdDb: GhiDanh[] = [
      { id: 'g10', hoc_sinh_id: 'h10', lop_id: 'l1', ngay_vao: '2026-10-01', trang_thai: 'ngung' },
    ]
    const { hss } = kiemTra([], [
      // Khớp DB bằng dấu kiểu mới "Thùy" vs "Thuỳ" + SĐT có dấu cách, bật lại lớp ngừng giữ cố định 150k
      hs(2, { hoTen: 'Đỗ Hoàng Thùy'.normalize('NFC'), lop: 'Starters 1', sdt: '0903615240' }),
      // Lớp thứ 2 khớp bằng Mã HS nhưng ghi sai đơn giá -> báo lỗi rõ ràng
      hs(3, { maHs: 'HS010', hoTen: 'Đỗ Hoàng Thuỳ', lop: 'Starters 2', donGia: 200000 }),
      // Học sinh mới cùng Link Zalo dòng trên 500k nhưng dòng dưới ghi 1.000.000 -> báo lỗi lệch học phí cố định
      hs(4, { hoTen: 'Minh Trang', lop: 'Starters 1', donGia: 500000, linkZalo: 'https://zalo.me/g/trang' }),
      hs(5, { hoTen: 'Minh Trang', lop: 'Starters 2', donGia: 1000000, linkZalo: 'https://zalo.me/g/trang' }),
    ], lopCo, hsDb, gdDb, HOM_NAY)
    expect(hss[0]).toMatchObject({ trangThai: 'them_lop', batLai: true, hocSinhId: 'h10', don_gia: 150000 })
    expect(hss[1].trangThai).toBe('loi')
    expect(hss[1].loi).toMatch(/cố định/)
    expect(hss[3].trangThai).toBe('loi')
    expect(hss[3].loi).toMatch(/cố định/)
  })
})
