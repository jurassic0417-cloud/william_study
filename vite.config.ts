import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 這是最單純的 Vite 設定：只有 React + SPA。
// 不需要 Express、不需要自訂 server.js，Google AI Studio 直接就能 Build / Publish。
//
// 關於 base（網站放在網址的哪一層）：
//   一般情況（本機、Google AI Studio）網站在網域根目錄       → '/'
//   GitHub Pages 會放在 https://帳號.github.io/william_study/ → '/william_study/'
// 所以 GitHub Pages 用 `npm run build:ghpages` 打包，其他情況用 `npm run build`。
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // appType: 'spa' 會讓 dev 與 preview 自動把 /admin 這種網址 fallback 回 index.html
  appType: 'spa',
  base: mode === 'ghpages' ? '/william_study/' : '/',
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
}));
