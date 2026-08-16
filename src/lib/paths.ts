/**
 * 網站放在網址的哪一層。
 *
 * 一般部署（本機、Google AI Studio）是根目錄 '/'，
 * GitHub Pages 則是 '/william_study/'。
 * 用 Vite 提供的 BASE_URL 就不用自己猜，連結永遠指得對。
 */
const BASE = import.meta.env.BASE_URL || '/';

/** 首頁網址 */
export const HOME_URL = BASE;

/** 後台網址 */
export const ADMIN_URL = `${BASE.replace(/\/$/, '')}/admin`;
