/** 上方導覽列（公開網站專用，沒有任何後台連結） */
const LINKS = [
  { href: '#about', label: '關於我' },
  { href: '#projects', label: '我的作品' },
  { href: '#timeline', label: '學習歷程' },
  { href: '#skills', label: '我的技能' },
];

export default function NavBar({ name }: { name: string }) {
  return (
    <header className="nav">
      <div className="nav-inner">
        <a className="nav-logo" href="#top">
          {name}
        </a>
        <nav className="nav-links" aria-label="網站區塊">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
