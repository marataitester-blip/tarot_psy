// services/geminiService.ts

// Этот интерфейс описывает, что мы ждем от сервера
export interface TarotResponse {
  card_name: string;
  interpretation: string;
  imageUrl: string;
}

// Функция-курьер. Она ничего не считает сама, она стучится на сервер.
export const analyzeUserRequest = async (userRequest: string): Promise<TarotResponse> => {
  try {
    // Мы стучимся в наш собственный бэкенд, который создали в pages/api/analyze.ts
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userRequest }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Ошибка сервера: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Ошибка при запросе к Оракулу:", error);
    throw error;
  }
};
