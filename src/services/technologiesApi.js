import { authFetch } from '../context/AuthContext';

/**
 * GET /api/technologies
 * Texnologiyalarni API dan oladi
 * @returns {Promise<Array<{id: number, name: string, icon?: string, color?: string, count?: number, description?: string, slug?: string}>>}
 */
export async function fetchTechnologies() {
  const res = await authFetch('/technologies');
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `API xatosi: ${res.status}`);
  }

  const data = await res.json();
  const list = data.technologies ?? data.data ?? (Array.isArray(data) ? data : []);
  return Array.isArray(list) ? list : [];
}
