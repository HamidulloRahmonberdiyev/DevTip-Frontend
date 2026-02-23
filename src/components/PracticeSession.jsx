import { useState, useRef, useEffect } from 'react';
import { evaluateAnswer } from '../services/aiEvaluation';

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

      <style>{`
        .practice {
          max-width: 720px;
          margin: 0 auto;
          padding: var(--space-xl);
          min-height: 80vh;
          display: flex;
          flex-direction: column;
          animation: practiceFadeIn 0.4s var(--ease-out);
        }

        @keyframes practiceFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .practice__top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-xl);
        }

        .practice__back {
          display: inline-flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-sm) var(--space-md);
          background: transparent;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: 0.9375rem;
          font-family: inherit;
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .practice__back:hover {
          border-color: var(--accent-cyan);
          color: var(--accent-cyan);
        }

        .practice__back:focus-visible {
          outline: 2px solid var(--accent-cyan);
          outline-offset: 2px;
        }

        .practice__meta {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .practice__tech {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--accent-cyan);
        }

        .practice__counter {
          font-family: var(--font-mono);
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .practice__progress-wrap {
          display: flex;
          align-items: center;
          gap: var(--space-lg);
          margin-bottom: var(--space-2xl);
        }

        .practice__progress-track {
          flex: 1;
          height: 6px;
          background: var(--bg-tertiary);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .practice__progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-cyan), var(--accent-blue));
          border-radius: var(--radius-full);
          transition: width var(--duration-normal) var(--ease-out);
        }

        .practice__progress-text {
          font-family: var(--font-mono);
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .practice__content {
          flex: 1;
        }

        .practice__card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          padding: var(--space-xl);
          margin-bottom: var(--space-lg);
          transition: border-color var(--duration-fast) var(--ease-out);
        }

        .practice__card:hover {
          border-color: var(--border-accent);
        }

        .practice__question-card {
          padding: var(--space-xl) var(--space-2xl);
        }

        .practice__editor-card {
          padding: var(--space-xl);
        }

        .practice__difficulty {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 600;
          padding: var(--space-xs) var(--space-sm);
          background: color-mix(in srgb, var(--diff-color) 18%, transparent);
          color: var(--diff-color);
          border-radius: var(--radius-sm);
          margin-bottom: var(--space-md);
        }

        .practice__question {
          font-size: 1.375rem;
          font-weight: 600;
          line-height: 1.4;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }

        .practice__label {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
          margin-bottom: var(--space-md);
        }

        .practice__label span:first-child {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .practice__label-hint {
          font-size: 0.8125rem;
          color: var(--text-muted);
          font-weight: 400;
        }

        .practice__editor {
          width: 100%;
          padding: var(--space-lg);
          background: var(--bg-primary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-family: var(--font-mono);
          font-size: 0.9375rem;
          line-height: 1.7;
          resize: vertical;
          min-height: 160px;
          transition: border-color var(--duration-fast) var(--ease-out);
        }

        .practice__editor::placeholder {
          color: var(--text-muted);
        }

        .practice__editor:hover {
          border-color: rgba(148, 163, 184, 0.2);
        }

        .practice__editor:focus {
          outline: none;
          border-color: var(--accent-cyan);
          box-shadow: 0 0 0 3px var(--accent-cyan-dim);
        }

        .practice__actions {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-md);
          margin-bottom: var(--space-xl);
        }

        .practice__submit-btn {
          display: inline-flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-md) var(--space-xl);
          background: linear-gradient(135deg, var(--accent-cyan), var(--accent-blue));
          border: none;
          border-radius: var(--radius-md);
          color: white;
          font-size: 1rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: transform var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out);
        }

        .practice__submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(6, 182, 212, 0.4);
        }

        .practice__submit-btn:disabled {
          opacity: 0.8;
          cursor: wait;
        }

        .practice__spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .practice__reveal-btn {
          display: inline-flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-md) var(--space-xl);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: 1rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .practice__reveal-btn:hover:not(:disabled) {
          background: var(--bg-card-hover);
          border-color: var(--accent-cyan);
          color: var(--accent-cyan);
        }

        .practice__reveal-btn:disabled {
          background: var(--bg-tertiary);
          color: var(--text-muted);
          cursor: default;
        }

        .practice__reveal-btn:focus-visible {
          outline: 2px solid var(--accent-cyan);
          outline-offset: 2px;
        }

        .practice__error {
          display: flex;
          align-items: flex-start;
          gap: var(--space-md);
          padding: var(--space-md) var(--space-lg);
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: var(--radius-md);
          color: #fca5a5;
          font-size: 0.9375rem;
          margin-bottom: var(--space-xl);
        }

        .practice__error svg {
          flex-shrink: 0;
        }

        .practice__ai-block {
          padding: var(--space-xl);
          background: rgba(6, 182, 212, 0.08);
          border: 1px solid rgba(6, 182, 212, 0.25);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-xl);
          animation: slideIn 0.3s var(--ease-out);
        }

        .practice__ai-header {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          margin-bottom: var(--space-md);
        }

        .practice__ai-score {
          font-family: var(--font-mono);
          font-size: 1.5rem;
          font-weight: 700;
          padding: var(--space-sm) var(--space-md);
          border-radius: var(--radius-sm);
          background: var(--bg-tertiary);
        }

        .practice__ai-score[data-score^="8"],
        .practice__ai-score[data-score^="9"],
        .practice__ai-score[data-score="100"] {
          color: var(--accent-cyan);
        }

        .practice__ai-score[data-score^="6"],
        .practice__ai-score[data-score^="7"] {
          color: #eab308;
        }

        .practice__ai-score[data-score^="0"],
        .practice__ai-score[data-score^="1"],
        .practice__ai-score[data-score^="2"],
        .practice__ai-score[data-score^="3"],
        .practice__ai-score[data-score^="4"],
        .practice__ai-score[data-score^="5"] {
          color: #ef4444;
        }

        .practice__ai-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--accent-cyan);
        }

        .practice__ai-feedback {
          font-size: 1rem;
          line-height: 1.75;
          color: var(--text-secondary);
          margin: 0;
          white-space: pre-wrap;
        }

        .practice__answer-block {
          padding: var(--space-xl);
          background: rgba(6, 182, 212, 0.08);
          border: 1px solid rgba(6, 182, 212, 0.25);
          border-radius: var(--radius-md);
          animation: slideIn 0.3s var(--ease-out);
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .practice__answer-header {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--accent-cyan);
          margin-bottom: var(--space-md);
        }

        .practice__answer-text {
          font-size: 1rem;
          line-height: 1.75;
          color: var(--text-secondary);
          margin: 0;
        }

        .practice__nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-lg);
          padding-top: var(--space-2xl);
          margin-top: auto;
          border-top: 1px solid var(--border-subtle);
        }

        .practice__nav-btn {
          display: inline-flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-md) var(--space-lg);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: 0.9375rem;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .practice__nav-btn:hover:not(:disabled) {
          border-color: var(--accent-cyan);
          color: var(--accent-cyan);
        }

        .practice__nav-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .practice__nav-btn:focus-visible {
          outline: 2px solid var(--accent-cyan);
          outline-offset: 2px;
        }

        .practice__nav-dots {
          display: flex;
          gap: var(--space-sm);
          flex-wrap: wrap;
          justify-content: center;
        }

        .practice__nav-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          cursor: pointer;
          transition: all var(--duration-fast) var(--ease-out);
        }

        .practice__nav-dot:hover {
          background: var(--text-muted);
        }

        .practice__nav-dot--active {
          background: var(--accent-cyan);
          border-color: var(--accent-cyan);
          transform: scale(1.2);
        }

        @media (max-width: 640px) {
          .practice {
            padding: var(--space-lg);
          }

          .practice__question {
            font-size: 1.2rem;
          }

          .practice__nav {
            flex-wrap: wrap;
          }

          .practice__nav-dots {
            order: 3;
            width: 100%;
            padding-top: var(--space-md);
          }
        }
      `}</style>
    </div>
  );
}
