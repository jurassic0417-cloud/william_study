import { useState } from 'react';
import ProjectForm from './ProjectForm';
import { deleteProject, saveProject } from '../lib/store';
import type { Project } from '../types';

interface Props {
  projects: Project[];
  isSample: boolean;
  onSaved: () => Promise<void> | void;
}

function emptyProject(order: number): Project {
  return {
    id: '',
    title: '',
    date: '',
    category: '',
    summary: '',
    content: '',
    challenge: '',
    solution: '',
    reflection: '',
    imageIds: [],
    videoUrl: '',
    order,
  };
}

export default function ProjectsPanel({ projects, isSample, onSaved }: Props) {
  const [editing, setEditing] = useState<Project | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleDelete(project: Project) {
    if (!window.confirm(`確定要刪除這個作品嗎？\n\n「${project.title}」刪除後無法復原。`)) return;
    setBusy(true);
    setMessage('');
    try {
      await deleteProject(project.id);
      await onSaved();
      setMessage('已刪除。');
    } catch (error) {
      console.error(error);
      setMessage('刪除失敗，請稍後再試。');
    } finally {
      setBusy(false);
    }
  }

  async function move(project: Project, direction: -1 | 1) {
    const sorted = [...projects].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((p) => p.id === project.id);
    const target = sorted[index + direction];
    if (!target) return;

    setBusy(true);
    try {
      await saveProject({ ...project, order: target.order });
      await saveProject({ ...target, order: project.order });
      await onSaved();
    } catch (error) {
      console.error(error);
      setMessage('調整順序失敗，請稍後再試。');
    } finally {
      setBusy(false);
    }
  }

  if (editing) {
    return (
      <ProjectForm
        project={editing}
        onCancel={() => setEditing(null)}
        onSaved={async () => {
          setEditing(null);
          await onSaved();
          setMessage('作品已儲存。');
        }}
      />
    );
  }

  const nextOrder = projects.length ? Math.max(...projects.map((p) => p.order)) + 1 : 1;

  return (
    <section className="admin-card">
      <div className="admin-card-head">
        <h2>作品管理</h2>
        <button className="btn btn-primary" onClick={() => setEditing(emptyProject(nextOrder))}>
          ＋ 新增作品
        </button>
      </div>

      {isSample && (
        <p className="hint">
          下面是示範作品（還沒存進資料庫）。你可以直接按「新增作品」建立自己的作品。
        </p>
      )}
      {message && <p className="hint hint-strong">{message}</p>}

      {projects.length === 0 ? (
        <p className="empty-text">還沒有作品，按「新增作品」開始吧。</p>
      ) : (
        <ul className="admin-list">
          {projects.map((project, index) => (
            <li key={project.id} className="admin-list-item">
              <div className="admin-list-main">
                <strong>{project.title || '（未命名作品）'}</strong>
                <span className="admin-list-sub">
                  {project.category} {project.date && `· ${project.date}`} · 順序 {project.order}
                </span>
              </div>
              <div className="admin-list-actions">
                <button className="btn btn-small" disabled={busy || index === 0} onClick={() => void move(project, -1)}>
                  ↑
                </button>
                <button
                  className="btn btn-small"
                  disabled={busy || index === projects.length - 1}
                  onClick={() => void move(project, 1)}
                >
                  ↓
                </button>
                <button className="btn btn-small" onClick={() => setEditing(project)}>
                  編輯
                </button>
                {!isSample && (
                  <button className="btn btn-small btn-danger" disabled={busy} onClick={() => void handleDelete(project)}>
                    刪除
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
