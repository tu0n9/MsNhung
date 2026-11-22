import { beforeEach, describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({
  hocSinhInserts: [] as Record<string, unknown>[],
  hocSinhUpdates: [] as { id: string; body: Record<string, unknown> }[],
  hocSinhDeletes: [] as string[],
  ghiDanhInserts: [] as Record<string, unknown>[],
  ghiDanhUpdates: [] as { hoc_sinh_id: string; lop_id: string; body: Record<string, unknown> }[],
  failGhiDanhInsert: false,
}))

vi.mock('./supabase', () => {
  const sb = {
    from(table: string) {
      if (table === 'hoc_sinh') {
        return {
          insert(body: Record<string, unknown>) {
            state.hocSinhInserts.push(body)
            return {
              select() {
                return {
                  single: async () => ({ data: { id: 'hs-moi-1' }, error: null }),
                }
              },
            }
          },
          update(body: Record<string, unknown>) {
            return {
              eq: async (_col: string, id: string) => {
                state.hocSinhUpdates.push({ id, body })
                return { data: null, error: null }
              },
            }
          },
          delete() {
            return {
              eq: async (_col: string, id: string) => {
                state.hocSinhDeletes.push(id)
                return { data: null, error: null }
              },
            }
          },
        }
      }
      if (table === 'ghi_danh') {
        return {
          insert: async (body: Record<string, unknown>) => {
            if (state.failGhiDanhInsert) return { data: null, error: { message: 'lỗi ghi_danh' } }
            state.ghiDanhInserts.push(body)
            return { data: null, error: null }
          },
          update(body: Record<string, unknown>) {
            return {
              eq(_c1: string, hsId: string) {
                return {
                  eq: async (_c2: string, lopId: string) => {
                    state.ghiDanhUpdates.push({ hoc_sinh_id: hsId, lop_id: lopId, body })
                    return { data: null, error: null }
                  },
                }
              },
            }
          },
        }
      }
      throw new Error(`Unexpected table ${table}`)
    },
  }
  return {
    sb,
    q: async <T,>(p: PromiseLike<{ data: T; error: { message: string } | null }>) => {
      const { data, error } = await p
      if (error) throw new Error(error.message)
      return data
    },
  }
})

import { nhapDuLieu } from './nhap-du-lieu'
import type { KqHs } from './import-excel'
import type { Lop } from './supabase'

const lopCo: Lop[] = [
  { id: 'l1', ten: 'Starters 1', don_gia: 100000, lich: [1], gio_thu: {}, hoat_dong: true },
]

describe('nhapDuLieu (8c, 8e)', () => {
  beforeEach(() => {
    state.hocSinhInserts = []
    state.hocSinhUpdates = []
    state.hocSinhDeletes = []
    state.ghiDanhInserts = []
    state.ghiDanhUpdates = []
    state.failGhiDanhInsert = false
  })

  it('8e: dọn hoc_sinh mồ côi khi ghi_danh.insert thất bại', async () => {
    state.failGhiDanhInsert = true
    const hsMoi: KqHs = {
      loai: 'hs', so: 2, trangThai: 'moi', ma_hs: null, ho_ten: 'Lê Minh A', tenLop: 'Starters 1',
      ten_phu_huynh: null, sdt_phu_huynh: null, ngay_vao: '2026-11-15', don_gia: 100000,
      sticker_dau_ky: 0, ghi_chu: null, link_zalo: null,
    }
    const kq = await nhapDuLieu([], [hsMoi], lopCo, () => {})
    expect(kq.hsMoi).toBe(0)
    expect(kq.loi).toHaveLength(1)
    expect(state.hocSinhDeletes).toEqual(['hs-moi-1'])
  })

  it('8c & 8e: them_lop bật lại hoc_sinh.trang_thai = dang_hoc và cập nhật ghi_danh khi batLai = true', async () => {
    const dongBatLai: KqHs & { batLai?: boolean } = {
      loai: 'hs', so: 2, trangThai: 'them_lop', ma_hs: 'HS001', ho_ten: 'Trần Khánh Linh', tenLop: 'Starters 1',
      ten_phu_huynh: null, sdt_phu_huynh: null, ngay_vao: '2026-11-15', don_gia: 100000,
      sticker_dau_ky: 0, ghi_chu: null, link_zalo: null, hocSinhId: 'h1', batLai: true,
    }
    const kq = await nhapDuLieu([], [dongBatLai], lopCo, () => {})
    expect(kq.lopThem).toBe(1)
    expect(state.ghiDanhInserts).toEqual([])
    expect(state.ghiDanhUpdates).toEqual([
      { hoc_sinh_id: 'h1', lop_id: 'l1', body: { trang_thai: 'dang_hoc', ngay_vao: '2026-11-15' } },
    ])
    expect(state.hocSinhUpdates).toContainEqual({ id: 'h1', body: { trang_thai: 'dang_hoc' } })
  })

  it('8e: them_lop thường (batLai = false) cũng bật lại hoc_sinh.trang_thai = dang_hoc', async () => {
    const dongThem: KqHs = {
      loai: 'hs', so: 2, trangThai: 'them_lop', ma_hs: 'HS001', ho_ten: 'Trần Khánh Linh', tenLop: 'Starters 1',
      ten_phu_huynh: null, sdt_phu_huynh: null, ngay_vao: '2026-11-15', don_gia: 100000,
      sticker_dau_ky: 0, ghi_chu: null, link_zalo: 'https://zalo.me/g/moi', hocSinhId: 'h1', capNhatLink: 'h1',
    }
    const kq = await nhapDuLieu([], [dongThem], lopCo, () => {})
    expect(kq.lopThem).toBe(1)
    expect(kq.linkMoi).toBe(1)
    expect(state.ghiDanhInserts).toEqual([{ hoc_sinh_id: 'h1', lop_id: 'l1', ngay_vao: '2026-11-15' }])
    expect(state.hocSinhUpdates).toContainEqual({ id: 'h1', body: { trang_thai: 'dang_hoc', link_zalo: 'https://zalo.me/g/moi' } })
  })
})
