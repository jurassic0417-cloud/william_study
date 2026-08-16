import { useRef, useState } from 'react';
import StoredImage from '../components/StoredImage';
import { compressImage, formatBytes } from '../lib/image';
import { deleteImage, saveImage } from '../lib/store';

interface Props {
  imageIds: string[];
  max: number;
  onChange: (ids: string[]) => void;
  label?: string;
}

/** 選圖 → 自動壓縮 → 預覽 → 存進資料庫（不使用 Firebase Storage） */
export default function ImagePicker({ imageIds, max, onChange, label = '照片' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (inputRef.current) inputRef.current.value = '';
    if (!file) return;

    if (imageIds.length >= max) {
      setMessage(`最多只能放 ${max} 張${label}。`);
      return;
    }

    setBusy(true);
    setMessage('圖片處理中…');
    try {
      const result = await compressImage(file);
      if (!result.ok || !result.dataUrl) {
        setMessage(result.message ?? '圖片檔案太大，請選擇較小的圖片。');
        return;
      }
      const id = await saveImage(result.dataUrl);
      onChange([...imageIds, id]);
      setMessage(`已加入（壓縮後 ${formatBytes(result.bytes ?? 0)}）`);
    } catch (error) {
      console.error(error);
      setMessage('圖片儲存失敗，請稍後再試。');
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove(id: string) {
    onChange(imageIds.filter((x) => x !== id));
    try {
      await deleteImage(id);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="image-picker">
      <div className="image-picker-grid">
        {imageIds.map((id) => (
          <div key={id} className="image-picker-item">
            <StoredImage imageId={id} alt={label} className="image-picker-preview" />
            <button type="button" className="btn btn-small btn-danger" onClick={() => void handleRemove(id)}>
              刪除
            </button>
          </div>
        ))}

        {imageIds.length < max && (
          <label className="image-picker-add">
            <input ref={inputRef} type="file" accept="image/*" onChange={(e) => void handleFile(e)} disabled={busy} />
            <span>{busy ? '處理中…' : `＋ 加入${label}`}</span>
          </label>
        )}
      </div>

      <p className="hint">
        會自動縮小到寬度 1200px、轉成 WebP，控制在 400KB 以內。目前 {imageIds.length} / {max} 張。
      </p>
      {message && <p className="hint hint-strong">{message}</p>}
    </div>
  );
}
