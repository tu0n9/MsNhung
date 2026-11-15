import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { App as AntApp, ConfigProvider } from 'antd'
import viVN from 'antd/locale/vi_VN'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import App from './App'

dayjs.locale('vi')

// HashRouter: host tĩnh nào cũng chạy, không cần cấu hình rewrite
createRoot(document.getElementById('root')!).render(
  <ConfigProvider locale={viVN} theme={{ token: { colorPrimary: '#d4380d' } }}>
    <AntApp>
      <HashRouter>
        <App />
      </HashRouter>
    </AntApp>
  </ConfigProvider>,
)
