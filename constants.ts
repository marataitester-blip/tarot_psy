import { TarotCard } from './types';

export const CARD_BACK_URL = "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/rubashka.png";

export const MAJOR_ARCANA: TarotCard[] = [
  { 
    id: 0, 
    name: "Шут", 
    imageUrl: "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/00_fool.png",
    archetype: "Дитя", 
    psychological: "Новые начинания, спонтанность, невинность, прыжок веры." 
  },
  { 
    id: 1, 
    name: "Маг", 
    imageUrl: "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/01_magician.png",
    archetype: "Творец", 
    psychological: "Сила воли, мастерство, концентрация, манифестация." 
  },
  { 
    id: 2, 
    name: "Верховная Жрица", 
    imageUrl: "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/02_high_priestess.png",
    archetype: "Анима", 
    psychological: "Интуиция, подсознание, тайна, внутренний голос." 
  },
  { 
    id: 3, 
    name: "Императрица", 
    imageUrl: "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/03_empress.png",
    archetype: "Мать", 
    psychological: "Плодородие, забота, изобилие, связь с природой." 
  },
  { 
    id: 4, 
    name: "Император", 
    imageUrl: "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/04_emperor.png",
    archetype: "Отец", 
    psychological: "Власть, структура, контроль, отцовство." 
  },
  { 
    id: 5, 
    name: "Иерофант", 
    imageUrl: "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/05_hierophant.png",
    archetype: "Наставник", 
    psychological: "Традиция, конформизм, мораль, этика." 
  },
  { 
    id: 6, 
    name: "Влюбленные", 
    imageUrl: "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/06_lovers.png",
    archetype: "Союз", 
    psychological: "Любовь, союз, отношения, согласование ценностей, выбор." 
  },
  { 
    id: 7, 
    name: "Колесница", 
    imageUrl: "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/07_chariot.png",
    archetype: "Воин", 
    psychological: "Контроль, сила воли, победа, самоутверждение, решимость." 
  },
  { 
    id: 8, 
    name: "Сила", 
    imageUrl: "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/08_justice.png", // Note: File name mismatch in provided list vs traditional numbering (Justice/Strength swap is common in decks). Adjusted based on filename provided for 08.
    archetype: "Герой", 
    psychological: "Мужество, убеждение, влияние, сострадание." 
  },
  { 
    id: 9, 
    name: "Отшельник", 
    imageUrl: "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/09_hermit.png",
    archetype: "Мудрец", 
    psychological: "Интроспекция, одиночество, внутреннее руководство, поиск истины." 
  },
  { 
    id: 10, 
    name: "Колесо Фортуны", 
    imageUrl: "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/10_wheel_of_fortune.png",
    archetype: "Судьба", 
    psychological: "Циклы, карма, судьба, переломные моменты." 
  },
  { 
    id: 11, 
    name: "Справедливость", 
    imageUrl: "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/11_strength.png", // Note: Swapped to match filenames provided (11_strength)
    archetype: "Судья", 
    psychological: "Справедливость, честность, истина, причина и следствие, закон." 
  },
  { 
    id: 12, 
    name: "Повешенный", 
    imageUrl: "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/12_hanged_man.png",
    archetype: "Мученик", 
    psychological: "Смирение, отпускание, новая перспектива, жертва." 
  },
  { 
    id: 13, 
    name: "Смерть", 
    imageUrl: "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/13_death.png",
    archetype: "Перерождение", 
    psychological: "Окончания, перемены, трансформация, переход." 
  },
  { 
    id: 14, 
    name: "Умеренность", 
    imageUrl: "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/14_temperance.png",
    archetype: "Алхимик", 
    psychological: "Баланс, модерация, терпение, цель." 
  },
  { 
    id: 15, 
    name: "Дьявол", 
    imageUrl: "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/15_devil.png",
    archetype: "Тень", 
    psychological: "Теневая сторона, привязанность, зависимость, ограничение, сексуальность." 
  },
  { 
    id: 16, 
    name: "Башня", 
    imageUrl: "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/16_tower.png",
    archetype: "Разрушитель", 
    psychological: "Внезапные перемены, потрясение, хаос, откровение, пробуждение." 
  },
  { 
    id: 17, 
    name: "Звезда", 
    imageUrl: "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/17_star.png",
    archetype: "Надежда", 
    psychological: "Надежда, вера, цель, обновление, духовность." 
  },
  { 
    id: 18, 
    name: "Луна", 
    imageUrl: "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/18_moon.png",
    archetype: "Мечтатель", 
    psychological: "Иллюзия, страх, тревога, подсознание, сны." 
  },
  { 
    id: 19, 
    name: "Солнце", 
    imageUrl: "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/19_sun.png",
    archetype: "Сияющее Дитя", 
    psychological: "Позитив, веселье, тепло, успех, жизненная сила." 
  },
  { 
    id: 20, 
    name: "Страшный Суд", 
    imageUrl: "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/20_judgement.png",
    archetype: "Возрождение", 
    psychological: "Суждение, возрождение, внутренний призыв, отпущение грехов." 
  },
  { 
    id: 21, 
    name: "Мир", 
    imageUrl: "https://cdn.jsdelivr.net/gh/marataitester-blip/tarot/21_world.png",
    archetype: "Самость", 
    psychological: "Завершение, интеграция, достижение, путешествие." 
  },
];