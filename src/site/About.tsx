import type { Profile } from '../types';

export default function About({ profile }: { profile: Profile }) {
  const blocks = [
    { label: '學習方向', value: profile.direction },
    { label: '目前正在學習', value: profile.learning },
    { label: '未來想挑戰', value: profile.future },
  ].filter((block) => block.value && block.value.trim());

  return (
    <section className="section" id="about">
      <div className="container">
        <p className="section-eyebrow">ABOUT</p>
        <h2 className="section-title">關於我</h2>

        <p className="lead">{profile.intro}</p>

        {profile.interests.length > 0 && (
          <div className="about-interests">
            <span className="about-label">我的興趣</span>
            <ul className="chip-list">
              {profile.interests.map((interest) => (
                <li key={interest} className="chip chip-soft">
                  {interest}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="about-grid">
          {blocks.map((block) => (
            <article key={block.label} className="card about-card">
              <h3>{block.label}</h3>
              <p>{block.value}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
