import OpenAI from 'openai';
import { AnalysisResponse } from '../types';

// NOTE: In a real Next.js production app, you should call the /api/analyze endpoint.
// For this preview environment, we are calling OpenRouter directly from the client.

// Using a public key for demo or process.env if available. 
// Ideally, set NEXT_PUBLIC_OPENROUTER_API_KEY in Vercel.
const API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY || "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"; 

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true // Required for client-side execution
});

export const analyzeSituation = async (userSituation: string): Promise<AnalysisResponse> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3-8b-instruct:free",
      messages: [
        {
          role: "system",
          content: 'Ты — экзистенциальный психолог и эксперт по юнгианскому анализу. Ты используешь Таро не для гадания, а как проективную систему архетипов для работы с подсознанием. Твоя цель: проанализировать запрос клиента и подобрать карту-архетип, которая лучше всего отражает его состояние. Тон ответа: глубокий, аналитический, поддерживающий, без эзотерической "воды" (порча, магия), но с использованием понятий: Тень, Персона, Самость, Бессознательное, Путь Героя. Верни ответ СТРОГО в формате JSON: { "card_name": "Название карты (на русском)", "interpretation": "Психологический разбор ситуации через призму этого архетипа (3-4 предложения). Дай инсайт, а не прогноз.", "image_prompt": "Описание для генерации картинки на английском: Surrealism, abstract art showing [Symbol of Card] merged with human silhouette, psychological depth, dark background, gold accents, cinematic lighting, 8k" }'
        },
        {
          role: "user",
          content: userSituation
        }
      ]
    });

    const rawContent = completion.choices[0].message.content;
    
    if (!rawContent) throw new Error("Empty response from AI");

    // Clean markdown
    const jsonString = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let aiResponse;
    try {
        aiResponse = JSON.parse(jsonString);
    } catch (e) {
        console.error("JSON Parsing failed:", rawContent);
        throw new Error("Не удалось обработать ответ Оракула.");
    }

    const imageUrl = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(aiResponse.image_prompt);

    return {
      cardName: aiResponse.card_name,
      interpretation: aiResponse.interpretation,
      imageUrl: imageUrl
    };

  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
};