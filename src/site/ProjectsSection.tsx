import { useEffect, useState } from 'react';
import StoredImage from '../components/StoredImage';
import ProjectDialog from './ProjectDialog';
import type { Project } from '../types';

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  const [openProject, setOpenProject] = useState<Project | null>(null);

  // 打開作品詳情時鎖住背景捲動
  useEffect(() => {
    document.body.style.overflow = openProject ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [openProject]);

  return (
    <section className="section section-alt" id="projects">
      <div className="container">
        <p className="section-eyebrow">WORKS</p>
        <h2 className="section-title">我的作品</h2>
        <p className="section-desc">點一下卡片，可以看到完整的製作過程與心得。</p>

        {projects.length === 0 ? (
          <p className="empty-text">目前還沒有作品，之後會慢慢補上。</p>
        ) : (
          <div className="project-grid">
            {projects.map((project) => (
              <button
                key={project.id}
                type="button"
                className="card project-card"
                onClick={() => setOpenProject(project)}
              >
                <div className="project-cover">
                  <StoredImage
                    imageId={project.imageIds[0]}
                    alt={`${project.title} 封面`}
                    className="project-cover-img"
                  />
                </div>
                <div className="project-body">
                  <div className="project-meta">
                    {project.category && <span className="tag">{project.category}</span>}
                    {project.date && <span className="project-date">{project.date}</span>}
                  </div>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-summary">{project.summary}</p>
                  <span className="project-more">看更多 →</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {openProject && <ProjectDialog project={openProject} onClose={() => setOpenProject(null)} />}
    </section>
  );
}
