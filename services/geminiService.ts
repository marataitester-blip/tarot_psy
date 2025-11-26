import { MAJOR_ARCANA } from '../constants';
import { AnalysisResponse } from '../types';

// Prioritize NEXT_PUBLIC_API_KEY for Vercel + REST client-side usage
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || process.env.NEXT_API_KEY || process.env.API_KEY || "AIzaSyDfWDUYQ8slCkCCoK1aYejCxbjhHPF1IzI";

export const analyzeSituation = async (userSituation: string): Promise<AnalysisResponse> => {
  const cardsContext = MAJOR_ARCANA.map(c => `${c.id}: ${c.name} (${c.archetype}) - ${c.psychological}`).join('\n');

  const systemInstructionText = `
    Вы — мастер юнгианской психологии и эксперт по Таро.
    Ваша задача — проанализировать ситуацию пользователя и выбрать одну карту Таро из предоставленного списка.
    
    Список карт:
    ${cardsContext}
    
    Верните ответ строго в формате JSON, соответствующем схеме, без дополнительного текста.
  `;

  // REST API Endpoint for Gemini
  // Using v1beta to ensure support for modern features and models like 2.5-flash or 1.5-flash
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

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
    
    // Extracting the text from the Gemini response structure
    const candidate = data.candidates?.[0];
    const textPart = candidate?.content?.parts?.[0]?.text;

    if (!textPart) {
      throw new Error("Пустой ответ от Gemini");
    }

    // Parse the JSON string contained in the response
    const result = JSON.parse(textPart) as AnalysisResponse;
    return result;

  } catch (error: any) {
    console.error("Gemini Analysis Failed:", error);
    throw new Error(error.message || "Связь с оракулом прервана.");
  }
};

// These functions are placeholders for native browser APIs used in components
export const transcribeAudio = async (): Promise<string> => {
    throw new Error("Use native browser SpeechRecognition instead.");
};

export const generateSpeech = async (): Promise<string> => {
    throw new Error("Use native browser SpeechSynthesis instead.");
};