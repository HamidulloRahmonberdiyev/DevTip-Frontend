import { useLanguage } from '../context/LanguageContext';
import '../styles/TechnologyCard.css';

export default function TechnologyCard({ technology, isActive, onSelect, onStart }) {
  const { t } = useLanguage();
  const descKey = `tech_${technology.id}_desc`;
  const description = t(descKey) === descKey ? technology.description : t(descKey);

  return (
    <div
      className={`tech-card ${isActive ? 'tech-card--active' : ''}`}
    >
      <button
        className="tech-card__select"
        onClick={() => onSelect(technology.id)}
      >
        <div 
          className="tech-card__icon" 
          style={{ '--tech-color': technology.color }}
        >
          {technology.icon}
        </div>
        <div className="tech-card__content">
          <h3 className="tech-card__name">{technology.name}</h3>
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
