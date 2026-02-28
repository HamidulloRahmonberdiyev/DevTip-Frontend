import { useLanguage } from '../context/LanguageContext';
import '../styles/TechnologyCard.css';

const TECH_COLORS = {
  javascript: '#f7df1e',
  js: '#f7df1e',
  react: '#61dafb',
  vue: '#42b883',
  css: '#264de4',
  laravel: '#ff2d20',
  php: '#777bb4',
  python: '#3776ab',
  node: '#339933',
  nodejs: '#339933',
  algorithms: '#e34c26',
  html: '#e34c26',
  git: '#f05032',
  typescript: '#3178c6',
  default: '#06b6d4',
};

function capitalizeFirst(str) {
  if (!str || typeof str !== 'string') return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getTechColor(technology) {
  if (technology.color) return technology.color;
  const slug = String(technology.slug ?? technology.name ?? technology.id ?? '').toLowerCase().replace(/\s+/g, '');
  return TECH_COLORS[slug] ?? TECH_COLORS.default;
}

export default function TechnologyCard({ technology, isActive, onSelect, onStart }) {
  const { t } = useLanguage();
  const slug = technology.slug ?? technology.id;
  const descKey = `tech_${slug}_desc`;
  const description = technology.description ?? (t(descKey) !== descKey ? t(descKey) : '');
  const displayName = capitalizeFirst(technology.name);
  const badgeLabel =
    technology.icon && typeof technology.icon === 'string' && /^[A-Za-z]{1,3}$/.test(technology.icon)
      ? technology.icon.toUpperCase()
      : displayName.charAt(0);
  const techColor = getTechColor(technology);

  return (
    <div
      className={`tech-card ${isActive ? 'tech-card--active' : ''}`}
    >
      <button
        className="tech-card__select"
        onClick={() => onSelect(technology.id)}
      >
        <div
          className="tech-card__badge"
          style={{ '--tech-color': techColor }}
          aria-hidden
        >
          <span className="tech-card__badge-label">{badgeLabel}</span>
        </div>
        <div className="tech-card__content">
          <h3 className="tech-card__name">{displayName}</h3>
          <p className="tech-card__desc">{description}</p>
          <span className="tech-card__count">{technology.count} {t('tech_questions')}</span>
        </div>
        <svg className="tech-card__arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
      <button
        type="button"
        className="tech-card__start"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (typeof onStart === 'function') onStart(technology.id);
        }}
      >
        {t('tech_start')}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  );
}
