
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VocabEntry, SrsState } from '@/types';
import { idbStorage } from '@/lib/db';
import { createNewSrsState } from '@/lib/srs';
import { nanoid } from 'nanoid';

interface VocabState {
  vocabulary: VocabEntry[];
  addVocab: (entry: Omit<VocabEntry, 'id' | 'srs' | 'createdAt' | 'updatedAt' | 'userSentences'>) => void;
  updateVocab: (id: string, updates: Partial<VocabEntry>) => void;
  updateSrs: (id: string, srs: SrsState) => void;
  removeVocab: (id: string) => void;
  getVocabByTerm: (term: string, lang: string) => VocabEntry | undefined;
}

export const useVocabStore = create<VocabState>()(
  persist(
    (set, get) => ({
      vocabulary: [],
      addVocab: (entry) => {
        const now = Date.now();
        const newVocab: VocabEntry = {
          ...entry,
          id: nanoid(),
          srs: createNewSrsState(),
          createdAt: now,
          updatedAt: now,
          userSentences: [],
        };
        set((state) => ({ vocabulary: [...state.vocabulary, newVocab] }));
      },
      updateVocab: (id, updates) => {
        set((state) => ({
          vocabulary: state.vocabulary.map((entry) =>
            entry.id === id ? { ...entry, ...updates, updatedAt: Date.now() } : entry
          ),
        }));
      },
      updateSrs: (id, srs) => {
         set((state) => ({
          vocabulary: state.vocabulary.map((entry) =>
            entry.id === id ? { ...entry, srs, updatedAt: Date.now() } : entry
          ),
        }));
      },
      removeVocab: (id) => {
        set((state) => ({
          vocabulary: state.vocabulary.filter((entry) => entry.id !== id),
        }));
      },
      getVocabByTerm: (term: string, lang: string) => {
        return get().vocabulary.find(v => v.term.toLowerCase() === term.toLowerCase() && v.lang === lang);
      },
    }),
    {
      name: 'vocabulary-storage',
      storage: idbStorage,
    }
  )
);
   