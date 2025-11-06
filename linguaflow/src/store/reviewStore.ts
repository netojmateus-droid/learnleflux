
import { create } from 'zustand';
import { VocabEntry } from '@/types';
import { useVocabStore } from './vocabStore';
import { updateSrsState } from '@/lib/srs';

interface ReviewState {
  reviewQueue: VocabEntry[];
  currentCardIndex: number;
  sessionCompleted: boolean;
  startReviewSession: () => void;
  answerCard: (id: string, rating: 0 | 1 | 2) => void;
  endReviewSession: () => void;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviewQueue: [],
  currentCardIndex: 0,
  sessionCompleted: false,
  startReviewSession: () => {
    const allVocab = useVocabStore.getState().vocabulary;
    const now = Date.now();
    
    const dueVocab = allVocab
      .filter(v => v.srs.nextReview <= now)
      .sort((a, b) => a.srs.nextReview - b.srs.nextReview)
      .slice(0, 20); // Max 20 cards per session

    set({ reviewQueue: dueVocab, currentCardIndex: 0, sessionCompleted: false });
  },
  answerCard: (id, rating) => {
    const { reviewQueue, currentCardIndex } = get();
    const card = reviewQueue[currentCardIndex];
    if (card && card.id === id) {
      const newSrsState = updateSrsState(card.srs, rating);
      useVocabStore.getState().updateSrs(id, newSrsState);

      const nextIndex = currentCardIndex + 1;
      if (nextIndex >= reviewQueue.length) {
        set({ sessionCompleted: true, currentCardIndex: nextIndex });
      } else {
        set({ currentCardIndex: nextIndex });
      }
    }
  },
  endReviewSession: () => {
    set({ reviewQueue: [], currentCardIndex: 0, sessionCompleted: false });
  },
}));
   