/**
 * 圖片處理：在瀏覽器裡把圖片縮小、轉成 WebP，再存進 Firestore。
 * 這樣就不需要 Firebase Storage（不用付費方案）。
 */
import { MAX_IMAGE_BYTES, MAX_IMAGE_WIDTH } from '../config';

/** 讀成 dataURL */
function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('讀取圖片失敗'));
    reader.readAsDataURL(file);
  });
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('這個檔案不是可以顯示的圖片'));
    img.src = src;
  });
}

/** dataURL 實際佔用的位元組數（用來確認不會超過 Firestore 限制） */
export function dataUrlBytes(dataUrl: string): number {
  return new Blob([dataUrl]).size;
}

export interface CompressResult {
  ok: boolean;
  dataUrl?: string;
  bytes?: number;
  message?: string;
}

/**
 * 壓縮流程：
 * 1. 等比例縮到最大寬度 1200px
 * 2. 轉成 WebP
 * 3. 逐步降低品質，直到小於 420KB
 * 4. 還是太大就回報錯誤，不寫進 Firestore
 */
export async function compressImage(file: File): Promise<CompressResult> {
  try {
    if (!file.type.startsWith('image/')) {
      return { ok: false, message: '請選擇圖片檔案（jpg、png、webp）。' };
    }

    const original = await readAsDataUrl(file);
    const img = await loadImageElement(original);

    const scale = Math.min(1, MAX_IMAGE_WIDTH / (img.naturalWidth || MAX_IMAGE_WIDTH));
    const width = Math.max(1, Math.round((img.naturalWidth || MAX_IMAGE_WIDTH) * scale));
    const height = Math.max(1, Math.round((img.naturalHeight || MAX_IMAGE_WIDTH) * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return { ok: false, message: '這台裝置無法處理圖片，請換一張圖或換裝置試試。' };
    ctx.drawImage(img, 0, 0, width, height);

    const qualities = [0.82, 0.72, 0.62, 0.52, 0.42, 0.32];
    for (const quality of qualities) {
      const dataUrl = canvas.toDataURL('image/webp', quality);
      const bytes = dataUrlBytes(dataUrl);
      if (bytes <= MAX_IMAGE_BYTES) {
        return { ok: true, dataUrl, bytes };
      }
    }

    return { ok: false, message: '圖片檔案太大，請選擇較小的圖片。' };
  } catch (error) {
    console.error(error);
    return { ok: false, message: '圖片處理失敗，請換一張圖片試試。' };
  }
}

/** 顯示成好懂的大小，例如 138 KB */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${Math.round(bytes / 1024)} KB`;
}
