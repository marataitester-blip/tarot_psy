// pages/api/analyze.ts
export const config = {
  runtime: 'edge', // Самый быстрый и надежный режим
};

export default async function handler(req: Request) {
  // 1. CORS (Чтобы фронтенд мог достучаться)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    // 2. Проверка ключа
    const API_KEY = process.env.OPENROUTER_API_KEY;
    if (!API_KEY) {
      throw new Error("Ключ API не найден в настройках Vercel");
    }

    const { userRequest } = await req.json();

    // 3. Запрос к OpenRouter (Llama 3 Free)
    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://mirmag.app",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct:free",
        messages: [
          {
            role: "system",
            content: "Ты — экзистенциальный психолог и эксперт по Таро. Твоя задача — вернуть ответ СТРОГО в формате JSON. Структура: { \"card_name\": \"Название карты (RU)\", \"interpretation\": \"Психологический инсайт (RU, 2-3 предложения)\", \"image_prompt\": \"Surrealism, abstract tarot card describing the situation (EN)\" }."
          },
          {
            role: "user",
            content: userRequest || "Общий анализ"
          }
        ]
      })
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      throw new Error(`Ошибка OpenRouter: ${aiResponse.status} - ${errText}`);
    }

    const aiData = await aiResponse.json();
    const rawContent = aiData.choices[0].message.content;

    // 4. Очистка JSON
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("ИИ вернул мусор вместо JSON: " + rawContent);
    
    const result = JSON.parse(jsonMatch[0]);

    // 5. Генерация ссылки Pollinations
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(result.image_prompt + " tarot style, dark gold, 8k")}`;

    return new Response(JSON.stringify({
      card_name: result.card_name,
      interpretation: result.interpretation,
      imageUrl: imageUrl
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
