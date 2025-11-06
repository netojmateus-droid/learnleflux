export interface TextItem {
  id: string;
  title: string;
  lang: string;
  content: string;
  coverUrl?: string;
  progress: number;
  createdAt: number;
  updatedAt: number;
}

export interface SrsState {
  ease: number;
  interval: number;
  nextReview: number;
  correctStreak: number;
  reviews: number;
  produced: number;
  stage: 'new' | 'learning' | 'mastered';
}

export interface VocabEntry {
  id: string;
  term: string;
  lang: string;
  definition?: string;
  translation?: string;
  examples: string[];
  audioUrl?: string;
  imageUrl?: string;
  userSentences: string[];
  srs: SrsState;
  createdAt: number;
  updatedAt: number;
}

export interface UserPrefs {
  theme: 'auto' | 'dark' | 'light';
  targetLang: string;
  fontSize: number;
  lineHeight: number;
  ambientSound: 'none' | 'rain' | 'library' | 'nature';
}

export interface AuthProfile {
  id: string;
  name: string;
  email: string;
  picture?: string;
  accessToken: string;
  expiresAt: number;
}