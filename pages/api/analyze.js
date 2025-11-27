import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;

  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(500).json({ error: 'OPENROUTER_API_KEY not configured' });
  }

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
          content: text
        }
      ]
    });

    const rawContent = completion.choices[0].message.content;
    // Clean markdown if present to ensure JSON parsing works
    const jsonString = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let aiResponse;
    try {
        aiResponse = JSON.parse(jsonString);
    } catch (e) {
        console.error("JSON Parse Error:", e);
        // Fallback or retry logic could go here
        throw new Error("Failed to parse AI response");
    }

    const imageUrl = 'https://image.pollinations.ai/prompt/' + encodeURIComponent(aiResponse.image_prompt);

    res.status(200).json({
      interpretation: aiResponse.interpretation,
      card_name: aiResponse.card_name,
      imageUrl: imageUrl
    });

  } catch (error) {
    console.error("OpenRouter Error:", error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}