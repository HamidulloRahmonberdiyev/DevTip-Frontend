import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { AI_PROVIDERS, getAIUrlWithPrompt } from '../data/aiProviders';
import { evaluateAnswer } from '../services/aiEvaluation';
import { rateQuestion } from '../services/questionsApi';
import AILogo from './AILogo';
import '../styles/PracticeSession.css';

const difficultyLabels = {
  junior: { labelKey: 'level_junior', color: '#06b6d4' },
  middle: { labelKey: 'level_middle', color: '#eab308' },
  senior: { labelKey: 'level_senior', color: '#ef4444' },
};

const STARS_COUNT = 5;

export default function PracticeSession({ questions = [], technologyName, sessionId, onBack, onLoadMore, onComplete }) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [aiFeedback, setAiFeedback] = useState({});
  const [questionRatings, setQuestionRatings] = useState({});
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState(null);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [askAIOpen, setAskAIOpen] = useState(false);
  const [askAICopied, setAskAICopied] = useState(false);
  const editorRef = useRef(null);
  const askAIDropdownRef = useRef(null);

  const total = questions.length;
  const safeIndex = total > 0 ? Math.min(currentIndex, total - 1) : 0;
  const question = questions[safeIndex] ?? null;
  const progress = total > 0 ? ((safeIndex + 1) / total) * 100 : 0;
  const difficulty = question ? difficultyLabels[question.difficulty] : null;
  const currentRating = question ? questionRatings[question.id] : null; // 1..5 yoki undefined

  useEffect(() => {
    editorRef.current?.focus();
    setError(null);
    setShowComingSoon(false);
    setAskAIOpen(false);
    setAskAICopied(false);
  }, [safeIndex]);

  useEffect(() => {
    if (!askAIOpen) return;
    const handleClickOutside = (e) => {
      if (askAIDropdownRef.current && !askAIDropdownRef.current.contains(e.target)) {
        setAskAIOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [askAIOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.closest('textarea')) return;
      if (e.key === 'ArrowRight' && currentIndex < total - 1) setCurrentIndex((i) => i + 1);
      if (e.key === 'ArrowLeft' && currentIndex > 0) setCurrentIndex((i) => i - 1);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentIndex, total]);

  const handleReveal = () => {
    setRevealed((prev) => ({ ...prev, [question.id]: true }));
  };

  const handleSubmit = async () => {
    setError(null);
    setShowComingSoon(true);
    setLoading(true);
    try {
      const result = await evaluateAnswer(
        question.question,
        userAnswers[question.id] || '',
        question.answer
      );
      setAiFeedback((prev) => ({
        ...prev,
        [question.id]: { score: result.score, feedback: result.feedback },
      }));
      setShowComingSoon(false);
    } catch (err) {
      setError(null);
      setShowComingSoon(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAnswer = (value) => {
    setUserAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const handleRateQuestion = (stars) => {
    const next = question.id && (questionRatings[question.id] === stars ? undefined : stars);
    setQuestionRatings((prev) => ({
      ...prev,
      [question.id]: next,
    }));
    if (question?.id && next != null) {
      rateQuestion(question.id, next).catch(() => {});
    }
  };

  const copyToClipboard = (text) => {
    if (!text) return false;
    if (navigator.clipboard?.writeText) {
      return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      return Promise.resolve(true);
    } catch {
      return Promise.resolve(false);
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const handleAskAI = async (provider) => {
    const text = question?.question ?? '';
    const urlWithPrompt = getAIUrlWithPrompt(provider, text);
    window.open(urlWithPrompt, '_blank', 'noopener,noreferrer');
    setAskAIOpen(false);
    const copied = await copyToClipboard(text);
    if (copied) {
      setAskAICopied(true);
      setTimeout(() => setAskAICopied(false), 5000);
    }
  };

  const goNext = async () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
      return;
    }
    if (currentIndex === total - 1 && onLoadMore && typeof onLoadMore === 'function') {
      setLoadingMore(true);
      try {
        await onLoadMore();
        setCurrentIndex((i) => i + 1);
      } finally {
        setLoadingMore(false);
      }
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const buildResults = () => {
    return questions.map((q) => ({
      question_id: q.id,
      answer: userAnswers[q.id] ?? '',
      rating: questionRatings[q.id] ?? null,
      ai_score: aiFeedback[q.id]?.score ?? null,
    }));
  };

  const handleComplete = async () => {
    if (typeof onComplete !== 'function') return;
    setCompleting(true);
    try {
      await onComplete(buildResults());
    } finally {
      setCompleting(false);
    }
  };

  if (total === 0 || !question) {
    return (
      <div className="practice" role="main">
        <div className="practice__top-bar">
          <button type="button" className="practice__back" onClick={onBack} aria-label={t('practice_back')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            {t('practice_back')}
          </button>
          <span className="practice__tech">{technologyName}</span>
        </div>
        <div className="practice__empty">
          <div className="practice__empty-icon" aria-hidden>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
          </div>
          <h2 className="practice__empty-title">{t('practice_no_questions_title')}</h2>
          <p className="practice__empty-desc">{t('practice_no_questions_desc')}</p>
          <button type="button" className="practice__empty-btn" onClick={onBack}>
            {t('practice_no_questions_btn')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="practice" role="main">
      <div className="practice__top-bar">
        <button type="button" className="practice__back" onClick={onBack} aria-label={t('practice_back')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          {t('practice_back')}
        </button>
        <div className="practice__meta">
          <span className="practice__tech">{technologyName}</span>
          <span className="practice__counter">
            {safeIndex + 1} / {total}
          </span>
        </div>
        {onComplete && (
          <button
            type="button"
            className="practice__complete-btn"
            onClick={handleComplete}
            disabled={completing}
            aria-label={t('practice_complete')}
          >
            {completing ? (
              <>
                <span className="practice__spinner practice__spinner--sm" />
                {t('practice_completing')}
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                {t('practice_complete')}
              </>
            )}
          </button>
        )}
      </div>

      <div className="practice__progress-wrap">
        <div className="practice__progress-track">
          <div className="practice__progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <span className="practice__progress-text">{safeIndex + 1} / {total}</span>
      </div>

      <div className="practice__content">
        <div className="practice__card practice__question-card">
          <span 
            className="practice__difficulty"
            style={{ '--diff-color': difficulty?.color }}
          >
            {difficulty ? t(difficulty.labelKey) : ''}
          </span>
          <h2 className="practice__question">{question.question}</h2>
          <div className="practice__ask-ai-wrap" ref={askAIDropdownRef}>
            <button
              type="button"
              className="practice__ask-ai-btn"
              onClick={() => setAskAIOpen((v) => !v)}
              aria-expanded={askAIOpen}
              aria-haspopup="true"
              aria-label={t('practice_askAI')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              {t('practice_askAI')}
              <svg className="practice__ask-ai-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>
            {askAIOpen && (
              <div className="practice__ask-ai-dropdown" role="menu">
                {AI_PROVIDERS.map((provider) => (
                  <button
                    key={provider.id}
                    type="button"
                    role="menuitem"
                    className="practice__ask-ai-item"
                    onClick={() => handleAskAI(provider)}
                  >
                    <AILogo id={provider.id} className="practice__ask-ai-logo" size={24} />
                    <span>{t(provider.nameKey)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="practice__rate-wrap">
            <span className="practice__rate-label">{t('practice_rateQuestion')}</span>
            <div className="practice__rate-stars" role="group" aria-label={t('practice_rateQuestion')}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`practice__rate-star ${currentRating >= star ? 'practice__rate-star--active' : ''}`}
                  onClick={() => handleRateQuestion(star)}
                  aria-pressed={currentRating >= star}
                  aria-label={`${star} ${t('practice_rate_star')}`}
                  title={`${star} ${t('practice_rate_star')}`}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </button>
              ))}
            </div>
            {currentRating != null && (
              <span className="practice__rate-done">{currentRating} / {STARS_COUNT} — {t('practice_rated')}</span>
            )}
          </div>
        </div>

        <div className="practice__card practice__editor-card">
          <label className="practice__label">
            <span>{t('practice_yourAnswer')}</span>
            <span className="practice__label-hint">{t('practice_hint')}</span>
          </label>
          <textarea
            ref={editorRef}
            className="practice__editor"
            placeholder={t('practice_placeholder')}
            value={userAnswers[question.id] ?? ''}
            onChange={(e) => handleUserAnswer(e.target.value)}
            rows={5}
            spellCheck="false"
          />
        </div>

        <div className="practice__actions">
          <button
            className="practice__submit-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="practice__spinner" />
                {t('practice_checking')}
              </>
            ) : aiFeedback[question.id] ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                {t('practice_recheck')}
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <path d="M22 4L12 14.01l-3-3"/>
                </svg>
                {t('practice_submit')}
              </>
            )}
          </button>
          <button
            className="practice__reveal-btn"
            onClick={handleReveal}
            disabled={revealed[question.id]}
          >
            {revealed[question.id] ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                {t('practice_answerShown')}
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                {t('practice_viewAnswer')}
              </>
            )}
          </button>
        </div>

        {showComingSoon && (
          <div className="practice__coming-soon" role="status" aria-live="polite">
            <div className="practice__coming-soon-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <div className="practice__coming-soon-content">
              <strong className="practice__coming-soon-title">{t('practice_coming_soon')}</strong>
              <p className="practice__coming-soon-desc">{t('practice_coming_soon_desc')}</p>
            </div>
          </div>
        )}

        {askAICopied && (
          <div className="practice__ask-ai-toast practice__ask-ai-toast--success" role="status">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            <span>{t('practice_askAI_copied')}</span>
          </div>
        )}

        {error && (
          <div className="practice__error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4M12 16h.01"/>
            </svg>
            {error}
          </div>
        )}

        {aiFeedback[question.id] && (
          <div className="practice__ai-block">
            <div className="practice__ai-header">
              <span className="practice__ai-score" data-score={aiFeedback[question.id].score}>
                {aiFeedback[question.id].score}%
              </span>
              <span className="practice__ai-label">{t('practice_aiLabel')}</span>
            </div>
            <p className="practice__ai-feedback">{aiFeedback[question.id].feedback}</p>
          </div>
        )}

        {revealed[question.id] && (
          <div className="practice__answer-block">
            <div className="practice__answer-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              {t('practice_correctAnswer')}
            </div>
            <p className="practice__answer-text">{question.answer}</p>
          </div>
        )}
      </div>

      <nav className="practice__nav">
        <button
          type="button"
          className="practice__nav-btn"
          onClick={goPrev}
          disabled={currentIndex === 0}
          aria-label={t('practice_aria_prev')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          {t('practice_prev')}
        </button>
        <div className="practice__nav-dots">
          {questions.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`practice__nav-dot ${i === safeIndex ? 'practice__nav-dot--active' : ''}`}
              onClick={() => setCurrentIndex(i)}
              aria-label={`${t('practice_aria_question')} ${i + 1}`}
            />
          ))}
        </div>
        <button
          type="button"
          className="practice__nav-btn"
          onClick={goNext}
          disabled={currentIndex === total - 1 && !onLoadMore}
          aria-label={t('practice_aria_next')}
        >
          {loadingMore ? (
            <>
              <span className="practice__spinner practice__spinner--sm" />
              {t('practice_checking')}
            </>
          ) : (
            <>
              {t('practice_next')}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </>
          )}
        </button>
      </nav>
    </div>
  );
}
