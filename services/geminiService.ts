import { MAJOR_ARCANA } from '../constants';
import { AnalysisResponse } from '../types';

// Using the provided DeepSeek API Key
// In a real production environment, ensure this is set via environment variables (e.g. NEXT_PUBLIC_DEEPSEEK_API_KEY)
const API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY || "sk-a8257b4192094a49930a10ec929d6b20";

// Model name constant. Use 'deepseek-chat' for V3 or 'deepseek-reasoner' for R1.
const MODEL_NAME = 'deepseek-chat';

export const analyzeSituation = async (userSituation: string): Promise<AnalysisResponse> => {
  const cardsContext = MAJOR_ARCANA.map(c => `${c.id}: ${c.name} (${c.archetype}) - ${c.psychological}`).join('\n');

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          {
            role: 'system',
            content: `
              Вы — мастер юнгианской психологии и эксперт по Таро.
              Ваша задача — проанализировать ситуацию пользователя и выбрать одну карту Таро из предоставленного списка.
              
              Список карт:
              ${cardsContext}
              
              Ответьте ТОЛЬКО в формате JSON со следующей структурой:
              {
                "cardId": integer (ID выбранной карты от 0 до 21),
                "interpretation": string (глубокая психологическая интерпретация на русском языке, до 200 слов)
              }
            `
          },
          {
            role: 'user',
            content: userSituation
          }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`DeepSeek API Error: ${response.status} ${errText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    if (!content) throw new Error("Empty response from AI");

    const result = JSON.parse(content) as AnalysisResponse;
    return result;

  } catch (error: any) {
    console.error("DeepSeek Analysis Failed:", error);
    throw new Error(error.message || "Связь с оракулом прервана.");
  }
};

export const transcribeAudio = async (): Promise<string> => {
    throw new Error("Use native browser SpeechRecognition instead.");
};

export const generateSpeech = async (): Promise<string> => {
    throw new Error("Use native browser SpeechSynthesis instead.");
};