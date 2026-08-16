import { useState } from 'react';
import { deleteSkill, saveSkill } from '../lib/store';
import type { Skill } from '../types';

interface Props {
  skills: Skill[];
  isSample: boolean;
  onSaved: () => Promise<void> | void;
}

export default function SkillsPanel({ skills, isSample, onSaved }: Props) {
  const [name, setName] = useState('');
  const [editing, setEditing] = useState<Skill | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const nextOrder = skills.length ? Math.max(...skills.map((s) => s.order)) + 1 : 1;

  async function handleAdd() {
    if (!name.trim()) return;
    setBusy(true);
    setMessage('');
    try {
      await saveSkill({ id: '', name: name.trim(), order: nextOrder });
      setName('');
      await onSaved();
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
      await saveSkill(editing);
      setEditing(null);
      await onSaved();
    } catch (error) {
      console.error(error);
      setMessage('儲存失敗，請稍後再試。');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(skill: Skill) {
    if (!window.confirm(`確定要刪除「${skill.name}」嗎？`)) return;
    setBusy(true);
    try {
      await deleteSkill(skill.id);
      await onSaved();
    } catch (error) {
      console.error(error);
      setMessage('刪除失敗，請稍後再試。');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="admin-card">
      <h2>我的技能</h2>
      <p className="hint">用簡單的標籤呈現就好，不需要寫百分比。</p>
      {isSample && <p className="hint">下面是示範技能，新增一個之後就會換成你自己的。</p>}
      {message && <p className="hint hint-strong">{message}</p>}

      <div className="field-row">
        <div className="field">
          <label htmlFor="s-name">技能名稱</label>
          <input
            id="s-name"
            value={name}
            placeholder="例如：程式設計"
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void handleAdd();
            }}
          />
        </div>
        <div className="field field-btn">
          <button className="btn btn-primary" disabled={busy} onClick={() => void handleAdd()}>
            ＋ 新增
          </button>
        </div>
      </div>

      <ul className="admin-list">
        {skills.map((skill) => (
          <li key={skill.id} className="admin-list-item">
            {editing?.id === skill.id ? (
              <div className="admin-list-edit">
                <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
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
                  <strong>{skill.name}</strong>
                </div>
                <div className="admin-list-actions">
                  <button className="btn btn-small" onClick={() => setEditing(skill)}>
                    編輯
                  </button>
                  {!isSample && (
                    <button className="btn btn-small btn-danger" disabled={busy} onClick={() => void handleDelete(skill)}>
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
