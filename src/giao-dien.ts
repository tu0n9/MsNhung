// Giao diện "Sổ vàng" (docs/YEU-CAU.md, mẫu docs/ban-mau/giao-dien.html): vàng kim theo logo, có bản sáng (mặc định)
// và bản tối. Màu dùng ngoài theme của Ant Design (nền dòng, chữ số tiền) lấy từ MAU để đổi một chỗ là đổi cả app.
import { createContext, useContext } from 'react'
import { theme as antTheme, type ThemeConfig } from 'antd'

export type CheDo = 'sang' | 'toi'

// chinh là màu nhấn (vàng); "tốt" (có mặt, đã đủ, tiền dương) dùng tot để không lẫn với màu nhấn.
// nut là nền nút chính; ở bản sáng chữ vàng phải đậm hơn nền nút mới đủ tương phản trên nền trắng.
export const BANG_MAU = {
  sang: {
    chinh: '#8A6410', chinhDam: '#F3E6C4', chinhNhat: '#F7EED7', nut: '#C9A13F',
    tot: '#1D7A4E', totNhat: '#E3F2EA', do: '#B4381F', doNhat: '#FBE8E3', vang: '#FBF1D9', vangDam: '#C9A13F',
    xanh: '#2557A6', xanhNhat: '#E4ECF8', xam: '#ECECE9',
    chu: '#1B1A17', chuPhu: '#57534B', chuMo: '#6F6A61', vien: '#E3E1DB', nen: '#F4F4F2', mat: '#FFFFFF', dau: '#FFFFFF',
  },
  toi: {
    chinh: '#D4AF5A', chinhDam: '#2A2418', chinhNhat: 'rgba(212,175,90,.12)', nut: '#D4AF5A',
    tot: '#8BD0A9', totNhat: 'rgba(139,208,169,.14)', do: '#EE8E78', doNhat: 'rgba(238,142,120,.14)',
    vang: 'rgba(212,175,90,.10)', vangDam: '#D4AF5A', xanh: '#96BBEE', xanhNhat: 'rgba(150,187,238,.14)', xam: '#2A2723',
    chu: '#F2EDE3', chuPhu: '#A79F90', chuMo: '#8A8273', vien: '#34302A', nen: '#121110', mat: '#1C1A17', dau: '#0A0908',
  },
}
type TenMau = keyof typeof BANG_MAU.sang

/** Màu cho style inline: biến CSS, tự đổi theo chế độ mà không phải vẽ lại từng trang. Không nối thêm chuỗi vào giá trị. */
export const MAU = Object.fromEntries(Object.keys(BANG_MAU.sang).map((k) => [k, `var(--${k})`])) as Record<TenMau, string>

/** Khai biến CSS của cả hai bảng; `data-che-do` trên <html> (hoặc một khung con) chọn bảng. */
export function cssBienMau(): string {
  const khoi = (m: Record<string, string>) => Object.entries(m).map(([k, v]) => `--${k}:${v}`).join(';')
  return `:root,[data-che-do=sang]{${khoi(BANG_MAU.sang)}}[data-che-do=toi]{${khoi(BANG_MAU.toi)}}`
}

/** Số lớn (tiền, giờ ca) và tên thương hiệu: gần nét chữ trong logo. */
export const CHU_SO = "'Playfair Display', Georgia, serif"

// token Ant Design cần hex thật (nó tự sinh sắc độ hover, nền nhạt), nên không dùng biến CSS ở đây
export function theme(cheDo: CheDo): ThemeConfig {
  const m = BANG_MAU[cheDo], toi = cheDo === 'toi'
  return {
    algorithm: toi ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
    token: {
      colorPrimary: m.nut, colorLink: m.chinh, colorInfo: m.nut, colorSuccess: m.tot, colorError: m.do,
      colorWarning: toi ? '#E5BF63' : '#9A6B00',
      colorText: m.chu, colorTextSecondary: m.chuPhu, colorTextTertiary: m.chuMo,
      colorBorder: toi ? '#3F3A32' : '#D6D3CB', colorBorderSecondary: m.vien,
      colorBgBase: toi ? m.nen : '#FFFFFF', colorBgLayout: m.nen, colorBgContainer: m.mat, colorBgElevated: toi ? '#24211D' : '#FFFFFF',
      fontFamily: "'Be Vietnam Pro', -apple-system, 'Segoe UI', Roboto, sans-serif",
      borderRadius: 10, borderRadiusLG: 14, borderRadiusSM: 6,
    },
    components: {
      // chữ trắng trên nút vàng không đủ tương phản: dùng chữ gần đen ở cả hai chế độ
      Button: { primaryColor: '#17120A' },
      Layout: { headerBg: m.dau, headerHeight: 56, headerPadding: '0 12px', bodyBg: m.nen },
      Menu: {
        darkItemBg: m.dau, darkItemSelectedBg: m.chinhDam, darkItemSelectedColor: m.chinh, darkPopupBg: m.dau,
        itemBg: m.dau, itemSelectedBg: m.chinhDam, itemSelectedColor: m.chinh, horizontalItemSelectedColor: m.chinh,
      },
      Card: { headerFontSize: 15 },
      Segmented: { itemSelectedBg: m.chinhDam, itemSelectedColor: m.chinh },
      Radio: { buttonSolidCheckedColor: '#17120A' },
    },
  }
}

export const CheDoCtx = createContext<{ cheDo: CheDo; doi: () => void }>({ cheDo: 'sang', doi: () => {} })
export const useCheDo = () => useContext(CheDoCtx)

/** Ô nhập tiền: số nguyên VND (precision 0), hiện dấu chấm nghìn. Dùng `{...O_TIEN}` cho mọi InputNumber tiền. */
export const O_TIEN = {
  min: 0, step: 50000, precision: 0, style: { width: '100%' },
  formatter: (s?: number | string) => `${s ?? ''}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
  parser: (s?: string) => Number(s?.replace(/\./g, '') || 0),
}
