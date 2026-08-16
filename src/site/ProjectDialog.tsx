import { useEffect } from 'react';
import StoredImage from '../components/StoredImage';
import DriveVideo from '../components/DriveVideo';
import type { Project } from '../types';

interface Props {
  project: Project;
  onClose: () => void;
}

/** 作品詳細內容（點卡片後跳出） */
export default function ProjectDialog({ project, onClose }: Props) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const sections = [
    { label: '作品介紹', value: project.content },
    { label: '遇到的問題', value: project.challenge },
    { label: '我怎麼解決', value: project.solution },
    { label: '學習心得與反思', value: project.reflection },
  ].filter((section) => section.value && section.value.trim());

  return (
    <div className="dialog-backdrop" role="presentation" onClick={onClose}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        onClick={(event) => event.stopPropagation()}
      >
        <button className="dialog-close" type="button" onClick={onClose} aria-label="關閉">
          ×
        </button>

        <div className="dialog-content">
          <div className="project-meta">
            {project.category && <span className="tag">{project.category}</span>}
            {project.date && <span className="project-date">{project.date}</span>}
          </div>
          <h2 className="dialog-title">{project.title}</h2>
          {project.summary && <p className="lead">{project.summary}</p>}

          {project.imageIds.length > 0 && (
            <div className="dialog-images">
              {project.imageIds.map((id) => (
                <StoredImage key={id} imageId={id} alt={`${project.title} 照片`} className="dialog-image" />
              ))}
            </div>
          )}

          {project.videoUrl && (
            <div className="dialog-block">
              <h3>作品影片</h3>
              <DriveVideo url={project.videoUrl} />
            </div>
          )}

          {sections.map((section) => (
            <div key={section.label} className="dialog-block">
              <h3>{section.label}</h3>
              <p className="text-body">{section.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
