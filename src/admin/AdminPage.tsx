import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSiteData } from '../hooks/useSiteData';
import Loading from '../components/Loading';
import ProfilePanel from './ProfilePanel';
import ProjectsPanel from './ProjectsPanel';
import TimelinePanel from './TimelinePanel';
import SkillsPanel from './SkillsPanel';
import SettingsPanel from './SettingsPanel';
import { ADMIN_EMAIL } from '../config';
import { backend, copySampleDataToDatabase } from '../lib/store';

type Tab = 'profile' | 'projects' | 'timeline' | 'skills' | 'settings';

const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'profile', label: '基本資料' },
  { id: 'projects', label: '作品管理' },
  { id: 'timeline', label: '學習歷程' },
  { id: 'skills', label: '技能' },
  { id: 'settings', label: '網站設定' },
];

export default function AdminPage() {
  const auth = useAuth();
  const { data, loading, error, reload } = useSiteData();
  const [tab, setTab] = useState<Tab>('profile');
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');

  // 沒設定 Firebase 時，用「本機示範模式」讓你先練習操作
  const localMode = backend === 'local';
  const canEdit = localMode || auth.isAdmin;

  if (auth.loading || loading) return <Loading text="正在確認登入狀態…" />;

  if (!localMode && !auth.user) {
    return (
      <div className="center-screen">
        <div className="notice-card">
          <h2>管理後台</h2>
          <p>請使用管理員的 Google 帳號登入。</p>
          <button className="btn btn-primary" onClick={() => void auth.login()}>
            使用 Google 登入
          </button>
          {auth.error && <p className="error-text">{auth.error}</p>}
          <a className="link-back" href="/">
            ← 回到網站首頁
          </a>
        </div>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="center-screen">
        <div className="notice-card">
          <h2>此帳號沒有網站管理權限。</h2>
          <p>
            目前登入：{auth.user?.email}
            <br />
            請改用管理員帳號（{ADMIN_EMAIL}）登入。
          </p>
          <button className="btn" onClick={() => void auth.logout()}>
            登出
          </button>
          <a className="link-back" href="/">
            ← 回到網站首頁
          </a>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="center-screen">
        <div className="notice-card">
          <h2>資料暫時無法載入</h2>
          <p>{error || '請稍後重新整理。'}</p>
          <button className="btn" onClick={() => void reload()}>
            重新載入
          </button>
        </div>
      </div>
    );
  }

  const stillSample =
    data.usingSample.profile || data.usingSample.projects || data.usingSample.timeline || data.usingSample.skills;

  async function handleCopySample() {
    setSeeding(true);
    setSeedMessage('');
    try {
      await copySampleDataToDatabase();
      await reload();
      setSeedMessage('示範資料已經複製好了，現在可以直接編輯。');
    } catch (e) {
      console.error(e);
      setSeedMessage('複製失敗，請稍後再試。');
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="admin-header-inner">
          <div>
            <h1>管理後台</h1>
            <p className="admin-user">
              {localMode ? '本機示範模式（尚未連接 Firebase）' : auth.user?.email}
            </p>
          </div>
          <div className="admin-header-actions">
            <a className="btn btn-ghost" href="/">
              查看網站
            </a>
            {!localMode && (
              <button className="btn btn-ghost" onClick={() => void auth.logout()}>
                登出
              </button>
            )}
          </div>
        </div>
      </header>

      {localMode && (
        <div className="container">
          <p className="banner">
            目前還沒有連接 Firebase，你在這裡的修改只會存在這台電腦的瀏覽器裡。
            設定好 Firebase 後（見 README），資料就會永久保存。
          </p>
        </div>
      )}

      {stillSample && (
        <div className="container">
          <p className="banner">
            網站目前顯示的是示範資料。按下右邊按鈕可以把示範內容複製成你自己的資料，再慢慢改成你的內容。
            <button className="btn btn-small" disabled={seeding} onClick={() => void handleCopySample()}>
              {seeding ? '複製中…' : '複製示範資料'}
            </button>
            {seedMessage && <span className="banner-note">{seedMessage}</span>}
          </p>
        </div>
      )}

      <nav className="admin-tabs container" aria-label="後台功能">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`admin-tab ${tab === item.id ? 'is-active' : ''}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <main className="container admin-main">
        {tab === 'profile' && <ProfilePanel profile={data.profile} onSaved={reload} />}
        {tab === 'projects' && <ProjectsPanel projects={data.projects} isSample={data.usingSample.projects} onSaved={reload} />}
        {tab === 'timeline' && <TimelinePanel items={data.timeline} isSample={data.usingSample.timeline} onSaved={reload} />}
        {tab === 'skills' && <SkillsPanel skills={data.skills} isSample={data.usingSample.skills} onSaved={reload} />}
        {tab === 'settings' && <SettingsPanel settings={data.settings} onSaved={reload} />}
      </main>
    </div>
  );
}
