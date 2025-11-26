import { MAJOR_ARCANA } from '../constants';
import { AnalysisResponse } from '../types';

// Use NEXT_PUBLIC_DEEPSEEK_API_KEY for Vercel client-side access
const getApiKey = () => {
  const key = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY;
  if (!key) {
    throw new Error("DeepSeek API Key не найден. Установите NEXT_PUBLIC_DEEPSEEK_API_KEY.");
  }
  return key;
};

export const analyzeSituation = async (userSituation: string): Promise<AnalysisResponse> => {
  const apiKey = getApiKey();
  const apiUrl = "https://api.deepseek.com/chat/completions";

  const cardsContext = MAJOR_ARCANA.map(c => `${c.id}: ${c.name} (${c.archetype}) - ${c.psychological}`).join('\n');

  const systemPrompt = `
    Вы — мастер юнгианской психологии и эксперт по Таро.
    Проанализируйте ситуацию пользователя.
    Выберите ровно одну карту Старшего Аркана (ID 0-21), которая лучше всего резонирует с психологическим подтекстом ситуации.
    Предоставьте психологический портрет-толкование на русском языке.
    
    Доступные карты:
    ${cardsContext}

    Ответьте строго в формате JSON:
    {
      "cardId": number,
      "interpretation": "Глубокая психологическая интерпретация (до 200 слов)"
    }
  `;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userSituation }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`DeepSeek API Error: ${response.status} ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    if (!content) throw new Error("Нет ответа от DeepSeek.");

    const result = JSON.parse(content) as AnalysisResponse;
    
    // Validate result
    if (typeof result.cardId !== 'number' || !result.interpretation) {
      throw new Error("Некорректный формат ответа от AI");
    }

    return result;
  } catch (error) {
    console.error("DeepSeek Analysis Failed:", error);
    throw new Error("Связь с оракулом прервана. Проверьте API ключ или попробуйте позже.");
  }
};

// Functions below are removed/deprecated as we now use native browser APIs
// They are kept here just in case imports are not fully cleaned up elsewhere immediately, 
// but will throw if called.
export const transcribeAudio = async (): Promise<string> => {
    throw new Error("Use native browser SpeechRecognition instead.");
};

export const generateSpeech = async (): Promise<string> => {
    throw new Error("Use native browser SpeechSynthesis instead.");
};
