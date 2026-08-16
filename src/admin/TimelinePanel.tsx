import { useState } from 'react';
import { deleteTimelineItem, saveTimelineItem } from '../lib/store';
import type { TimelineItem } from '../types';

interface Props {
  items: TimelineItem[];
  isSample: boolean;
  onSaved: () => Promise<void> | void;
}

export default function TimelinePanel({ items, isSample, onSaved }: Props) {
  const [draft, setDraft] = useState({ year: '', title: '', description: '' });
  const [editing, setEditing] = useState<TimelineItem | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const nextOrder = items.length ? Math.max(...items.map((i) => i.order)) + 1 : 1;

  async function handleAdd() {
    if (!draft.year.trim() || !draft.title.trim()) {
      setMessage('請填寫年份與事件名稱。');
      return;
    }
    setBusy(true);
    setMessage('');
    try {
      await saveTimelineItem({ id: '', order: nextOrder, ...draft });
      setDraft({ year: '', title: '', description: '' });
      await onSaved();
      setMessage('已新增。');
    } catch (error) {
      console.error(error);
      setMessage('儲存失敗，請稍後再試。');
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdate() {
    if (!editing) return;
    setBusy(true);
    try {
      await saveTimelineItem(editing);
      setEditing(null);
      await onSaved();
      setMessage('已更新。');
    } catch (error) {
      console.error(error);
      setMessage('儲存失敗，請稍後再試。');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(item: TimelineItem) {
    if (!window.confirm(`確定要刪除「${item.title}」嗎？`)) return;
    setBusy(true);
    try {
      await deleteTimelineItem(item.id);
      await onSaved();
      setMessage('已刪除。');
    } catch (error) {
      console.error(error);
      setMessage('刪除失敗，請稍後再試。');
    } finally {
      setBusy(false);
    }
  }

  async function move(item: TimelineItem, direction: -1 | 1) {
    const sorted = [...items].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((x) => x.id === item.id);
    const target = sorted[index + direction];
    if (!target) return;
    setBusy(true);
    try {
      await saveTimelineItem({ ...item, order: target.order });
      await saveTimelineItem({ ...target, order: item.order });
      await onSaved();
    } catch (error) {
      console.error(error);
      setMessage('調整順序失敗，請稍後再試。');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="admin-card">
      <h2>學習歷程</h2>
      {isSample && <p className="hint">下面是示範內容，新增一筆之後就會變成你自己的資料。</p>}
      {message && <p className="hint hint-strong">{message}</p>}

      <div className="field-row">
        <div className="field field-narrow">
          <label htmlFor="t-year">年份</label>
          <input id="t-year" placeholder="2026" value={draft.year} onChange={(e) => setDraft({ ...draft, year: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="t-title">事件名稱</label>
          <input id="t-title" placeholder="第一次完成專題" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="t-desc">說明</label>
        <textarea id="t-desc" rows={2} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
      </div>
      <div className="actions">
        <button className="btn btn-primary" disabled={busy} onClick={() => void handleAdd()}>
          ＋ 新增一筆
        </button>
      </div>

      <ul className="admin-list">
        {items.map((item, index) => (
          <li key={item.id} className="admin-list-item">
            {editing?.id === item.id ? (
              <div className="admin-list-edit">
                <input value={editing.year} onChange={(e) => setEditing({ ...editing, year: e.target.value })} />
                <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                <textarea
                  rows={2}
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
                <div className="admin-list-actions">
                  <button className="btn btn-small btn-primary" disabled={busy} onClick={() => void handleUpdate()}>
                    儲存
                  </button>
                  <button className="btn btn-small" onClick={() => setEditing(null)}>
                    取消
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="admin-list-main">
                  <strong>
                    {item.year}　{item.title}
                  </strong>
                  <span className="admin-list-sub">{item.description}</span>
                </div>
                <div className="admin-list-actions">
                  <button className="btn btn-small" disabled={busy || index === 0} onClick={() => void move(item, -1)}>
                    ↑
                  </button>
                  <button
                    className="btn btn-small"
                    disabled={busy || index === items.length - 1}
                    onClick={() => void move(item, 1)}
                  >
                    ↓
                  </button>
                  <button className="btn btn-small" onClick={() => setEditing(item)}>
                    編輯
                  </button>
                  {!isSample && (
                    <button className="btn btn-small btn-danger" disabled={busy} onClick={() => void handleDelete(item)}>
                      刪除
                    </button>
                  )}
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
