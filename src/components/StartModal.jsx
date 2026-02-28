import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../context/LanguageContext';
import '../styles/StartModal.css';

const LEVELS = [
  { id: 'junior', labelKey: 'level_junior' },
  { id: 'middle', labelKey: 'level_middle' },
  { id: 'senior', labelKey: 'level_senior' },
];

const LANGS = [
  { id: 'uz', labelKey: 'header_lang_uz' },
  { id: 'en', labelKey: 'header_lang_en' },
  { id: 'ru', labelKey: 'header_lang_ru' },
];

export default function StartModal({ technologies = [], initialTechId, onClose, onStart, loading = false, error = null }) {
  const { t, lang: currentLang, setLang } = useLanguage();
  const [level, setLevel] = useState('junior');
  const [lang, setLangLocal] = useState(currentLang);
  const hasInitial = initialTechId != null && technologies.some((tech) => tech.id === initialTechId || tech.id == initialTechId);
  const [techId, setTechId] = useState(hasInitial ? initialTechId : technologies[0]?.id ?? null);
  const [showAllTechs, setShowAllTechs] = useState(false);

  const INITIAL_TECH_COUNT = 6;
  const visibleTechs = showAllTechs ? technologies : technologies.slice(0, INITIAL_TECH_COUNT);
  const hasMoreTechs = technologies.length > INITIAL_TECH_COUNT;

  useEffect(() => {
    if (technologies.length === 0) return;
    const hasInitial = initialTechId != null && technologies.some((tech) => tech.id === initialTechId || tech.id == initialTechId);
    setTechId(hasInitial ? initialTechId : technologies[0].id);
  }, [initialTechId, technologies]);

  useEffect(() => {
    setLangLocal(currentLang);
  }, [currentLang]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading || techId == null) return;
    setLang(lang);
    onStart(techId, level, lang);
  };

  const getTechColor = (tech) => tech?.color || '#06b6d4';
  const getTechLetter = (tech) => {
    if (tech?.icon && typeof tech.icon === 'string' && /^[A-Za-z]{1,3}$/.test(tech.icon)) return tech.icon.toUpperCase();
    const name = tech?.name ? String(tech.name) : '';
    return name.charAt(0).toUpperCase() || '?';
  };

  const modal = (
    <div className="start-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="start-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="start-modal-title"
      >
        <header className="start-modal__head">
          <h2 id="start-modal-title" className="start-modal__title">{t('start_title')}</h2>
          <button type="button" className="start-modal__close" onClick={onClose} aria-label={t('start_close')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </header>

        <form onSubmit={handleSubmit} className="start-modal__form">
          <p className="start-modal__desc">{t('start_desc')}</p>

          <div className="start-modal__row">
            <span className="start-modal__label">{t('start_level')}</span>
            <div className="start-modal__opts">
              {LEVELS.map((l) => (
                <button key={l.id} type="button" className={`start-modal__opt ${level === l.id ? 'start-modal__opt--on' : ''}`} onClick={() => setLevel(l.id)}>
                  {t(l.labelKey)}
                </button>
              ))}
            </div>
          </div>

          <div className="start-modal__row">
            <span className="start-modal__label">{t('start_lang')}</span>
            <div className="start-modal__opts">
              {LANGS.map((l) => (
                <button key={l.id} type="button" className={`start-modal__opt ${lang === l.id ? 'start-modal__opt--on' : ''}`} onClick={() => setLangLocal(l.id)}>
                  {t(l.labelKey)}
                </button>
              ))}
            </div>
          </div>

          <div className="start-modal__row">
            <span className="start-modal__label">{t('start_tech')}</span>
            <div className="start-modal__tech-grid">
              {technologies.length === 0 ? (
                <p className="start-modal__empty">{t('practice_checking')}</p>
              ) : (
                visibleTechs.map((tech) => (
                  <button key={tech.id} type="button" className={`start-modal__tech ${techId == tech.id ? 'start-modal__tech--on' : ''}`} onClick={() => setTechId(tech.id)} style={{ '--t': getTechColor(tech) }}>
                    <span className="start-modal__tech-dot">{getTechLetter(tech)}</span>
                    <span className="start-modal__tech-name">{tech.name}</span>
                  </button>
                ))
              )}
            </div>
            {hasMoreTechs && (
              <button type="button" className="start-modal__tech-toggle" onClick={() => setShowAllTechs((v) => !v)}>
                {showAllTechs ? t('start_tech_less') : `${t('start_tech_more')} (${technologies.length - INITIAL_TECH_COUNT})`}
              </button>
            )}
          </div>

          {error && <div className="start-modal__err" role="alert">{error}</div>}

          <button type="submit" className="start-modal__btn" disabled={loading}>
            {loading ? <span className="start-modal__spin" aria-hidden /> : <>{t('start_cta')} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg></>}
          </button>
        </form>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
