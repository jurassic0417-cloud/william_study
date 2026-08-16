import type { TimelineItem } from '../types';

export default function TimelineSection({ items }: { items: TimelineItem[] }) {
  return (
    <section className="section" id="timeline">
      <div className="container">
        <p className="section-eyebrow">TIMELINE</p>
        <h2 className="section-title">學習歷程</h2>

        {items.length === 0 ? (
          <p className="empty-text">還沒有紀錄，之後會把重要的學習事件加上來。</p>
        ) : (
          <ol className="timeline">
            {items.map((item) => (
              <li key={item.id} className="timeline-item">
                <div className="timeline-dot" aria-hidden="true" />
                <div className="timeline-body">
                  <span className="timeline-year">{item.year}</span>
                  <h3 className="timeline-title">{item.title}</h3>
                  {item.description && <p className="timeline-desc">{item.description}</p>}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
