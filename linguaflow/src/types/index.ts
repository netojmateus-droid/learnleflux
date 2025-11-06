
export interface Caption {
    text: string;
    start: number; // in milliseconds
    end: number; // in milliseconds
}

export interface TextItem {
  id: string;
  title: string;
  lang: string;
  // For text, content is the full string.
  // For video, content is a JSON string of Caption[].
  content: string; 
  type: 'text' | 'video';
  videoId?: string;
  progress: number; // 0..1 for text, seconds for video
  createdAt: number;
  updatedAt: number;
  wordCount: number;
  lastRead: number;
}

export interface SrsState {
  ease: number;
  interval: number; // days
  nextReview: number; // timestamp
  correctStreak: number;
  reviews: number;
  produced: number; // user sentences
  stage: 'new' | 'learning' | 'mastered';
}

export interface VocabEntry {
  id: string;
  term: string;
  lang: string;
  definition?: string;
  translation?: string;
  examples: string[];
  audioUrl?: string; // for caching tts
  imageUrl?: string;
  userSentences: string[];
  srs: SrsState;
  createdAt: number;
  updatedAt: number;
}

export interface UserPrefs {
  theme: 'auto' | 'dark' | 'light';
  targetLang: string;
  fontSize: number; // percentage
  lineHeight: number; // 1.4-1.8
  ambientSound: 'none' | 'rain' | 'library' | 'nature';
}