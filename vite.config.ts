import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const CESIUM_BASE = resolve(__dirname, 'node_modules/cesium/Build/Cesium')

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // 构建时复制 cesium 静态资源到 dist/cesium
    viteStaticCopy({
      targets: [
        { src: `${CESIUM_BASE}/Workers/**`, dest: 'cesium/Workers' },
        { src: `${CESIUM_BASE}/ThirdParty/**`, dest: 'cesium/ThirdParty' },
        { src: `${CESIUM_BASE}/Assets/**`, dest: 'cesium/Assets' },
        { src: `${CESIUM_BASE}/Widgets/**`, dest: 'cesium/Widgets' },
      ],
    }),
  ],
  define: {
    CESIUM_BASE_URL: JSON.stringify('/cesium'),
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    fs: {
      // 允许 dev server 直接访问 node_modules/cesium 的静态文件
      allow: ['..'],
    },
  },
})
