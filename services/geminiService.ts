
import { MAJOR_ARCANA, OFFLINE_INTERPRETATIONS } from '../constants';
import { AnalysisResponse } from '../types';

// Fallback key provided by user (Hardcoded for maximum reliability as requested)
const API_KEY_VALUE = "AIzaSyDfWDUYQ8slCkCCoK1aYejCxbjhHPF1IzI";

// --- LOCAL ORACLE (FALLBACK) ---
// Deterministic algorithm to select a card based on text resonance
const consultLocalOracle = (text: string): AnalysisResponse => {
  console.log("⚠️ Connecting to Ether (Local Fallback Mode)...");
  
  // Simple hash function to turn text into a number
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  
  // Map hash to card ID (0-21)
  const cardId = Math.abs(hash) % 22;
  const interpretation = OFFLINE_INTERPRETATIONS[cardId];

  return {
    cardId,
    interpretation: interpretation || "Тайны вселенной пока скрыты. Попробуйте сосредоточиться и спросить снова."
  };
};

export const analyzeSituation = async (userSituation: string): Promise<AnalysisResponse> => {
  // 1. Prepare API Request
  const promptText = `
    You are a Tarot Reader.
    User Situation: "${userSituation}"
    
    Task: Pick one Major Arcana card (ID 0-21) that fits best. Write a psychological interpretation in Russian.
    
    Return ONLY raw JSON:
    {
      "cardId": number,
      "interpretation": "string"
    }
  `;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY_VALUE}`;

  const requestBody = {
    contents: [{ parts: [{ text: promptText }] }]
    // Note: Removed 'responseMimeType: application/json' to avoid 400 errors on some model versions/contexts. 
    // We will parse the text manually.
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
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    let textPart = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textPart) throw new Error("Empty AI response");

    // 3. Clean and Parse Response
    // Remove markdown code blocks if present
    textPart = textPart.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const result = JSON.parse(textPart) as AnalysisResponse;

    // Validate ID
    if (typeof result.cardId !== 'number' || result.cardId < 0 || result.cardId > 21) {
       throw new Error("Invalid Card ID from AI");
    }

    return result;

  } catch (error) {
    console.error("🔮 AI Link Failed. Switching to Local Oracle.", error);
    // 4. RADICAL FALLBACK: If ANYTHING fails, use Local Oracle.
    return consultLocalOracle(userSituation);
  }
};
