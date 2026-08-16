import { DRIVE_ERROR_MESSAGE, driveEmbedUrl } from '../lib/drive';

/** Google Drive 影片播放器：網址錯誤時只顯示提示，不會讓整頁壞掉 */
export default function DriveVideo({ url }: { url: string }) {
  if (!url || !url.trim()) return null;

  const embed = driveEmbedUrl(url);
  if (!embed) {
    return <p className="inline-warning">{DRIVE_ERROR_MESSAGE}</p>;
  }

  return (
    <div className="video-frame">
      <iframe
        src={embed}
        title="作品影片"
        allow="autoplay; fullscreen"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
