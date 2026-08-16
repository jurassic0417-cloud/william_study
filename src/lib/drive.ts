/**
 * Google Drive 影片：把分享連結轉成可以直接播放的 preview 網址。
 * 網址填錯不會讓網站壞掉，只會顯示提示文字。
 */

const PATTERNS: RegExp[] = [
  /\/file\/d\/([a-zA-Z0-9_-]{10,})/, // https://drive.google.com/file/d/FILE_ID/view
  /[?&]id=([a-zA-Z0-9_-]{10,})/,     // https://drive.google.com/open?id=FILE_ID
  /\/d\/([a-zA-Z0-9_-]{10,})/,       // https://drive.google.com/d/FILE_ID
];

/** 從各種 Drive 網址中找出 FILE_ID，找不到就回傳 null */
export function parseDriveFileId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // 學生直接貼 FILE_ID 也接受
  if (/^[a-zA-Z0-9_-]{20,}$/.test(trimmed)) return trimmed;
  if (!trimmed.includes('drive.google.com')) return null;

  for (const pattern of PATTERNS) {
    const match = trimmed.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}

/** 可以放進 iframe 播放的網址 */
export function driveEmbedUrl(url: string): string | null {
  const id = parseDriveFileId(url);
  return id ? `https://drive.google.com/file/d/${id}/preview` : null;
}

export const DRIVE_ERROR_MESSAGE = '無法辨識 Google Drive 影片網址，請確認分享連結是否正確。';
