
import { AnalysisResponse } from '../types';

// Fallback key provided by user (Hardcoded for maximum reliability)
const API_KEY_VALUE = "AIzaSyDfWDUYQ8slCkCCoK1aYejCxbjhHPF1IzI";

export const analyzeSituation = async (userSituation: string): Promise<AnalysisResponse> => {
  // 1. Prepare Deep Analytical Prompt
  // We ask the AI to act as a Jungian Psychoanalyst and Tarot Master
  const promptText = `
    Role: You are an expert Jungian Psychoanalyst and Grand Tarot Master.
    User Context: "${userSituation}"
    
    Task:
    1. Deeply analyze the user's text. Look beyond the surface words to identify the subconscious emotional state, hidden conflicts, and the active archetype.
    2. Select the ONE Major Arcana card (ID 0-21) that perfectly resonates with this psychological state.
    3. Write a profound, structured psychological portrait in Russian.
    
    Structure of Interpretation (Use Markdown for formatting, but NO code blocks):
    - **Зеркало Ситуации**: How this card reflects the current reality and the user's conscious state.
    - **Тень и Скрытое**: What is being repressed? What is the "Shadow" aspect here? (Deep psychological insight).
    - **Путь Интеграции**: Concrete, spiritual, or psychological advice on how to move forward.

    Tone: Mystical, empathetic, profound, serious (avoid casual tone).
    Language: Russian.
    
    Output Format: ONLY raw JSON. Do not wrap in markdown code blocks.
    {
      "cardId": number,
      "interpretation": "markdown string with paragraphs"
    }
  `;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY_VALUE}`;

  const requestBody = {
    contents: [{ parts: [{ text: promptText }] }]
  };

  try {
    // 2. Attempt API Call
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      referrerPolicy: 'no-referrer'
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error("API Error Body:", errBody);
      throw new Error(`Ошибка связи с Эфиром: ${response.status}`);
    }

    const data = await response.json();
    let textPart = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textPart) throw new Error("Эфир молчит (пустой ответ).");

    // 3. Clean and Parse Response
    // Remove markdown code blocks if present (`json ... `)
    textPart = textPart.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const result = JSON.parse(textPart) as AnalysisResponse;

    // Validate ID
    if (typeof result.cardId !== 'number' || result.cardId < 0 || result.cardId > 21) {
       throw new Error(`Некорректный ответ Оракула (ID: ${result.cardId})`);
    }

    return result;

  } catch (error) {
    console.error("AI Analysis Failed:", error);
    throw error; // Propagate error to UI. No fake fallbacks.
  }
};
