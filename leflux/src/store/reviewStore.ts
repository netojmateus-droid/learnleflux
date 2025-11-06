import { create } from 'zustand';
import { VocabEntry } from '@/types';
import { useVocabStore } from './vocabStore';
import { applySRS } from '@/lib/srs';

export interface ReviewResult {
  entryId: string;
  term: string;
  response: 0 | 1 | 2;
  userSentence?: string;
  timestamp: number;
}

interface ReviewState {
  session: VocabEntry[];
  currentIndex: number;
  startSession: (count: number) => void;
  answer: (response: 0 | 1 | 2, userSentence?: string) => void;
  isComplete: boolean;
  results: ReviewResult[];
  reset: () => void;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  session: [],
  currentIndex: 0,
  isComplete: false,
  results: [],
  startSession: (count) => {
    const due = useVocabStore.getState().getDueVocab().slice(0, count);
    set({ session: due, currentIndex: 0, isComplete: due.length === 0, results: [] });
  },
  answer: (response, userSentence) => {
    const { session, currentIndex } = get();
    const current = session[currentIndex];
    if (!current) return;

    const newSRS = applySRS(current.srs, response);
    useVocabStore.getState().updateVocab(current.id, {
      srs: newSRS,
      userSentences: userSentence ? [...current.userSentences, userSentence] : current.userSentences,
    });

    set((state) => ({
      results: [
        ...state.results,
        {
          entryId: current.id,
          term: current.term,
          response,
          userSentence,
          timestamp: Date.now(),
        },
      ],
    }));

    if (currentIndex + 1 >= session.length) {
      set({ isComplete: true });
    } else {
      set({ currentIndex: currentIndex + 1 });
    }
  },
  reset: () => set({ session: [], currentIndex: 0, isComplete: false, results: [] }),
}));