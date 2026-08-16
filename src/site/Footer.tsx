export default function Footer({ name }: { name: string }) {
  return (
    <footer className="footer">
      <div className="container">
        <p>Designed by {name}</p>
        <p className="footer-sub">© {new Date().getFullYear()} {name}. 學習歷程網站</p>
      </div>
    </footer>
  );
}
