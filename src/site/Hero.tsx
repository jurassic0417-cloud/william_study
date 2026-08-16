import StoredImage from '../components/StoredImage';
import type { Profile } from '../types';

export default function Hero({ profile }: { profile: Profile }) {
  return (
    <section className="hero" id="top">
      <div className="container hero-inner">
        <div className="hero-text">
          <p className="hero-hello">HELLO, I&apos;M</p>
          <h1 className="hero-name">{profile.name}</h1>
          <p className="hero-meta">
            {profile.school}
            {profile.school && profile.grade ? '　·　' : ''}
            {profile.grade}
          </p>
          <p className="hero-tagline">「{profile.tagline}」</p>

          {profile.interests.length > 0 && (
            <ul className="chip-list" aria-label="我的興趣">
              {profile.interests.map((interest) => (
                <li key={interest} className="chip">
                  {interest}
                </li>
              ))}
            </ul>
          )}

          <a className="btn btn-primary" href="#projects">
            查看我的作品
          </a>
        </div>

        <div className="hero-photo">
          <StoredImage
            imageId={profile.photoId}
            fallbackUrl={profile.photoUrl}
            alt={`${profile.name} 的個人照片`}
            className="hero-photo-img"
          />
        </div>
      </div>
    </section>
  );
}
