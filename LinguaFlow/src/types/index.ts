export interface TextItem {
  id: string;
  title: string;
  lang: string;          // detectado
  content: string;       // texto plano extraído
  coverUrl?: string;     // imagem contextual
  progress: number;      // 0..1
  createdAt: number;
  updatedAt: number;
}

export interface SrsState {
  ease: number;          // default 2.3
  interval: number;      // dias
  nextReview: number;    // timestamp
  correctStreak: number;
  reviews: number;
  produced: number;      // frases do usuário
  stage: 'new' | 'learning' | 'mastered';
}

export interface VocabEntry {
  id: string;
  term: string;
  lang: string;
  definition?: string;
  translation?: string;
  examples: string[];
  audioUrl?: string;     // opcional (cacheado)
  imageUrl?: string;     // Unsplash source
  userSentences: string[];
  srs: SrsState;
  createdAt: number;
  updatedAt: number;
}

export interface UserPrefs {
  theme: 'auto'|'dark'|'light';
  targetLang: string;
  fontSize: number;      // px relativos
  lineHeight: number;    // 1.4–1.8
  ambientSound: 'none'|'rain'|'library'|'nature';
}
