import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { App as AntApp, ConfigProvider } from 'antd'
import viVN from 'antd/locale/vi_VN'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import { registerSW } from 'virtual:pwa-register'
import '@fontsource/be-vietnam-pro/400.css'
import '@fontsource/be-vietnam-pro/500.css'
import '@fontsource/be-vietnam-pro/600.css'
import '@fontsource/be-vietnam-pro/700.css'
import '@fontsource/playfair-display/700.css'
import './giao-dien.css'
import './ux-giao-dien.css'
import { useEffect, useState, type MouseEvent } from 'react'
import { flushSync } from 'react-dom'
import { BANG_MAU, CheDoCtx, cssBienMau, theme, type CheDo } from './giao-dien'
import App from './App'

dayjs.locale('vi')

const bien = document.createElement('style')
bien.textContent = cssBienMau()
document.head.append(bien)

// chế độ sáng / tối lưu theo từng máy; trình duyệt chặn lưu (ẩn danh, chặn dữ liệu) thì vẫn chạy với mặc định sáng
const KHOA = 'msnhung-che-do'
const docCheDo = (): CheDo => { try { return localStorage.getItem(KHOA) === 'toi' ? 'toi' : 'sang' } catch { return 'sang' } }

function Goc() {
  const [cheDo, setCheDo] = useState(docCheDo)
  useEffect(() => {
    document.documentElement.dataset.cheDo = cheDo
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', BANG_MAU[cheDo].trinhDuyet)
    try { localStorage.setItem(KHOA, cheDo) } catch { /* không lưu được thì lần sau về mặc định */ }
  }, [cheDo])

  // #219: hiệu ứng lan tròn từ tâm nút chuyển sáng / tối (View Transition API)
  const doi = (e?: MouseEvent) => {
    const tiep: CheDo = cheDo === 'toi' ? 'sang' : 'toi'
    const giamDong = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const startVT = (document as unknown as {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> }
    }).startViewTransition
    if (giamDong || typeof startVT !== 'function') {
      setCheDo(tiep)
      return
    }
    const rect = (e?.currentTarget as HTMLElement | undefined)?.getBoundingClientRect?.()
    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth - 36
    const cy = rect ? rect.top + rect.height / 2 : 28
    const banKinh = Math.hypot(Math.max(cx, window.innerWidth - cx), Math.max(cy, window.innerHeight - cy))
    const vt = startVT.call(document, () => {
      document.documentElement.dataset.cheDo = tiep
      flushSync(() => setCheDo(tiep))
    })
    vt.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${cx}px ${cy}px)`, `circle(${banKinh}px at ${cx}px ${cy}px)`] },
        { duration: 640, easing: 'cubic-bezier(.65,0,.35,1)', pseudoElement: '::view-transition-new(root)' },
      )
    }).catch(() => {})
  }

  return (
    <CheDoCtx.Provider value={{ cheDo, doi }}>
      <ConfigProvider locale={viVN} theme={theme(cheDo)}>
        <AntApp>
          {/* HashRouter: host tĩnh nào cũng chạy, không cần cấu hình rewrite */}
          <HashRouter>
            <App />
          </HashRouter>
        </AntApp>
      </ConfigProvider>
    </CheDoCtx.Provider>
  )
}

createRoot(document.getElementById('root')!).render(<Goc />)

// Tự động tải lại bản PWA mới ngay khi Service Worker kích hoạt bản cập nhật:
// chờ đóng hộp thoại/ngăn kéo (nếu cô đang nhập form dở) để không mất dữ liệu đang gõ.
if ('serviceWorker' in navigator) {
  let dangTaiLai = false
  let dangCho = false
  const dangMoHopThoai = () =>
    Array.from(document.querySelectorAll('.ant-modal-wrap, .ant-drawer-open'))
      .some((el) => getComputedStyle(el).display !== 'none')

  const taiLaiKhiRanh = () => {
    if (dangTaiLai) return
    if (!dangMoHopThoai()) {
      dangTaiLai = true
      window.location.reload()
      return
    }
    if (dangCho) return
    dangCho = true
    const kiemTra = () => {
      if (dangTaiLai || dangMoHopThoai()) return
      dangTaiLai = true
      obs.disconnect()
      window.clearInterval(timer)
      window.location.reload()
    }
    const obs = new MutationObserver(kiemTra)
    obs.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] })
    const timer = window.setInterval(kiemTra, 1500)
  }

  registerSW({
    immediate: true,
    onNeedReload: taiLaiKhiRanh,
    onRegisteredSW(_swUrl, r) {
      if (!r) return
      let lanCuoi = Date.now()
      const kiemTraCapNhat = () => {
        if (document.visibilityState === 'hidden' || Date.now() - lanCuoi < 60_000) return
        lanCuoi = Date.now()
        r.update().catch(() => {})
      }
      document.addEventListener('visibilitychange', kiemTraCapNhat)
      window.addEventListener('online', kiemTraCapNhat)
    },
  })
}
