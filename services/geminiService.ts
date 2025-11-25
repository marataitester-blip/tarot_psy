import { GoogleGenAI, Type, Schema, Modality } from "@google/genai";
import { MAJOR_ARCANA } from '../constants';
import { AnalysisResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the output schema for structured JSON
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    cardId: {
      type: Type.INTEGER,
      description: "The ID of the Major Arcana card (0-21) that best represents the situation.",
    },
    interpretation: {
      type: Type.STRING,
      description: "Глубокая психологическая интерпретация ситуации пользователя через призму выбранного архетипа Таро. До 200 слов, мистически, но аналитично.",
    },
  },
  required: ["cardId", "interpretation"],
};

export const analyzeSituation = async (userSituation: string): Promise<AnalysisResponse> => {
  const modelId = "gemini-2.5-flash"; // Fast and capable for this task

  const cardsContext = MAJOR_ARCANA.map(c => `${c.id}: ${c.name} (${c.archetype}) - ${c.psychological}`).join('\n');

  const prompt = `
    Вы — мастер юнгианской психологии и эксперт по Таро.
    Проанализируйте ситуацию пользователя ниже.
    Выберите ровно одну карту Старшего Аркана (ID 0-21), которая лучше всего резонирует с психологическим подтекстом ситуации.
    Предоставьте психологический портрет-толкование на русском языке.

    Доступные карты:
    ${cardsContext}

    Ситуация пользователя:
    "${userSituation}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.7, // Slightly creative but grounded
      },
    });

    const text = response.text;
    if (!text) throw new Error("Нет ответа от Оракула.");

    const result = JSON.parse(text) as AnalysisResponse;
    return result;
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw new Error("Туман слишком густой. Пожалуйста, попробуйте снова.");
  }
};

// Transcribe audio to text
export const transcribeAudio = async (base64Audio: string, mimeType: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Audio,
            },
          },
          {
            text: "Транскрибируй эту аудиозапись на русском языке. Верни только текст, без лишних комментариев.",
          },
        ],
      },
    });
    return response.text || "";
  } catch (error) {
    console.error("Transcription Failed:", error);
    throw new Error("Не удалось распознать голос.");
  }
};

// Generate speech from text (TTS)
export const generateSpeech = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: {
        parts: [{ text: text }],
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { 
              voiceName: 'Charon' // Deep male voice
            },
          },
        },
      },
    });

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioData) {
      throw new Error("No audio data generated");
    }
    return audioData;
  } catch (error) {
    console.error("TTS Failed:", error);
    throw new Error("Не удалось озвучить толкование.");
  }
};