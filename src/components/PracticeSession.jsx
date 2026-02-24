import { useState, useRef, useEffect } from 'react';
import { evaluateAnswer } from '../services/aiEvaluation';
import '../styles/PracticeSession.css';

const difficultyLabels = {
  junior: { text: 'Junior', color: '#06b6d4' },
  middle: { text: 'Middle', color: '#eab308' },
  senior: { text: 'Senior', color: '#ef4444' },
};

export default function PracticeSession({ questions, technologyName, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [aiFeedback, setAiFeedback] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const editorRef = useRef(null);

  const question = questions[currentIndex];
  const total = questions.length;
  const progress = ((currentIndex + 1) / total) * 100;
  const difficulty = question ? difficultyLabels[question.difficulty] : null;

  useEffect(() => {
    editorRef.current?.focus();
    setError(null);
  }, [currentIndex]);

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
    } catch (err) {
      if (err.message === 'OPENAI_API_KEY_NOT_SET') {
        setError('AI baholash uchun OpenAI API kaliti kerak. .env.local faylida VITE_OPENAI_API_KEY qo‘shing.');
      } else {
        setError(err.message || 'Xatolik yuz berdi. Qayta urinib ko‘ring.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUserAnswer = (value) => {
    setUserAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const goNext = () => {
    if (currentIndex < total - 1) setCurrentIndex((i) => i + 1);
  };

  const goPrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  return (
    <div className="practice" role="main">
      <div className="practice__top-bar">
        <button className="practice__back" onClick={onBack} aria-label="Orqaga">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Orqaga
        </button>
        <div className="practice__meta">
          <span className="practice__tech">{technologyName}</span>
          <span className="practice__counter">
            {currentIndex + 1} / {total}
          </span>
        </div>
      </div>

      <div className="practice__progress-wrap">
        <div className="practice__progress-track">
          <div className="practice__progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <span className="practice__progress-text">{currentIndex + 1} / {total}</span>
      </div>

      <div className="practice__content">
        <div className="practice__card practice__question-card">
          <span 
            className="practice__difficulty"
            style={{ '--diff-color': difficulty?.color }}
          >
            {difficulty?.text}
          </span>
          <h2 className="practice__question">{question.question}</h2>
        </div>

        <div className="practice__card practice__editor-card">
          <label className="practice__label">
            <span>Sizning javobingiz</span>
            <span className="practice__label-hint">Javobingizni yozing va «Tasdiqlash» tugmasini bosing — AI baholaydi</span>
          </label>
          <textarea
            ref={editorRef}
            className="practice__editor"
            placeholder="Javobingizni shu yerga yozing..."
            value={userAnswers[question.id] ?? ''}
            onChange={(e) => handleUserAnswer(e.target.value)}
            rows={6}
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
                Tekshirilmoqda...
              </>
            ) : aiFeedback[question.id] ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Qayta tekshirish
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <path d="M22 4L12 14.01l-3-3"/>
                </svg>
                Tasdiqlash
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
                Javob ko‘rsatilgan
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                Javobni ko‘rish
              </>
            )}
          </button>
        </div>

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
              <span className="practice__ai-label">AI tahlili</span>
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
              To‘g‘ri javob
            </div>
            <p className="practice__answer-text">{question.answer}</p>
          </div>
        )}
      </div>

      <nav className="practice__nav">
        <button
          className="practice__nav-btn"
          onClick={goPrev}
          disabled={currentIndex === 0}
          aria-label="Oldingi savol"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Oldingi
        </button>
        <div className="practice__nav-dots">
          {questions.map((_, i) => (
            <button
              key={i}
              className={`practice__nav-dot ${i === currentIndex ? 'practice__nav-dot--active' : ''}`}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Savol ${i + 1}`}
            />
          ))}
        </div>
        <button
          className="practice__nav-btn"
          onClick={goNext}
          disabled={currentIndex === total - 1}
          aria-label="Keyingi savol"
        >
          Keyingi
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </nav>
    </div>
  );
}
