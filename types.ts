export interface AnalysisFormData {
  industry: string;
  tech: string;
  market: string;
  attachment: File | null;
}

export interface StockInfo {
  name: string;
  symbol: string;
  price?: string;
  reason: string;
}

export interface MatrixData {
  dimensions: string[];
  companies: {
    name: string;
    scores: number[]; // 1-10 scale
  }[];
}

export interface AnalysisResult {
  markdownContent: string;
  identifiedStocks: StockInfo[];
  matrixData?: MatrixData;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
}
