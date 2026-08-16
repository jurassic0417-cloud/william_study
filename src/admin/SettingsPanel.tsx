import { useState } from 'react';
import { saveSettings } from '../lib/store';
import { ADMIN_EMAIL } from '../config';
import type { Settings } from '../types';

const PRESETS = [
  { name: '沉靜藍', value: '#3D6B8C' },
  { name: '森林綠', value: '#4A7C6F' },
  { name: '暖陶土', value: '#B4705A' },
  { name: '薰衣草紫', value: '#6E6193' },
  { name: '墨黑', value: '#37404A' },
];

export default function SettingsPanel({ settings, onSaved }: { settings: Settings; onSaved: () => Promise<void> | void }) {
  const [accent, setAccent] = useState(settings.accent);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSave() {
    setSaving(true);
    setMessage('');
    try {
      await saveSettings({ accent });
      document.documentElement.style.setProperty('--accent', accent);
      await onSaved();
      setMessage('已儲存！');
    } catch (error) {
      console.error(error);
      setMessage('儲存失敗，請稍後再試。');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="admin-card">
      <h2>網站設定</h2>

      <div className="field">
        <label>主色</label>
        <div className="color-presets">
          {PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              className={`color-chip ${accent === preset.value ? 'is-active' : ''}`}
              style={{ background: preset.value }}
              onClick={() => setAccent(preset.value)}
              title={preset.name}
              aria-label={preset.name}
            />
          ))}
          <input
            className="color-input"
            type="color"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
            aria-label="自訂顏色"
          />
        </div>
      </div>

      <div className="actions">
        <button className="btn btn-primary" disabled={saving} onClick={() => void handleSave()}>
          {saving ? '儲存中…' : '儲存'}
        </button>
        {message && <span className="hint hint-strong">{message}</span>}
      </div>

      <hr className="divider" />

      <h3>管理員帳號</h3>
      <p className="hint">
        目前設定的管理員是 <strong>{ADMIN_EMAIL}</strong>。
        要更換的話，請修改 <code>src/config.ts</code> 的 ADMIN_EMAIL，並同步更新 <code>firestore.rules</code>。
      </p>
    </section>
  );
}
