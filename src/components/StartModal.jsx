import { useState } from 'react';
import { technologies } from '../data/questions';
import { useLanguage } from '../context/LanguageContext';
import '../styles/StartModal.css';

const LEVELS = [
  { id: 'junior', labelKey: 'level_junior' },
  { id: 'middle', labelKey: 'level_middle' },
  { id: 'senior', labelKey: 'level_senior' },
];

export default function StartModal({ onClose, onStart }) {
  const { t } = useLanguage();
  const [level, setLevel] = useState('junior');
  const [techId, setTechId] = useState(technologies[0]?.id || 'javascript');

  const handleSubmit = (e) => {
    e.preventDefault();
    onStart(techId, level);
    onClose();
  };

  return (
    <div className="start-modal-overlay" onClick={onClose}>
      <div
        className="start-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="start-modal-title"
      >
        <button
          type="button"
          className="start-modal__close"
          onClick={onClose}
          aria-label={t('start_close')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="start-modal__content">
          <h2 id="start-modal-title" className="start-modal__title">
            {t('start_title')}
          </h2>
          <p className="start-modal__desc">
            {t('start_desc')}
          </p>

          <form onSubmit={handleSubmit} className="start-modal__form">
            <div className="start-modal__field">
              <label className="start-modal__label">{t('start_level')}</label>
              <div className="start-modal__levels">
                {LEVELS.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    className={`start-modal__level-btn ${level === l.id ? 'start-modal__level-btn--active' : ''}`}
                    onClick={() => setLevel(l.id)}
                  >
                    {t(l.labelKey)}
                  </button>
                ))}
              </div>
            </div>

            <div className="start-modal__field">
              <label className="start-modal__label">{t('start_tech')}</label>
              <div className="start-modal__techs">
                {technologies.map((tech) => (
                  <button
                    key={tech.id}
                    type="button"
                    className={`start-modal__tech-btn ${techId === tech.id ? 'start-modal__tech-btn--active' : ''}`}
                    onClick={() => setTechId(tech.id)}
                    style={{ '--tech-color': tech.color }}
                  >
                    <span className="start-modal__tech-icon">{tech.icon}</span>
                    <span className="start-modal__tech-name">{tech.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="start-modal__submit">
              {t('start_cta')}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
