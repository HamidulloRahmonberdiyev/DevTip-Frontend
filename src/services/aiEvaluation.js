const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export async function evaluateAnswer(question, userAnswer, correctAnswer) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY_NOT_SET');
  }

  const systemPrompt = `Siz dasturlash intervyu savollariga javobni baholovchi ekspertsiz. 
Foydalanuvchi javobini to'g'ri javob bilan solishtiring va quyidagi JSON formatida javob bering:
{
  "score": 0-100 (foizda, qanchalik to'g'ri),
  "feedback": "Batafsil tahlil o'zbek tilida. Qaysi qismlar to'g'ri, qaysilari noto'g'ri. Qanday yaxshilash mumkin. To'liq va tushunarli javob yozing."
}
Faqat JSON qaytaring, boshqa matn yo'q.`;

  const userPrompt = `Savol: ${question}

To'g'ri javob: ${correctAnswer}

Foydalanuvchi javobi: ${userAnswer || '(Javob yozilmagan)'}

Foydalanuvchi javobini baholang va JSON formatida qaytaring.`;

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API xatosi: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim() || '';

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    return {
      score: Math.min(100, Math.max(0, Number(parsed.score) || 0)),
      feedback: parsed.feedback || 'Tahlil olishda xatolik yuz berdi.',
    };
  } catch {
    return {
      score: 0,
      feedback: content || 'Javobni tahlil qilishda xatolik.',
    };
  }
}
