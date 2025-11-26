import { GoogleGenAI, Type } from "@google/genai";
import { MAJOR_ARCANA } from '../constants';
import { AnalysisResponse } from '../types';

// Support both standard and Vercel public env var naming
const API_KEY = process.env.API_KEY || process.env.NEXT_PUBLIC_API_KEY;

export const analyzeSituation = async (userSituation: string): Promise<AnalysisResponse> => {
  if (!API_KEY) {
    throw new Error("API Key not found. Please set NEXT_PUBLIC_API_KEY in your Vercel settings.");
  }

  // Initialize client here to avoid initialization errors if key is missing at load time
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const cardsContext = MAJOR_ARCANA.map(c => `${c.id}: ${c.name} (${c.archetype}) - ${c.psychological}`).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        Вы — мастер юнгианской психологии и эксперт по Таро.
        Проанализируйте следующую ситуацию пользователя:
        "${userSituation}"
        
        Выберите ровно одну карту Старшего Аркана (ID 0-21) из списка ниже, которая лучше всего резонирует с психологическим подтекстом ситуации.
        
        Список карт:
        ${cardsContext}

        Предоставьте глубокую психологическую интерпретацию (до 200 слов) на русском языке.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cardId: { type: Type.INTEGER, description: "The ID of the chosen Major Arcana card (0-21)" },
            interpretation: { type: Type.STRING, description: "The psychological interpretation in Russian" }
          },
          required: ["cardId", "interpretation"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");

    const result = JSON.parse(text) as AnalysisResponse;
    return result;

  } catch (error: any) {
    console.error("Gemini Analysis Failed:", error);
    // Handle specific Google API errors gracefully if needed
    throw new Error(error.message || "Связь с оракулом прервана.");
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