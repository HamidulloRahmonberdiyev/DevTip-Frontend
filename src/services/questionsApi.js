import { authFetch } from '../context/AuthContext';

const LEVEL_TO_ID = { junior: 1, middle: 2, senior: 3 };
const LANG_TO_ID = { uz: 1, en: 3, ru: 2 };

/**
 * GET /api/questions
 * technologyId — GET /technologies dan kelgan texnologiya id (number) bo‘lishi kerak.
 * offset — keyingi 10 ta savol uchun (pagination).
 */
export async function fetchQuestions({ level, lang, technologyId, limit = 10, offset = 0 }) {
  const level_id = LEVEL_TO_ID[level] ?? 1;
  const lang_id = LANG_TO_ID[lang] ?? 1;
  const technology_id = Number(technologyId);
  if (!Number.isFinite(technology_id) || technology_id < 1) {
    throw new Error('technology_id API dan kelgan texnologiya id bo‘lishi kerak');
  }
  const limitVal = Math.min(100, Math.max(1, limit));
  const offsetVal = Math.max(0, Number(offset) || 0);

  const params = new URLSearchParams({
    level_id: String(level_id),
    lang_id: String(lang_id),
    technology_id: String(technology_id),
    limit: String(limitVal),
  });
  if (offsetVal > 0) params.set('offset', String(offsetVal));

  const res = await authFetch(`/questions?${params}`);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `API xatosi: ${res.status}`);
  }
  return res.json();
}

/**
 * POST /questions/:id/rate — savolni yulduzcha bilan baholash.
 * body: { stars: 1..5 }
 */
export async function rateQuestion(questionId, stars) {
  const id = Number(questionId);
  if (!Number.isFinite(id) || id < 1) return;
  const starsVal = Math.min(5, Math.max(1, Number(stars) || 0));
  const res = await authFetch(`/questions/${id}/rate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stars: starsVal }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Rate API xatosi: ${res.status}`);
  }
  return res.json();
}

/**
 * POST /complete — sessiya natijalarini yuborish.
 * Backend boshqa fieldlar kutishi mumkin (session_id, results).
 */
export async function completeSession({ sessionId, results }) {
  const res = await authFetch('/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, results }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Complete API xatosi: ${res.status}`);
  }
  return res.json();
}

/**
 * API savollarini PracticeSession formatiga o'giradi
 */
export function mapApiQuestionsToPractice(apiQuestions = [], level = 'junior') {
  return (apiQuestions || []).map((q) => ({
    id: q.id,
    question: q.question || q.title || '',
    answer: q.answer || '',
    difficulty: level,
    title: q.title,
    rating: q.rating,
    rating_count: q.rating_count,
    views: q.views,
  }));
}
