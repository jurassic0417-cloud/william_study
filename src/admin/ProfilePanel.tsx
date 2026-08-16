import { useState } from 'react';
import ImagePicker from './ImagePicker';
import { saveProfile } from '../lib/store';
import type { Profile } from '../types';

interface Props {
  profile: Profile;
  onSaved: () => Promise<void> | void;
}

export default function ProfilePanel({ profile, onSaved }: Props) {
  const [form, setForm] = useState<Profile>(profile);
  const [interestsText, setInterestsText] = useState(profile.interests.join('、'));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');
    try {
      const interests = interestsText
        .split(/[、,，\n]/)
        .map((s) => s.trim())
        .filter(Boolean);
      await saveProfile({ ...form, interests });
      await onSaved();
      setMessage('已儲存！回到首頁就能看到更新。');
    } catch (error) {
      console.error(error);
      setMessage('儲存失敗，請稍後再試。');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="admin-card">
      <h2>基本資料</h2>

      <div className="field">
        <label htmlFor="p-name">姓名</label>
        <input id="p-name" value={form.name} onChange={(e) => update('name', e.target.value)} />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="p-school">學校</label>
          <input id="p-school" value={form.school} onChange={(e) => update('school', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="p-grade">年級</label>
          <input id="p-grade" value={form.grade} onChange={(e) => update('grade', e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="p-tagline">一句自我介紹</label>
        <input id="p-tagline" value={form.tagline} onChange={(e) => update('tagline', e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="p-interests">興趣（用「、」分開）</label>
        <input id="p-interests" value={interestsText} onChange={(e) => setInterestsText(e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="p-intro">關於我</label>
        <textarea id="p-intro" rows={5} value={form.intro} onChange={(e) => update('intro', e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="p-direction">學習方向</label>
        <textarea id="p-direction" rows={3} value={form.direction} onChange={(e) => update('direction', e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="p-learning">目前正在學習的內容</label>
        <textarea id="p-learning" rows={3} value={form.learning} onChange={(e) => update('learning', e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="p-future">未來想挑戰的事情</label>
        <textarea id="p-future" rows={3} value={form.future} onChange={(e) => update('future', e.target.value)} />
      </div>

      <div className="field">
        <label>個人照片（最多 1 張）</label>
        <ImagePicker
          label="個人照片"
          max={1}
          imageIds={form.photoId ? [form.photoId] : []}
          onChange={(ids) => update('photoId', ids[0] ?? null)}
        />
      </div>

      <div className="actions">
        <button className="btn btn-primary" disabled={saving} onClick={() => void handleSave()}>
          {saving ? '儲存中…' : '儲存'}
        </button>
        {message && <span className="hint hint-strong">{message}</span>}
      </div>
    </section>
  );
}
