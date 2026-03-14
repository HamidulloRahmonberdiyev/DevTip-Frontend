/**
 * Gemini API orqali savolga javob olish.
 * API kaliti: Google AI Studio (https://aistudio.google.com/apikey)
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const DEFAULT_SYSTEM = `Siz texnik intervyu ekspertisiz. Savolga batafsil, professional va TO'LIQ yakunlangan javob bering.

MAJBURIY QOIDALAR:
- Javob faqat o'zbek tilida, aniq va tushunarli.
- Javob OXIRIGACHA to'liq bo'lishi kerak: hech qachon yarim jumla, kesilgan ro'yxat yoki "..." qoldirmang. Har bir bo'limni to'liq yozing.
- Struktura: sarlavha/bo'limlar, keyin bullet yoki raqamlangan ro'yxat. Har bir band to'liq va yakunlangan bo'lsin.
- Kod so'ralsa: qisqa ishlaydigan misol va izoh; kod bo'lagini yarim qoldirmang.
- Keraksiz kirish-so'ngi iboralar yo'q; to'g'ridan-to'g'ri va professional tilda javob.`;

export async function getGeminiAnswer(questionText) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY_NOT_SET');
  }

  const url = `${GEMINI_API_URL}?key=${encodeURIComponent(apiKey)}`;
  const userPrompt = typeof questionText === 'string' && questionText.trim()
    ? questionText.trim()
    : '';

  if (!userPrompt) {
    throw new Error('Savol matni bo\'sh.');
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: `${userPrompt}\n\nJavob to'liq va yakunlangan bo'lsin — oxirida hech narsa kesilmasin.` }],
        },
      ],
      systemInstruction: { parts: [{ text: DEFAULT_SYSTEM }] },
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 8192,
        topP: 0.95,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg = err.error?.message || `API xatosi: ${response.status}`;
    throw new Error(msg);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!text) {
    throw new Error('Gemini javob qaytarmadi.');
  }

  return text;
}
