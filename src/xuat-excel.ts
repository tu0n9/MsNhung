// Xuất sổ học phí của một tháng. Cột tính toán là công thức để giáo viên sửa số trong Excel vẫn tự cập nhật.
import ExcelJS from 'exceljs'
import { tongCong, type DuLieuThang } from './du-lieu'
import { goiCuaThang, tenGoi } from './hoc-phi'

const TIEN = '#,##0'
const tenSheet = (s: string, daDung: Set<string>) => {
  let t = s.replace(/[[\]:*?/\\]/g, ' ').slice(0, 28) || 'Lop'
  while (daDung.has(t)) t = t.slice(0, 26) + '_' + daDung.size
  daDung.add(t)
  return t
}

function tieuDe(ws: ExcelJS.Worksheet, cot: { header: string; key: string; width: number; tien?: boolean }[]) {
  ws.columns = cot.map((c) => ({ header: c.header, key: c.key, width: c.width, style: c.tien ? { numFmt: TIEN } : {} }))
  ws.getRow(1).font = { bold: true }
  ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE7BA' } }
  ws.views = [{ state: 'frozen', ySplit: 1 }]
}

export async function xuatExcel(d: DuLieuThang) {
  const wb = new ExcelJS.Workbook()
  wb.calcProperties.fullCalcOnLoad = true // công thức chưa có kết quả lưu sẵn, bắt Excel tính lại khi mở
  const [y, m] = d.thang.split('-')
  const daDung = new Set<string>(['Tổng hợp', 'Điểm danh', 'Sổ thu', 'Chi phí', 'Công nợ', 'Trợ giảng'])
  const tong = wb.addWorksheet('Tổng hợp')

  // ---- Mỗi lớp một trang ----
  const tongLop: { ten: string; sheet: string; dongTong: number }[] = []
  for (const l of d.lops) {
    const ds = d.dong.filter((r) => r.hs.lop_id === l.id)
    if (!ds.length) continue
    const ten = tenSheet(l.ten, daDung)
    const ws = wb.addWorksheet(ten)
    tieuDe(ws, [
      { header: 'STT', key: 'stt', width: 5 }, { header: 'Học sinh', key: 'ten', width: 24 },
      { header: 'Phụ huynh', key: 'ph', width: 20 }, { header: 'SĐT', key: 'sdt', width: 13 },
      { header: 'Số buổi', key: 'buoi', width: 8 }, { header: 'Học phí', key: 'hp', width: 13, tien: true },
      { header: 'Điều chỉnh', key: 'dc', width: 12, tien: true }, { header: 'Nợ kỳ trước', key: 'no', width: 13, tien: true },
      { header: 'Đã thu', key: 'thu', width: 13, tien: true }, { header: 'Còn nợ', key: 'con', width: 13, tien: true },
      { header: 'Trạng thái', key: 'tt', width: 11 },
      // cột chữ để cuối: chèn giữa sẽ lệch chữ cột E–J mà công thức dòng và sheet Tổng hợp đang trỏ tới
      { header: 'Gói', key: 'goi', width: 24 },
    ])
    ds.forEach((r, i) => {
      const n = i + 2
      ws.addRow({
        stt: i + 1, ten: r.hs.ho_ten, ph: r.hs.ten_phu_huynh ?? '', sdt: r.hs.sdt_phu_huynh ?? '', buoi: r.soBuoi,
        hp: r.phaiThu - r.dieuChinh, dc: r.dieuChinh, no: r.noKyTruoc, thu: r.daThu,
        con: { formula: `F${n}+G${n}+H${n}-I${n}`, result: r.conPhaiThu },
        tt: { formula: `IF(J${n}>0,"Còn nợ","Đã đủ")`, result: r.conPhaiThu > 0 ? 'Còn nợ' : 'Đã đủ' },
        goi: (() => { const g = goiCuaThang(d.goi.filter((x) => x.hoc_sinh_id === r.hs.id), d.thang); return g ? tenGoi(g) : 'Chưa có gói' })(),
      })
    })
    const cuoi = ds.length + 1, dt = cuoi + 1
    const r = ws.addRow({ ten: 'TỔNG' })
    for (const c of ['E', 'F', 'G', 'H', 'I', 'J']) r.getCell(c).value = { formula: `SUM(${c}2:${c}${cuoi})` }
    r.font = { bold: true }
    tongLop.push({ ten: l.ten, sheet: ten, dongTong: dt })
  }

  // ---- Điểm danh ----
  const wsDd = wb.addWorksheet('Điểm danh')
  const ngays = [...new Set(d.diemDanh.map((x) => x.ngay))].sort()
  tieuDe(wsDd, [{ header: 'Lớp', key: 'lop', width: 14 }, { header: 'Học sinh', key: 'ten', width: 24 },
    ...ngays.map((n) => ({ header: n.slice(8) + '/' + n.slice(5, 7), key: n, width: 6 })),
    { header: 'Có mặt', key: 'tong', width: 8 }, { header: 'Sticker', key: 'st', width: 8 }])
  const kyHieu: Record<string, string> = { co_mat: 'C', vang: 'V', hoc_bu: 'B' }
  const cotCuoi = wsDd.getColumn(ngays.length + 2).letter
  for (const r of d.dong) {
    const cua = d.diemDanh.filter((x) => x.hoc_sinh_id === r.hs.id)
    if (!cua.length) continue
    const row = wsDd.addRow({ lop: d.lops.find((l) => l.id === r.hs.lop_id)?.ten, ten: r.hs.ho_ten,
      ...Object.fromEntries(cua.map((x) => [x.ngay, kyHieu[x.trang_thai]])), st: cua.reduce((s, x) => s + x.sticker, 0) })
    const n = row.number
    row.getCell('tong').value = ngays.length ? { formula: `COUNTIF(C${n}:${cotCuoi}${n},"C")+COUNTIF(C${n}:${cotCuoi}${n},"B")` } : 0
  }
  wsDd.addRow({}); wsDd.addRow({ ten: 'C = có mặt, V = vắng, B = học bù' })

  // ---- Sổ thu ----
  const wsThu = wb.addWorksheet('Sổ thu')
  tieuDe(wsThu, [{ header: 'Ngày', key: 'ngay', width: 11 }, { header: 'Học sinh', key: 'ten', width: 24 }, { header: 'Lớp', key: 'lop', width: 14 },
    { header: 'Gói', key: 'goi', width: 18 }, { header: 'Số tiền', key: 'tien', width: 13, tien: true },
    { header: 'Hình thức', key: 'ht', width: 13 }, { header: 'Ghi chú', key: 'gc', width: 24 }])
  for (const p of d.phieu) {
    const g = d.goi.find((x) => x.id === p.goi_id)
    const h = d.dong.find((r) => r.hs.id === g?.hoc_sinh_id)?.hs
    wsThu.addRow({ ngay: p.ngay_thu.split('-').reverse().join('/'), ten: h?.ho_ten, lop: d.lops.find((l) => l.id === h?.lop_id)?.ten,
      goi: g && tenGoi(g), tien: p.so_tien,
      ht: p.hinh_thuc === 'tien_mat' ? 'Tiền mặt' : 'Chuyển khoản', gc: p.ghi_chu })
  }
  const thuCuoi = d.phieu.length + 1
  const rThu = wsThu.addRow({ ten: 'TỔNG' }); rThu.getCell('tien').value = { formula: `SUM(E2:E${thuCuoi})` }; rThu.font = { bold: true }

  // ---- Chi phí ----
  const tgCuoi = d.luongTg.length + 1
  const wsChi = wb.addWorksheet('Chi phí')
  tieuDe(wsChi, [{ header: 'Ngày', key: 'ngay', width: 11 }, { header: 'Mục', key: 'muc', width: 20 }, { header: 'Số tiền', key: 'tien', width: 13, tien: true }, { header: 'Ghi chú', key: 'gc', width: 28 }])
  d.chi.forEach((c) => wsChi.addRow({ ngay: c.ngay.split('-').reverse().join('/'), muc: c.danh_muc, tien: c.so_tien, gc: c.ghi_chu }))
  const rL = wsChi.addRow({ muc: 'Lương trợ giảng', gc: 'Lấy từ trang Trợ giảng' })
  rL.getCell('tien').value = { formula: `'Trợ giảng'!C${tgCuoi + 1}` }
  const chiCuoi = rL.number
  const rChi = wsChi.addRow({ muc: 'TỔNG' }); rChi.getCell('tien').value = { formula: `SUM(C2:C${chiCuoi})` }; rChi.font = { bold: true }

  // ---- Công nợ ----
  const wsNo = wb.addWorksheet('Công nợ')
  tieuDe(wsNo, [{ header: 'Học sinh', key: 'ten', width: 24 }, { header: 'Lớp', key: 'lop', width: 14 }, { header: 'Phụ huynh', key: 'ph', width: 20 },
    { header: 'SĐT', key: 'sdt', width: 13 }, { header: 'Còn nợ', key: 'no', width: 13, tien: true }])
  const no = d.dong.filter((r) => r.conPhaiThu > 0)
  no.forEach((r) => wsNo.addRow({ ten: r.hs.ho_ten, lop: d.lops.find((l) => l.id === r.hs.lop_id)?.ten, ph: r.hs.ten_phu_huynh, sdt: r.hs.sdt_phu_huynh, no: r.conPhaiThu }))
  const rNo = wsNo.addRow({ ten: 'TỔNG' }); rNo.getCell('no').value = { formula: `SUM(E2:E${no.length + 1})` }; rNo.font = { bold: true }

  // ---- Trợ giảng ----
  const wsTg = wb.addWorksheet('Trợ giảng')
  tieuDe(wsTg, [{ header: 'Trợ giảng', key: 'ten', width: 24 }, { header: 'Số buổi', key: 'buoi', width: 9 }, { header: 'Thành tiền', key: 'tien', width: 14, tien: true }])
  d.luongTg.forEach((x) => wsTg.addRow({ ten: x.tg.ho_ten, buoi: x.soBuoi, tien: x.thanhTien }))
  const rTg = wsTg.addRow({ ten: 'TỔNG' })
  rTg.getCell('buoi').value = { formula: `SUM(B2:B${tgCuoi})` }; rTg.getCell('tien').value = { formula: `SUM(C2:C${tgCuoi})` }; rTg.font = { bold: true }

  // ---- Tổng hợp (lấy từ các trang trên bằng công thức) ----
  const t = tongCong(d)
  tieuDe(tong, [{ header: 'Lớp', key: 'lop', width: 22 }, { header: 'Học phí', key: 'hp', width: 14, tien: true }, { header: 'Điều chỉnh', key: 'dc', width: 13, tien: true },
    { header: 'Nợ kỳ trước', key: 'no', width: 14, tien: true }, { header: 'Đã thu', key: 'thu', width: 14, tien: true }, { header: 'Còn nợ', key: 'con', width: 14, tien: true }])
  for (const x of tongLop) {
    const ref = (c: string) => ({ formula: `'${x.sheet}'!${c}${x.dongTong}` })
    tong.addRow({ lop: x.ten, hp: ref('F'), dc: ref('G'), no: ref('H'), thu: ref('I'), con: ref('J') })
  }
  const lopCuoi = tongLop.length + 1
  const rT = tong.addRow({ lop: 'TỔNG CÁC LỚP' })
  for (const c of ['B', 'C', 'D', 'E', 'F']) rT.getCell(c).value = { formula: `SUM(${c}2:${c}${lopCuoi})` }
  rT.font = { bold: true }
  tong.addRow({})
  const rThuc = tong.addRow({ lop: 'Thực thu trong tháng' }); rThuc.getCell('hp').value = { formula: `'Sổ thu'!E${thuCuoi + 1}`, result: t.thucThu }
  const rTc = tong.addRow({ lop: 'Tổng chi' }); rTc.getCell('hp').value = { formula: `'Chi phí'!C${chiCuoi + 1}`, result: t.tongChi }
  const rCl = tong.addRow({ lop: 'Chênh lệch thu chi' }); rCl.getCell('hp').value = { formula: `B${rThuc.number}-B${rTc.number}`, result: t.chenhLech }
  rCl.font = { bold: true }
  tong.addRow({}); tong.addRow({ lop: `Sổ học phí tháng ${m}/${y} — Anh ngữ Ms.Nhung` })

  const buf = await wb.xlsx.writeBuffer()
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
  a.download = `hoc-phi-${y}-${m}.xlsx`
  a.click()
}
