import { useEffect } from 'react';
import { useSiteData } from '../hooks/useSiteData';
import Loading from '../components/Loading';
import Hero from './Hero';
import About from './About';
import ProjectsSection from './ProjectsSection';
import TimelineSection from './TimelineSection';
import SkillsSection from './SkillsSection';
import Footer from './Footer';
import NavBar from './NavBar';

/**
 * 公開網站：訪客看到的畫面。
 * 這裡完全沒有任何管理功能，就算管理員已經登入，看到的也是一樣乾淨的網站。
 */
export default function PublicSite() {
  const { data, loading, error } = useSiteData();

  // 依照設定切換主色
  useEffect(() => {
    if (data?.settings.accent) {
      document.documentElement.style.setProperty('--accent', data.settings.accent);
    }
  }, [data?.settings.accent]);

  useEffect(() => {
    if (data?.profile.name) {
      document.title = `${data.profile.name}｜學習歷程`;
    }
  }, [data?.profile.name]);

  if (loading) return <Loading text="正在載入網站內容…" />;

  if (error || !data) {
    return (
      <div className="center-screen">
        <div className="notice-card">
          <h2>資料暫時無法載入</h2>
          <p>{error || '請稍後重新整理。'}</p>
          <button className="btn" onClick={() => window.location.reload()}>
            重新整理
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <NavBar name={data.profile.name} />
      <main>
        <Hero profile={data.profile} />
        <About profile={data.profile} />
        <ProjectsSection projects={data.projects} />
        <TimelineSection items={data.timeline} />
        <SkillsSection skills={data.skills} />
      </main>
      <Footer name={data.profile.name} />
    </div>
  );
}
