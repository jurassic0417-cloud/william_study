import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 這是最單純的 Vite 設定：只有 React + SPA。
// 不需要 Express、不需要自訂 server.js，Google AI Studio 直接就能 Build / Publish。
export default defineConfig({
  plugins: [react()],
  // appType: 'spa' 會讓 dev 與 preview 自動把 /admin 這種網址 fallback 回 index.html
  appType: 'spa',
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
  },
  build: {
    outDir: 'dist',
    target: 'es2020',
    sourcemap: false,
    // Firebase SDK 本身就有幾百 KB，這是正常的，把提醒門檻調高避免誤會
    chunkSizeWarningLimit: 1200,
  },
});
