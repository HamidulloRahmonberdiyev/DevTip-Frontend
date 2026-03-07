/**
 * AI provayderlar. Logolar AILogo komponentida id bo'yicha.
 * promptParam bo'lsa, savol URL ga qo'shiladi va AI da yozuv maydonida ko'rinadi.
 */
export const AI_PROVIDERS = [
  {
    id: 'chatgpt',
    nameKey: 'ai_chatgpt',
    url: 'https://chat.openai.com/',
    promptParam: 'q',
  },
  {
    id: 'claude',
    nameKey: 'ai_claude',
    url: 'https://claude.ai/new',
    promptParam: 'q',
  },
  {
    id: 'deepseek',
    nameKey: 'ai_deepseek',
    url: 'https://chat.deepseek.com/',
    promptParam: 'q',
  },
  {
    id: 'gemini',
    nameKey: 'ai_gemini',
    url: 'https://gemini.google.com/guided-learning',
    promptParam: 'query',
  },
];

/**
 * Savol matnini provider URL ga qo'shib, input/write da ko'rinadigan link qaytaradi.
 */
export function getAIUrlWithPrompt(provider, questionText) {
  const text = (questionText ?? '').trim();
  if (!text || !provider.promptParam) return provider.url;
  const base = provider.url.replace(/\?.*$/, '');
  const sep = provider.url.includes('?') ? '&' : '?';
  const param = `${provider.promptParam}=${encodeURIComponent(text)}`;
  return `${base}${sep}${param}`;
}
