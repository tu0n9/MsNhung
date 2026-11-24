// Giao diện "Sổ vàng" (docs/YEU-CAU.md, mẫu docs/ban-mau/giao-dien.html), nay hồng kim theo logo, có bản sáng (mặc định)
// và bản tối. Màu dùng ngoài theme của Ant Design (nền dòng, chữ số tiền) lấy từ MAU để đổi một chỗ là đổi cả app.
import { createContext, useContext, type MouseEvent } from 'react'
import { theme as antTheme, type ThemeConfig } from 'antd'

export type CheDo = 'sang' | 'toi'

// chinh là màu nhấn (hồng kim); "tốt" (có mặt, đã đủ, tiền dương) dùng tot để không lẫn với màu nhấn.
// nut là nền nút chính; ở bản sáng chữ hồng phải đậm hơn nền nút mới đủ tương phản trên nền trắng.
export const BANG_MAU = {
  // bản sáng kiểu "kính mờ": nền chuyển hồng sang tím hồng (giao-dien.css), thẻ và thanh trắng trong mờ, nút / tab đang
  // chọn hồng đậm chữ trắng. nen là màu đặc dùng cho chỗ cần che nội dung phía sau (thanh dính ở màn import)
  sang: {
    chinh: '#B8325C', chinhDam: '#F7D4DE', chinhNhat: '#FCE8EE', nut: '#D23C69',
    tot: '#1D7A4E', totNhat: '#E3F2EA', do: '#B4381F', doNhat: '#FBE8E3', vang: '#FBF1D9', vangDam: '#C9A13F',
    xanh: '#2557A6', xanhNhat: '#E4ECF8', xam: '#F3E6EB',
    chu: '#1D191A', chuPhu: '#584E53', chuMo: '#6E6368', vien: 'rgba(196,120,148,.22)', nen: '#FBEAF0',
    mat: 'rgba(255,255,255,.66)', dau: 'rgba(255,255,255,.6)', trinhDuyet: '#FBD5DF',
  },
  // nợ / vắng ở bản tối là cam: đỏ cam gần trùng hồng nhấn, dễ lẫn "nợ" với "nút"
  toi: {
    chinh: '#E8A4AE', chinhDam: '#2E1E22', chinhNhat: 'rgba(232,164,174,.12)', nut: '#E8A4AE',
    tot: '#8BD0A9', totNhat: 'rgba(139,208,169,.14)', do: '#F4A261', doNhat: 'rgba(244,162,97,.14)',
    vang: 'rgba(229,191,99,.10)', vangDam: '#E5BF63', xanh: '#96BBEE', xanhNhat: 'rgba(150,187,238,.14)', xam: '#2C2629',
    chu: '#F4ECEE', chuPhu: '#AC9EA3', chuMo: '#8E8086', vien: '#382F33', nen: '#141113', mat: '#1E1A1C', dau: '#0B090A',
    trinhDuyet: '#0B090A',
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
      colorBorder: toi ? '#433A3E' : '#E8CFD6', colorBorderSecondary: m.vien,
      colorBgBase: toi ? m.nen : '#FFFFFF', colorBgLayout: toi ? m.nen : 'rgba(255,255,255,.5)', colorBgContainer: m.mat, colorBgElevated: toi ? '#262024' : '#FFFFFF',
      fontFamily: "'Be Vietnam Pro', -apple-system, 'Segoe UI', Roboto, sans-serif",
      borderRadius: 12, borderRadiusLG: toi ? 14 : 22, borderRadiusSM: 8,
    },
    components: {
      // nút dạng viên thuốc; bản tối nút hồng nhạt nên chữ gần đen, bản sáng nút hồng đậm chữ trắng (~4.7:1)
      Button: { primaryColor: toi ? '#17120A' : '#FFFFFF', borderRadius: 999, borderRadiusLG: 999, borderRadiusSM: 999 },
      Layout: { headerBg: m.dau, headerHeight: 56, headerPadding: '0 12px', bodyBg: toi ? m.nen : 'transparent' },
      Menu: {
        darkItemBg: m.dau, darkItemSelectedBg: m.chinhDam, darkItemSelectedColor: m.chinh, darkPopupBg: m.dau,
        itemBg: m.dau, itemSelectedBg: m.chinhDam, itemSelectedColor: m.chinh, horizontalItemSelectedColor: m.chinh,
      },
      Card: { headerFontSize: 15 },
      Segmented: toi ? { itemSelectedBg: m.chinhDam, itemSelectedColor: m.chinh }
        : { itemSelectedBg: m.nut, itemSelectedColor: '#FFFFFF', trackBg: 'rgba(255,255,255,.55)', borderRadius: 999, borderRadiusSM: 999, borderRadiusXS: 999 },
      Radio: { buttonSolidCheckedColor: toi ? '#17120A' : '#FFFFFF' },
    },
  }
}

export const CheDoCtx = createContext<{ cheDo: CheDo; doi: (e?: MouseEvent) => void }>({ cheDo: 'sang', doi: () => {} })
export const useCheDo = () => useContext(CheDoCtx)

/** Ô nhập tiền: số nguyên VND (precision 0), tự thêm dấu phẩy mỗi 3 chữ số. Dùng `{...O_TIEN}` cho mọi InputNumber tiền. */
export const O_TIEN = {
  min: 0, step: 50000, precision: 0, style: { width: '100%' },
  formatter: (s?: number | string) => `${s ?? ''}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
  // xoá trắng ô phải ra trống (null), không ra 0: "Đơn giá riêng" trống = theo lớp, còn 0 = miễn phí
  // antd chấp nhận chuỗi (chuỗi rỗng → null) dù kiểu khai là number; chấp nhận cả dấu phẩy lẫn dấu chấm khi dán vào
  parser: (s?: string) => (s?.replace(/[.,\s]/g, '') ?? '') as unknown as number,
}
