// Điền file mẫu tải từ app: 1 lớp mới, học sinh đúng / thêm lớp / sai / trùng.
import ExcelJS from 'exceljs'
const [vao, ra] = process.argv.slice(2)
const wb = new ExcelJS.Workbook(); await wb.xlsx.readFile(vao)
const l = wb.getWorksheet('Lớp'), h = wb.getWorksheet('Học sinh')
console.log('trang:', wb.worksheets.map((w) => w.name).join(', '), '| lớp có sẵn:', l.rowCount - 2, '| validation C3:', JSON.stringify(h.getCell('C3').dataValidation.formulae))
l.addRow(['TEST Movers 2', '120.000', '', '17:30-19:00', '', '17:30-19:00', '', '8:00-9:30', ''])
l.addRow(['TEST Lớp hỏng', '', 'x'])
const r = (...v) => h.addRow(v)
// Cột: Mã HS, Họ tên *, Lớp *, Tên PH, SĐT PH, Ngày vào học, Đơn giá/buổi, Sticker đã có, Ghi chú, Link nhóm Zalo
r('', 'TEST Lê Minh Châu', 'TEST Movers 2', 'Chị Hằng', '0900 000 101', new Date(Date.UTC(2026, 10, 1)), '', 12, '', '')
r('', 'TEST Lê Minh Châu', 'TEST Lớp Starters', 'Chị Hằng', '0900000101', '', '', '', '', '')
r('', 'TEST Nguyễn Gia Bảo', 'TEST Movers 2', 'Chị Hằng', '+84900000101', '', 100000, '', 'em của Châu', '')
r('', 'TEST Phạm Đức Anh', 'TEST Movers 2', 'Chị Thu', '090000010', '', '', '', '', '')
r('', 'TEST Vũ Ngọc Hân', '', 'Anh Nam', '0900000103', '', '', '', '', '')
r('', 'TEST Đỗ Hải Yến', 'TEST Lớp hỏng', '', '', '', '', '', '', '')
r('', 'TEST Lê Minh Châu', 'TEST Movers 2', 'Chị Hằng', '0900000101', '', '', '', '', '')
await wb.xlsx.writeFile(ra); console.log('đã điền')
