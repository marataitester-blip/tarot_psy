
import { MAJOR_ARCANA } from '../constants';
import { AnalysisResponse } from '../types';

// Use the environment variable if available, otherwise fallback to the provided key for immediate functionality
const ENV_KEY = typeof process !== 'undefined' && process.env ? process.env.NEXT_PUBLIC_API_KEY : undefined;
const FALLBACK_KEY = "AIzaSyDfWDUYQ8slCkCCoK1aYejCxbjhHPF1IzI"; 
const API_KEY = ENV_KEY || FALLBACK_KEY;

export const analyzeSituation = async (userSituation: string): Promise<AnalysisResponse> => {
  if (!API_KEY) {
    throw new Error("API Key не найден. Проверьте переменную окружения NEXT_PUBLIC_API_KEY.");
  }

  const cardsContext = MAJOR_ARCANA.map(c => `${c.id}: ${c.name} (${c.archetype}) - ${c.psychological}`).join('\n');

  const systemInstructionText = `
    Вы — мастер юнгианской психологии и эксперт по Таро.
    Ваша задача — проанализировать ситуацию пользователя и выбрать одну карту Таро из предоставленного списка.
    
    Список карт:
    ${cardsContext}
    
    Верните ответ строго в формате JSON, соответствующем схеме.
  `;

  // We use v1beta because it has better support for 'responseSchema' and 'systemInstruction' than v1
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  const requestBody = {
    contents: [
      {
        parts: [{ text: userSituation }]
      }
    ],
    systemInstruction: {
      parts: [{ text: systemInstructionText }]
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1000,
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          cardId: {
            type: "INTEGER",
            description: "ID выбранной карты от 0 до 21"
          },
          interpretation: {
            type: "STRING",
            description: "Глубокая психологическая интерпретация на русском языке, до 200 слов"
          }
        },
        required: ["cardId", "interpretation"]
      }
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.error?.message || `Ошибка API: ${response.status}`);
    }

    const data = await response.json();
    
    // Validating Gemini Response Structure
    const candidate = data.candidates?.[0];
    const textPart = candidate?.content?.parts?.[0]?.text;

    if (!textPart) {
      throw new Error("Пустой ответ от Gemini");
    }

    // Parse the JSON string contained in the response
    const result = JSON.parse(textPart) as AnalysisResponse;
    return result;

  } catch (error: any) {
    console.error("Analysis Failed:", error);
    throw new Error(error.message || "Связь с оракулом прервана.");
  }
};

// Placeholder functions for native browser APIs (Client-side only)
export const transcribeAudio = async (): Promise<string> => {
    throw new Error("Use native browser SpeechRecognition instead.");
};

export const generateSpeech = async (): Promise<string> => {
    throw new Error("Use native browser SpeechSynthesis instead.");
};
