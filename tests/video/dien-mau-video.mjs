// Điền file mẫu tải từ app cho video import: 1 lớp mới, 3 học sinh mới, 1 em đã có, 1 dòng lỗi SĐT.
import ExcelJS from 'exceljs'
const [vao, ra] = process.argv.slice(2)
const wb = new ExcelJS.Workbook()
await wb.xlsx.readFile(vao)
const l = wb.getWorksheet('Lớp'), h = wb.getWorksheet('Học sinh')
// ghi vào ngay dưới dòng ví dụ / các lớp có sẵn như người dùng gõ tay (addRow sẽ ghi sau 500 dòng đã định dạng)
const dongTrong = (ws) => { let r = 2; while (ws.getCell(r, 1).value) r++; return r }
l.getRow(dongTrong(l)).values = ['Kids 3', '130.000', 'x', '', 'x', '', '', '', '']
const hs = [
  ['Vũ Ngọc Hân', 'Kids 3', 'Anh Nam', '0900100006', new Date(Date.UTC(2026, 10, 2)), '', 2, ''],
  ['Hoàng Tuệ Nhi', 'Kids 3', 'Chị Mai', '0900100007', '', '', '', ''],
  ['Ngô Thảo My', 'Kids 3', 'Chị Thu', '090010008', '', '', '', 'SĐT thiếu 1 số'],
  ['Nguyễn Minh Anh', 'Movers 2', 'Chị Hà', '0900100001', '', '', '', 'em này đã có trong app'],
]
let r = dongTrong(h)
for (const x of hs) h.getRow(r++).values = x
await wb.xlsx.writeFile(ra)
