import { describe, expect, it } from 'vitest'
import { cong2Gio, docOGio, gioBuoi, moTaLich, nhomBuoi, thieuGio } from './gio-hoc'

describe('giờ học', () => {
  it('ca mặc định 2 tiếng', () => {
    expect(cong2Gio('16:45')).toBe('18:45')
    expect(cong2Gio('23:30')).toBe('01:30')
  })

  it('mô tả lịch: cùng giờ gộp lại, khác giờ ghi từng thứ, thiếu giờ ghi rõ', () => {
    const g = { bd: '17:30', kt: '19:00' }
    expect(moTaLich({ lich: [5, 1, 3], gio_thu: { 1: g, 3: g, 5: g } })).toBe('T2-T4-T6 17:30–19:00')
    expect(moTaLich({ lich: [0, 6], gio_thu: { 6: { bd: '08:00', kt: '09:30' }, 0: { bd: '09:30', kt: '11:00' } } }))
      .toBe('T7 08:00–09:30 · CN 09:30–11:00')
    expect(moTaLich({ lich: [6, 0], gio_thu: {} })).toBe('T7 chưa có giờ · CN chưa có giờ')
    expect(thieuGio({ lich: [6, 0], gio_thu: { 6: g } })).toBe(true)
    expect(thieuGio({ lich: [6], gio_thu: { 6: g } })).toBe(false)
  })

  it('đọc ô giờ trong file import', () => {
    expect(docOGio('8:00-9:30')).toEqual({ bd: '08:00', kt: '09:30' })
    expect(docOGio(' 17:30 – 19:00 ')).toEqual({ bd: '17:30', kt: '19:00' })
    expect(docOGio('8h00 - 9h30')).toEqual({ bd: '08:00', kt: '09:30' })
    expect(docOGio('x')).toBeNull()
    expect(docOGio('19:00-17:30')).toBeNull()
    expect(docOGio('25:00-26:00')).toBeNull()
  })

  it('gom buổi cùng ngày + cùng giờ bắt đầu, buổi không giờ đứng riêng, xếp theo giờ', () => {
    const b = (id: string, bat_dau: string | null) => ({ id, ngay: '2026-11-21', bat_dau, ket_thuc: null })
    const nhom = nhomBuoi([b('c', '16:00:00'), b('a', '14:00:00'), b('x', null), b('d', '14:00:00'), b('y', null)])
    expect(nhom.map((n) => n.map((x) => x.id))).toEqual([['a', 'd'], ['c'], ['x'], ['y']])
    expect(gioBuoi({ bat_dau: '16:45:00', ket_thuc: '18:15:00' })).toBe('16:45–18:15')
    expect(gioBuoi({ bat_dau: null, ket_thuc: null })).toBe('')
  })
})
