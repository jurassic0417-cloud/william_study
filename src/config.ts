/**
 * 全站基本設定：這是你「最常需要改」的檔案。
 * 改完存檔，畫面就會跟著變。
 */

// 只有這個 Google 帳號可以進入 /admin 修改資料。
// 注意：真正的保護寫在 firestore.rules，這裡只是前端的第一道關卡。
export const ADMIN_EMAIL = 'jurassic0417@gmail.com';

// 網站預設主色（之後也可以在 /admin 的「網站設定」直接換色）
export const DEFAULT_ACCENT = '#3D6B8C';

// 一張圖片壓縮後允許的最大體積（存進 Firestore 的字串大小）
// Firestore 單一文件上限是 1MB，這裡抓 420KB，非常安全。
export const MAX_IMAGE_BYTES = 420 * 1024;

// 圖片壓縮後的最大寬度
export const MAX_IMAGE_WIDTH = 1200;

// 每個作品最多幾張照片
export const MAX_IMAGES_PER_PROJECT = 3;
