import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Anh ngữ Ms.Nhung',
        short_name: 'Ms.Nhung',
        lang: 'vi',
        theme_color: '#0B090A',
        background_color: '#0B090A',
        display: 'standalone',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      // exceljs nặng, không cache sẵn cho lần mở đầu. Video hướng dẫn (public/huong-dan, ~11 MB) không cache sẵn và không
      // bị service worker đổi thành index.html khi mở thẳng link mp4.
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, globPatterns: ['**/*.{js,css,html,png,woff2}'],
        navigateFallbackDenylist: [/^\/huong-dan\//],
      },
    }),
  ],
  test: { include: ['src/**/*.test.ts'] },
})
