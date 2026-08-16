export default function Loading({ text = '載入中…' }: { text?: string }) {
  return (
    <div className="center-screen">
      <div className="loading">
        <span className="loading-dot" />
        <span className="loading-dot" />
        <span className="loading-dot" />
        <p>{text}</p>
      </div>
    </div>
  );
}
