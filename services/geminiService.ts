import { MAJOR_ARCANA } from '../constants';
import { AnalysisResponse } from '../types';
import { GoogleGenAI, Type } from '@google/genai';

// Update to use NEXT_API_KEY as requested, keeping fallbacks for safety
const API_KEY = process.env.NEXT_API_KEY || process.env.NEXT_PUBLIC_API_KEY || process.env.API_KEY || "AIzaSyDfWDUYQ8slCkCCoK1aYejCxbjhHPF1IzI";

export const analyzeSituation = async (userSituation: string): Promise<AnalysisResponse> => {
  const cardsContext = MAJOR_ARCANA.map(c => `${c.id}: ${c.name} (${c.archetype}) - ${c.psychological}`).join('\n');

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    // Using gemini-2.5-flash for speed and cost-effectiveness
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userSituation,
      config: {
        systemInstruction: `
          Вы — мастер юнгианской психологии и эксперт по Таро.
          Ваша задача — проанализировать ситуацию пользователя и выбрать одну карту Таро из предоставленного списка.
          
          Список карт:
          ${cardsContext}
          
          Верните ответ строго в формате JSON, соответствующем схеме, без дополнительного текста.
        `,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cardId: {
              type: Type.INTEGER,
              description: 'ID выбранной карты от 0 до 21',
            },
            interpretation: {
              type: Type.STRING,
              description: 'Глубокая психологическая интерпретация на русском языке, до 200 слов',
            },
          },
          required: ['cardId', 'interpretation'],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
       throw new Error("Empty response from Gemini");
    }

    const result = JSON.parse(resultText) as AnalysisResponse;
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