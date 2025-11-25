export interface TarotCard {
  id: number;
  name: string;
  archetype: string;
  psychological: string;
  imageUrl: string; // Direct URL to the image
}

export interface AnalysisResponse {
  cardId: number;
  interpretation: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}