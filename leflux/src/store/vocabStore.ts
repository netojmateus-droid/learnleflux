import { create } from 'zustand';
import { VocabEntry } from '@/types';
import { db } from '@/lib/db/indexeddb';
import { initialSrsState } from '@/lib/srs';

interface VocabState {
  vocab: VocabEntry[];
  isLoading: boolean;
  error?: string;
  addVocab: (vocab: Omit<VocabEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateVocab: (id: string, updates: Partial<VocabEntry>) => void;
  deleteVocab: (id: string) => void;
  getVocab: (id: string) => VocabEntry | undefined;
  getDueVocab: () => VocabEntry[];
  hydrate: () => Promise<void>;
}

export const useVocabStore = create<VocabState>((set, get) => {
  const hydrate = async () => {
    try {
      set({ isLoading: true, error: undefined });
      const entries = await db.getAllVocab();
      set({ vocab: entries, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load vocabulary', isLoading: false });
    }
  };

  void hydrate();

  return {
    vocab: [],
    isLoading: true,
    error: undefined,
    addVocab: (vocab) => {
      const now = Date.now();
      const newVocab: VocabEntry = {
        ...vocab,
        srs: vocab.srs ?? initialSrsState(),
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };
      set((state) => ({ vocab: [...state.vocab, newVocab] }));
      void db.putVocab(newVocab);
    },
    updateVocab: (id, updates) => {
      set((state) => {
        const next = state.vocab.map((entry) =>
          entry.id === id
            ? { ...entry, ...updates, updatedAt: Date.now() }
            : entry
        );
        const updated = next.find((entry) => entry.id === id);
        if (updated) void db.putVocab(updated);
        return { vocab: next };
      });
    },
    deleteVocab: (id) => {
      set((state) => ({ vocab: state.vocab.filter((entry) => entry.id !== id) }));
      void db.deleteVocab(id);
    },
    getVocab: (id) => get().vocab.find((entry) => entry.id === id),
    getDueVocab: () => get().vocab.filter((entry) => entry.srs.nextReview <= Date.now()),
    hydrate,
  };
});