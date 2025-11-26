
import { MAJOR_ARCANA } from '../constants';
import { AnalysisResponse } from '../types';

// Fallback key provided by user
const FALLBACK_KEY = "AIzaSyDfWDUYQ8slCkCCoK1aYejCxbjhHPF1IzI";

const getApiKey = (): string => {
  // 1. Try env vars
  if (typeof process !== 'undefined' && process.env) {
    const envKey = process.env.NEXT_API_KEY || process.env.NEXT_PUBLIC_API_KEY;
    if (envKey) return envKey.replace(/[\s\n\r]/g, '');
  }
  
  // 2. Fallback
  return FALLBACK_KEY;
};

export const analyzeSituation = async (userSituation: string): Promise<AnalysisResponse> => {
  const API_KEY = getApiKey();
  
  const cardsContext = MAJOR_ARCANA.map(c => `${c.id}: ${c.name} (${c.archetype})`).join('\n');

  // Simple, robust prompt
  const promptText = `
    Role: Tarot Expert.
    Task: Analyze user situation, pick 1 Major Arcana card.
    Context Cards:
    ${cardsContext}
    
    User Situation: "${userSituation}"

    Output JSON only:
    {
      "cardId": number,
      "interpretation": "Psychological interpretation in Russian (max 150 words)."
    }
  `;

  const url = new URL('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent');
  url.searchParams.append('key', API_KEY);

  const requestBody = {
    contents: [{ parts: [{ text: promptText }] }],
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json"
    }
  };

  try {
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      referrerPolicy: 'no-referrer'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Ошибка API: ${response.status}`);
    }

    const data = await response.json();
    const textPart = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textPart) throw new Error("Пустой ответ.");

    const result = JSON.parse(textPart) as AnalysisResponse;
    return result;

  } catch (error: any) {
    console.error("Analysis Failed:", error);
    throw new Error("Не удалось получить толкование. Попробуйте еще раз.");
  }
};
