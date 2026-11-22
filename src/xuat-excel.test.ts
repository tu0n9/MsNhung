import { describe, expect, it } from 'vitest'
import { taoWorkbookExcel } from './xuat-excel'
import type { DuLieuThang } from './du-lieu'
import type { Goi } from './hoc-phi'
import type { GhiDanh, HocSinh, Lop } from './supabase'

const lopA: Lop = { id: 'la', ten: 'Starters 1', don_gia: 120_000, lich: [1], gio_thu: {}, hoat_dong: true }
const lopB: Lop = { id: 'lb', ten: 'Movers 2', don_gia: 150_000, lich: [3], gio_thu: {}, hoat_dong: true }

const hs = (id: string, ma_hs: string, ho_ten: string, don_gia: number): HocSinh => ({
  id, ma_hs, ho_ten, don_gia, avatar: null, ten_phu_huynh: 'Chị Lan', sdt_phu_huynh: '0901234567',
  phu_huynh_id: null, ngay_vao: '2026-10-01', don_gia_rieng: null, trang_thai: 'dang_hoc', ghi_chu: null, sticker_dau_ky: 0, link_zalo: null,
})

describe('taoWorkbookExcel (theo học sinh)', () => {
  it('học sinh học 2 lớp chỉ xuất hiện đúng 1 dòng, tổng công thức không cộng trùng và điểm danh gộp 2 buổi cùng ngày', async () => {
    const hs1 = hs('h1', 'HS001', 'Nguyễn An', 150_000)
    const hs2 = hs('h2', 'HS002', 'Trần Bình', 120_000)
    const gd: GhiDanh[] = [
      { id: 'gd1', hoc_sinh_id: 'h1', lop_id: 'la', ngay_vao: '2026-10-01', trang_thai: 'dang_hoc' },
      { id: 'gd2', hoc_sinh_id: 'h1', lop_id: 'lb', ngay_vao: '2026-10-01', trang_thai: 'dang_hoc' },
      { id: 'gd3', hoc_sinh_id: 'h2', lop_id: 'la', ngay_vao: '2026-10-01', trang_thai: 'dang_hoc' },
    ]
    const g1: Goi = {
      id: 'g1', hoc_sinh_id: 'h1', thang_bat_dau: '2026-11-01', so_thang: 1, don_gia: 150_000,
      buoi_du_kien: { '2026-11': 8 }, tien_du_tru: 0, dieu_chinh: 0,
    }
    const g2: Goi = {
      id: 'g2', hoc_sinh_id: 'h2', thang_bat_dau: '2026-11-01', so_thang: 1, don_gia: 120_000,
      buoi_du_kien: { '2026-11': 4 }, tien_du_tru: 0, dieu_chinh: 0,
    }
    const d: DuLieuThang = {
      thang: '2026-11',
      lops: [lopA, lopB],
      hocSinh: [hs1, hs2],
      ghiDanh: gd,
      goi: [g1, g2],
      phieu: [{ id: 'p1', goi_id: 'g1', so_tien: 1_000_000, ngay_thu: '2026-11-05', hinh_thuc: 'tien_mat', ghi_chu: null }],
      chi: [],
      luongTg: [],
      diemDanh: [
        { hoc_sinh_id: 'h1', trang_thai: 'co_mat', sticker: 2, ngay: '2026-11-07', lop_id: 'la' },
        { hoc_sinh_id: 'h1', trang_thai: 'co_mat', sticker: 3, ngay: '2026-11-07', lop_id: 'lb' },
      ],
      stickerNgoai: [{ hoc_sinh_id: 'h1', so: -1 }],
      danhGia: [],
      dong: [
        {
          hs: hs1, ghiDanh: gd.slice(0, 2), lopIds: ['la', 'lb'], tenLops: 'Movers 2, Starters 1',
          phaiThu: 1_200_000, noKyTruoc: 0, daThu: 1_000_000, conPhaiThu: 200_000, thucThu: 1_000_000, dongTruoc: 0,
          soBuoi: 2, dieuChinh: 0,
        },
        {
          hs: hs2, ghiDanh: gd.slice(2), lopIds: ['la'], tenLops: 'Starters 1',
          phaiThu: 480_000, noKyTruoc: 0, daThu: 0, conPhaiThu: 480_000, thucThu: 0, dongTruoc: 0,
          soBuoi: 0, dieuChinh: 0,
        },
      ],
    }

    const wb = await taoWorkbookExcel(d)
    expect(wb.worksheets.map((w) => w.name)).toEqual(['Tổng hợp', 'Học phí', 'Điểm danh', 'Sổ thu', 'Chi phí', 'Công nợ', 'Trợ giảng'])

    const wsHp = wb.getWorksheet('Học phí')!
    expect(wsHp.getCell('B2').value).toBe('HS001')
    expect(wsHp.getCell('C2').value).toBe('Nguyễn An')
    expect(wsHp.getCell('D2').value).toBe('Movers 2, Starters 1')
    expect(wsHp.getCell('G2').value).toBe(150_000)
    expect(wsHp.getCell('M2').value).toEqual({ formula: 'I2+J2+K2-L2', result: 200_000 })
    expect(wsHp.getCell('N2').value).toEqual({ formula: 'IF(M2>0,"Còn nợ","Đã đủ")', result: 'Còn nợ' })
    expect(wsHp.getCell('C3').value).toBe('Trần Bình')
    expect(wsHp.getCell('C4').value).toBe('TỔNG')
    expect(wsHp.getCell('I4').value).toEqual({ formula: 'SUM(I2:I3)' })
    expect(wsHp.getCell('M4').value).toEqual({ formula: 'SUM(M2:M3)' })

    const wsTong = wb.getWorksheet('Tổng hợp')!
    expect(wsTong.getCell('B2').value).toEqual({ formula: "'Học phí'!I4", result: 1_680_000 })
    expect(wsTong.getCell('F2').value).toEqual({ formula: "'Học phí'!M4", result: 680_000 })

    const wsDd = wb.getWorksheet('Điểm danh')!
    expect(wsDd.getCell('A2').value).toBe('Movers 2, Starters 1')
    expect(wsDd.getCell('C2').value).toBe('C+C')
    expect(wsDd.getCell('D2').value).toEqual({ formula: 'SUMPRODUCT(LEN(C2:C2)-LEN(SUBSTITUTE(SUBSTITUTE(C2:C2,"C",""),"B","")))' })
    expect(wsDd.getCell('E2').value).toBe(4) // 2 + 3 - 1 sticker ngoài buổi
  })

  it('tháng rỗng không tạo công thức SUM circular reference', async () => {
    const wb = await taoWorkbookExcel({
      thang: '2026-11', lops: [], dong: [], hocSinh: [], ghiDanh: [], phieu: [], chi: [], luongTg: [],
      diemDanh: [], stickerNgoai: [], goi: [], danhGia: [],
    })
    const wsHp = wb.getWorksheet('Học phí')!
    expect(wsHp.getCell('C2').value).toBe('TỔNG')
    expect(wsHp.getCell('I2').value).toBe(0)
    expect(wb.getWorksheet('Sổ thu')!.getCell('E2').value).toBe(0)
    expect(wb.getWorksheet('Công nợ')!.getCell('E2').value).toBe(0)
    expect(wb.getWorksheet('Trợ giảng')!.getCell('C2').value).toBe(0)
  })

  it('xuất Excel dùng đúng tien_thang cho học sinh học nhiều lớp khác giá', async () => {
    const mt = hs('mt', 'HS083', 'Minh Trang', 500_000)
    const gd: GhiDanh[] = [
      { id: 'gd1', hoc_sinh_id: 'mt', lop_id: 'la', ngay_vao: '2026-11-01', trang_thai: 'dang_hoc', don_gia_rieng: null },
      { id: 'gd2', hoc_sinh_id: 'mt', lop_id: 'lb', ngay_vao: '2026-11-01', trang_thai: 'dang_hoc', don_gia_rieng: 1_000_000 },
    ]
    const g: Goi = {
      id: 'gm', hoc_sinh_id: 'mt', thang_bat_dau: '2026-11-01', so_thang: 1, don_gia: 500_000,
      buoi_du_kien: { '2026-11': 9 }, tien_thang: { '2026-11': 7_000_000 }, tien_du_tru: 0, dieu_chinh: 0,
    }
    const wb = await taoWorkbookExcel({
      thang: '2026-11', lops: [lopA, lopB], hocSinh: [mt], ghiDanh: gd, goi: [g], phieu: [], chi: [], luongTg: [],
      diemDanh: [], stickerNgoai: [], danhGia: [],
      dong: [{
        hs: mt, ghiDanh: gd, lopIds: ['la', 'lb'], tenLops: 'Movers 2, Starters 1',
        phaiThu: 7_000_000, noKyTruoc: 0, daThu: 0, conPhaiThu: 7_000_000, thucThu: 0, dongTruoc: 0, soBuoi: 0, dieuChinh: 0,
      }],
    })
    const wsHp = wb.getWorksheet('Học phí')!
    expect(wsHp.getCell('C2').value).toBe('Minh Trang')
    expect(wsHp.getCell('I2').value).toBe(7_000_000)
    expect(wsHp.getCell('J2').value).toBe(0)
    expect(wb.getWorksheet('Tổng hợp')!.getCell('B2').value).toEqual({ formula: "'Học phí'!I3", result: 7_000_000 })
  })

  it('học sinh đang học có học phí > 0 nhưng chưa đóng gói nào trong tháng hiện "Chưa có gói" thay vì "Đã đủ"', async () => {
    const hsChuaGoi = hs('h1', 'HS001', 'Nguyễn Chưa Gói', 150_000)
    const hsMienPhi = hs('h2', 'HS002', 'Ngọc Minh Miễn Phí', 0)
    const hsDuTruoc = hs('h3', 'HS003', 'Trần Dư Kỳ Trước', 150_000)
    const gd: GhiDanh[] = [
      { id: 'gd1', hoc_sinh_id: 'h1', lop_id: 'la', ngay_vao: '2026-10-01', trang_thai: 'dang_hoc' },
      { id: 'gd2', hoc_sinh_id: 'h2', lop_id: 'la', ngay_vao: '2026-10-01', trang_thai: 'dang_hoc' },
      { id: 'gd3', hoc_sinh_id: 'h3', lop_id: 'la', ngay_vao: '2026-10-01', trang_thai: 'dang_hoc' },
    ]
    const wb = await taoWorkbookExcel({
      thang: '2026-11', lops: [lopA], hocSinh: [hsChuaGoi, hsMienPhi, hsDuTruoc], ghiDanh: gd,
      goi: [], phieu: [], chi: [], luongTg: [], diemDanh: [], stickerNgoai: [], danhGia: [],
      dong: [
        {
          hs: hsChuaGoi, ghiDanh: [gd[0]], lopIds: ['la'], tenLops: 'Starters 1',
          phaiThu: 0, noKyTruoc: 0, daThu: 0, conPhaiThu: 0, thucThu: 0, dongTruoc: 0, soBuoi: 4, dieuChinh: 0,
        },
        {
          hs: hsMienPhi, ghiDanh: [gd[1]], lopIds: ['la'], tenLops: 'Starters 1',
          phaiThu: 0, noKyTruoc: 0, daThu: 0, conPhaiThu: 0, thucThu: 0, dongTruoc: 0, soBuoi: 4, dieuChinh: 0,
        },
        {
          hs: hsDuTruoc, ghiDanh: [gd[2]], lopIds: ['la'], tenLops: 'Starters 1',
          phaiThu: 0, noKyTruoc: -100_000, daThu: 0, conPhaiThu: -100_000, thucThu: 0, dongTruoc: 0, soBuoi: 0, dieuChinh: 0,
        },
      ],
    })
    const wsHp = wb.getWorksheet('Học phí')!
    // dsHp sắp theo tenLops rồi ho_ten: Ngọc Minh Miễn Phí (dòng 2), Nguyễn Chưa Gói (dòng 3), Trần Dư Kỳ Trước (dòng 4)
    expect(wsHp.getCell('C2').value).toBe('Ngọc Minh Miễn Phí')
    expect(wsHp.getCell('N2').value).toEqual({ formula: 'IF(M2>0,"Còn nợ","Đã đủ")', result: 'Đã đủ' })

    expect(wsHp.getCell('C3').value).toBe('Nguyễn Chưa Gói')
    expect(wsHp.getCell('O3').value).toBe('Chưa có gói')
    expect(wsHp.getCell('N3').value).toEqual({
      formula: 'IF(M3>0,"Còn nợ",IF(M3=0,"Chưa có gói","Đã đủ"))',
      result: 'Chưa có gói',
    })

    expect(wsHp.getCell('C4').value).toBe('Trần Dư Kỳ Trước')
    expect(wsHp.getCell('N4').value).toEqual({ formula: 'IF(M4>0,"Còn nợ","Đã đủ")', result: 'Đã đủ' })
  })

  it('cột Đơn giá/buổi (G) trên sheet Học phí giữ đúng g.don_gia của gói tháng đó khi hs.don_gia tăng về sau', async () => {
    const hsTangGia = hs('h1', 'HS001', 'Nguyễn Tăng Giá', 250_000)
    const gd: GhiDanh[] = [{ id: 'gd1', hoc_sinh_id: 'h1', lop_id: 'la', ngay_vao: '2026-10-01', trang_thai: 'dang_hoc' }]
    const gCu: Goi = {
      id: 'g10', hoc_sinh_id: 'h1', thang_bat_dau: '2026-10-01', so_thang: 1, don_gia: 150_000,
      buoi_du_kien: { '2026-10': 8 }, tien_du_tru: 0, dieu_chinh: 0,
    }
    const wb = await taoWorkbookExcel({
      thang: '2026-10', lops: [lopA], hocSinh: [hsTangGia], ghiDanh: gd,
      goi: [gCu], phieu: [], chi: [], luongTg: [], diemDanh: [], stickerNgoai: [], danhGia: [],
      dong: [{
        hs: hsTangGia, ghiDanh: gd, lopIds: ['la'], tenLops: 'Starters 1',
        phaiThu: 1_200_000, noKyTruoc: 0, daThu: 1_200_000, conPhaiThu: 0, thucThu: 1_200_000, dongTruoc: 0, soBuoi: 8, dieuChinh: 0,
      }],
    })
    const wsHp = wb.getWorksheet('Học phí')!
    expect(wsHp.getCell('G2').value).toBe(150_000)
  })

  it('sheet Điểm danh giữ cả học sinh đã ngừng học (ngoài d.dong) có điểm danh hoặc sticker ngoài buổi, xử lý ngays rỗng và >24 ngày (AA/AB)', async () => {
    const hsDang = hs('h1', 'HS001', 'Nguyễn Đang Học', 150_000)
    const hsNgungDd: HocSinh = { ...hs('h2', 'HS002', 'Ngọc Minh Ngừng', 0), trang_thai: 'ngung' }
    const hsNgungSt: HocSinh = { ...hs('h3', 'HS003', 'Trần Ngừng Sticker', 150_000), trang_thai: 'ngung' }
    const gd: GhiDanh[] = [
      { id: 'gd1', hoc_sinh_id: 'h1', lop_id: 'la', ngay_vao: '2026-10-01', trang_thai: 'dang_hoc' },
      { id: 'gd2', hoc_sinh_id: 'h2', lop_id: 'lb', ngay_vao: '2026-10-01', trang_thai: 'ngung' },
      { id: 'gd3', hoc_sinh_id: 'h3', lop_id: 'la', ngay_vao: '2026-10-01', trang_thai: 'ngung' },
    ]
    // 26 ngày điểm danh trong tháng -> cột cuối là cột thứ 2 + 26 = 28 ('AB')
    const ngays26 = Array.from({ length: 26 }, (_, i) => `2026-11-${String(i + 1).padStart(2, '0')}`)
    const wb = await taoWorkbookExcel({
      thang: '2026-11', lops: [lopA, lopB], hocSinh: [hsDang, hsNgungDd, hsNgungSt], ghiDanh: gd,
      goi: [], phieu: [], chi: [], luongTg: [],
      diemDanh: [
        ...ngays26.map((ngay) => ({ hoc_sinh_id: 'h1', trang_thai: 'co_mat', sticker: 1, ngay, lop_id: 'la' })),
        { hoc_sinh_id: 'h2', trang_thai: 'co_mat', sticker: 3, ngay: '2026-11-05', lop_id: 'lb' },
      ],
      stickerNgoai: [{ hoc_sinh_id: 'h3', so: 5 }],
      danhGia: [],
      // d.dong chỉ chứa học sinh đang học (h1), không chứa h2 và h3 đã ngừng học & không phát sinh tiền
      dong: [{
        hs: hsDang, ghiDanh: [gd[0]], lopIds: ['la'], tenLops: 'Starters 1',
        phaiThu: 0, noKyTruoc: 0, daThu: 0, conPhaiThu: 0, thucThu: 0, dongTruoc: 0, soBuoi: 26, dieuChinh: 0,
      }],
    })
    const wsDd = wb.getWorksheet('Điểm danh')!
    // Movers 2: Ngọc Minh Ngừng (dòng 2); Starters 1: Nguyễn Đang Học (dòng 3), Trần Ngừng Sticker (dòng 4)
    expect(wsDd.getCell('A2').value).toBe('Movers 2')
    expect(wsDd.getCell('B2').value).toBe('Ngọc Minh Ngừng')
    expect(wsDd.getCell('B3').value).toBe('Nguyễn Đang Học')
    expect(wsDd.getCell('AC3').value).toEqual({
      formula: 'SUMPRODUCT(LEN(C3:AB3)-LEN(SUBSTITUTE(SUBSTITUTE(C3:AB3,"C",""),"B","")))',
    })
    expect(wsDd.getCell('B4').value).toBe('Trần Ngừng Sticker')
    expect(wsDd.getCell('AD4').value).toBe(5)

    // Trường hợp ngays.length === 0 nhưng vẫn có học sinh ngừng học được cộng sticker ngoài buổi
    const wbKhongNgay = await taoWorkbookExcel({
      thang: '2026-11', lops: [lopA], hocSinh: [hsNgungSt], ghiDanh: [gd[2]],
      goi: [], phieu: [], chi: [], luongTg: [], diemDanh: [],
      stickerNgoai: [{ hoc_sinh_id: 'h3', so: 4 }], danhGia: [], dong: [],
    })
    const wsDd0 = wbKhongNgay.getWorksheet('Điểm danh')!
    expect(wsDd0.getCell('B2').value).toBe('Trần Ngừng Sticker')
    expect(wsDd0.getCell('C2').value).toBe(0)
    expect(wsDd0.getCell('D2').value).toBe(4)
  })
})
