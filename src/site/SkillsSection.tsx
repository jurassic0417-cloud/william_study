import type { Skill } from '../types';

export default function SkillsSection({ skills }: { skills: Skill[] }) {
  return (
    <section className="section section-alt" id="skills">
      <div className="container">
        <p className="section-eyebrow">SKILLS</p>
        <h2 className="section-title">我的技能</h2>
        <p className="section-desc">這些是我正在學、也實際用在作品裡的能力。</p>

        {skills.length === 0 ? (
          <p className="empty-text">技能整理中。</p>
        ) : (
          <ul className="chip-list chip-list-lg">
            {skills.map((skill) => (
              <li key={skill.id} className="chip chip-soft">
                {skill.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
