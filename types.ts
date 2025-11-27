export interface AnalysisResponse {
  cardName: string;
  interpretation: string;
  imageUrl: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}