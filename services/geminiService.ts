
import { AnalysisResponse } from '../types';

// Hardcoded key provided by user. We sanitize it to remove any potential invisible characters.
const RAW_KEY = "AIzaSyDfWDUYQ8slCkCCoK1aYejCxbjhHPF1IzI";
const API_KEY = RAW_KEY.trim();

export const analyzeSituation = async (userSituation: string): Promise<AnalysisResponse> => {
  // 1. Prepare Deep Analytical Prompt (Jungian Approach)
  const promptText = `
    Role: You are a wise Jungian Psychoanalyst and Grand Tarot Master.
    User Situation: "${userSituation}"

    Task:
    1. **Archetypal Diagnosis**: Identify the underlying archetype and emotional state active in the user's situation (e.g., The Hero's Journey, The Dark Night of the Soul, The Conflict of Duality).
    2. **Card Selection**: Select the ONE Major Arcana card (ID 0-21) that best represents the *key to resolving* or *understanding* this situation.
    3. **Psychological Portrait**: Compose a profound, empathetic, and structured interpretation in Russian.

    Required Interpretation Structure (Use Markdown):
    - **Архетип Момента**: Analyze the current psychological landscape. Why is this happening now?
    - **Тень и Скрытое**: Reveal subconscious fears or hidden motives that the user might not see.
    - **Мудрость Таро**: Concrete, spiritual, and psychological advice for integration and growth.

    Tone: Mystical, profound, soothing, yet strictly professional. Avoid generic "fortune cookie" style.
    Language: Russian.
    
    Output Format: return ONLY a raw JSON object (no markdown code blocks).
    {
      "cardId": number,
      "interpretation": "string with markdown formatting"
    }
  `;

  // 2. Construct URL safely using URL object to avoid query param errors
  const baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
  const url = new URL(baseUrl);
  url.searchParams.append("key", API_KEY);

  const requestBody = {
    contents: [{ parts: [{ text: promptText }] }],
    generationConfig: {
      temperature: 0.7, // Add some creativity for better interpretations
    }
  };

  try {
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody),
      referrerPolicy: 'no-referrer'
    });

    if (!response.ok) {
      const errBody = await response.text();
      let errorDetails = response.statusText;
      try {
         const jsonErr = JSON.parse(errBody);
         if (jsonErr.error && jsonErr.error.message) {
            errorDetails = jsonErr.error.message;
         }
      } catch (e) { /* ignore parse error */ }
      
      console.error("API Error:", errBody);
      throw new Error(`Ошибка Эфира (${response.status}): ${errorDetails}`);
    }

    const data = await response.json();
    let textPart = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textPart) throw new Error("Эфир молчит (пустой ответ).");

    // 3. Clean and Parse Response
    // Remove markdown code blocks if present
    textPart = textPart.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Sanitize common JSON errors (like trailing commas if AI hallucinates them)
    // For now, standard parse is usually enough with Gemini 1.5
    const result = JSON.parse(textPart) as AnalysisResponse;

    // Validate ID
    if (typeof result.cardId !== 'number' || result.cardId < 0 || result.cardId > 21) {
       // Fallback if AI hallucinates an ID outside range (rare but possible)
       console.warn("Invalid ID received, defaulting to Fool (0)");
       result.cardId = 0;
    }

    return result;

  } catch (error) {
    console.error("AI Analysis Failed:", error);
    throw error;
  }
};
