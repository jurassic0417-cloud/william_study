import { useEffect, useState } from 'react';
import { loadImage } from '../lib/store';

interface Props {
  imageId?: string | null;
  fallbackUrl?: string;
  alt: string;
  className?: string;
}

/** 顯示存在資料庫裡的圖片；還沒載入好時顯示柔和的佔位色塊 */
export default function StoredImage({ imageId, fallbackUrl, alt, className }: Props) {
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setSrc(null);
    setFailed(false);

    if (!imageId) {
      setSrc(fallbackUrl ?? null);
      return;
    }

    loadImage(imageId)
      .then((value) => {
        if (!active) return;
        setSrc(value ?? fallbackUrl ?? null);
      })
      .catch(() => {
        if (!active) return;
        setFailed(true);
        setSrc(fallbackUrl ?? null);
      });

    return () => {
      active = false;
    };
  }, [imageId, fallbackUrl]);

  if (!src) {
    // 有 imageId 代表正在載入（顯示流動動畫）；沒有就是還沒放照片（顯示靜態底色）
    const state = imageId && !failed ? 'is-loading' : 'is-empty';
    return <div className={`image-placeholder ${state} ${className ?? ''}`} aria-label={failed ? '圖片載入失敗' : alt} />;
  }

  return <img className={className} src={src} alt={alt} loading="lazy" />;
}
