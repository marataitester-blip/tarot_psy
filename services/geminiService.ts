
import { MAJOR_ARCANA } from '../constants';
import { AnalysisResponse } from '../types';

// Helper to sanitize the key - removes any non-alphanumeric characters (like hidden spaces/newlines)
const sanitizeKey = (key: string | undefined): string => {
  if (!key) return "";
  return key.replace(/[^a-zA-Z0-9_\-]/g, '');
};

// Retrieve key from various possible sources (Next.js, Vite, etc.)
const getApiKey = (): string => {
  let key = "";
  
  // Try Next.js / Node env
  if (typeof process !== 'undefined' && process.env) {
    key = process.env.NEXT_PUBLIC_API_KEY || process.env.NEXT_API_KEY || "";
  }
  
  // Try Vite env (if using Vite)
  if (!key && typeof import.meta !== 'undefined' && (import.meta as any).env) {
    key = (import.meta as any).env.NEXT_PUBLIC_API_KEY || (import.meta as any).env.VITE_API_KEY || "";
  }

  // Fallback
  if (!key) {
    key = "AIzaSyDfWDUYQ8slCkCCoK1aYejCxbjhHPF1IzI";
  }

  return sanitizeKey(key);
};

export const analyzeSituation = async (userSituation: string): Promise<AnalysisResponse> => {
  const API_KEY = getApiKey();

  if (!API_KEY || !API_KEY.startsWith("AIza")) {
    console.error("Invalid API Key format detected.");
    throw new Error("Некорректный ключ API. Проверьте настройки.");
  }

  const cardsContext = MAJOR_ARCANA.map(c => `${c.id}: ${c.name} (${c.archetype}) - ${c.psychological}`).join('\n');

  // We move the system instruction into the prompt content to be robust across API versions
  const promptText = `
    Системная инструкция:
    Вы — мастер юнгианской психологии и эксперт по Таро.
    Ваша задача — проанализировать ситуацию пользователя и выбрать одну карту Таро из предоставленного списка.
    
    Список карт:
    ${cardsContext}
    
    Ситуация пользователя:
    "${userSituation}"

    Требования к ответу:
    1. Выберите наиболее подходящую карту (cardId).
    2. Дайте глубокую психологическую интерпретацию (interpretation) на русском языке (до 200 слов).
    3. Верните ОТВЕТ ТОЛЬКО В ФОРМАТЕ JSON. Никакого маркдауна, никаких косых черт.
    
    Пример формата JSON:
    {
      "cardId": 0,
      "interpretation": "Ваш текст здесь..."
    }
  `;

  // Use simple string concatenation for the URL to ensure total control over the string
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  const requestBody = {
    contents: [
      {
        parts: [{ text: promptText }]
      }
    ],
    // We use responseMimeType to force JSON, but avoid strict schema for now to reduce 400 error surface
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1000,
      responseMimeType: "application/json"
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
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Details:', errorData);
      throw new Error(errorData.error?.message || `Ошибка API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Validate Gemini Response
    const candidate = data.candidates?.[0];
    const textPart = candidate?.content?.parts?.[0]?.text;

    if (!textPart) {
      throw new Error("Пустой ответ от Gemini");
    }

    // Parse the JSON string
    try {
      const result = JSON.parse(textPart) as AnalysisResponse;
      
      // Basic validation of the result
      if (typeof result.cardId !== 'number' || typeof result.interpretation !== 'string') {
         throw new Error("Некорректный формат ответа от AI");
      }
      
      return result;
    } catch (e) {
      console.error("JSON Parse Error:", e);
      throw new Error("Ошибка обработки ответа оракула.");
    }

  } catch (error: any) {
    console.error("Analysis Failed:", error);
    throw new Error(error.message || "Связь с оракулом прервана.");
  }
};

export const transcribeAudio = async (): Promise<string> => {
    throw new Error("Use native browser SpeechRecognition instead.");
};

export const generateSpeech = async (): Promise<string> => {
    throw new Error("Use native browser SpeechSynthesis instead.");
};
