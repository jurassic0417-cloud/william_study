import { useState } from 'react';
import ImagePicker from './ImagePicker';
import DriveVideo from '../components/DriveVideo';
import { saveProject } from '../lib/store';
import { MAX_IMAGES_PER_PROJECT } from '../config';
import type { Project } from '../types';

interface Props {
  project: Project;
  onCancel: () => void;
  onSaved: () => Promise<void> | void;
}

export default function ProjectForm({ project, onCancel, onSaved }: Props) {
  const [form, setForm] = useState<Project>(project);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  function update<K extends keyof Project>(key: K, value: Project[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!form.title.trim()) {
      setMessage('請至少填寫作品名稱。');
      return;
    }
    setSaving(true);
    setMessage('');
    try {
      await saveProject(form);
      await onSaved();
    } catch (error) {
      console.error(error);
      setMessage('儲存失敗，請稍後再試。');
      setSaving(false);
    }
  }

  return (
    <section className="admin-card">
      <div className="admin-card-head">
        <h2>{project.id ? '編輯作品' : '新增作品'}</h2>
        <button className="btn btn-ghost" onClick={onCancel}>
          ← 回作品列表
        </button>
      </div>

      <div className="field">
        <label htmlFor="f-title">作品名稱</label>
        <input id="f-title" value={form.title} onChange={(e) => update('title', e.target.value)} />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="f-date">完成日期</label>
          <input id="f-date" placeholder="例如 2026-03" value={form.date} onChange={(e) => update('date', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="f-category">作品分類</label>
          <input id="f-category" placeholder="例如 AI、機器人" value={form.category} onChange={(e) => update('category', e.target.value)} />
        </div>
        <div className="field field-narrow">
          <label htmlFor="f-order">顯示順序</label>
          <input
            id="f-order"
            type="number"
            value={form.order}
            onChange={(e) => update('order', Number(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="f-summary">簡短介紹</label>
        <textarea id="f-summary" rows={2} value={form.summary} onChange={(e) => update('summary', e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="f-content">完整作品內容</label>
        <textarea id="f-content" rows={5} value={form.content} onChange={(e) => update('content', e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="f-challenge">製作過程遇到的問題</label>
        <textarea id="f-challenge" rows={3} value={form.challenge} onChange={(e) => update('challenge', e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="f-solution">我是如何解決問題</label>
        <textarea id="f-solution" rows={3} value={form.solution} onChange={(e) => update('solution', e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="f-reflection">學習心得與反思</label>
        <textarea id="f-reflection" rows={3} value={form.reflection} onChange={(e) => update('reflection', e.target.value)} />
      </div>

      <div className="field">
        <label>作品照片（最多 {MAX_IMAGES_PER_PROJECT} 張）</label>
        <ImagePicker
          label="作品照片"
          max={MAX_IMAGES_PER_PROJECT}
          imageIds={form.imageIds}
          onChange={(ids) => update('imageIds', ids)}
        />
      </div>

      <div className="field">
        <label htmlFor="f-video">Google Drive 影片連結</label>
        <input
          id="f-video"
          placeholder="https://drive.google.com/file/d/FILE_ID/view"
          value={form.videoUrl}
          onChange={(e) => update('videoUrl', e.target.value)}
        />
        {form.videoUrl && (
          <div className="video-preview">
            <DriveVideo url={form.videoUrl} />
          </div>
        )}
      </div>

      <div className="actions">
        <button className="btn btn-primary" disabled={saving} onClick={() => void handleSave()}>
          {saving ? '儲存中…' : '儲存作品'}
        </button>
        <button className="btn btn-ghost" onClick={onCancel}>
          取消
        </button>
        {message && <span className="hint hint-strong">{message}</span>}
      </div>
    </section>
  );
}
