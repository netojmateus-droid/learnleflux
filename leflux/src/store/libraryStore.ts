import { create } from 'zustand';
import { TextItem } from '@/types';
import { db } from '@/lib/db/indexeddb';

interface LibraryState {
  texts: TextItem[];
  isLoading: boolean;
  error?: string;
  addText: (text: Omit<TextItem, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateText: (id: string, updates: Partial<TextItem>) => void;
  deleteText: (id: string) => void;
  getText: (id: string) => TextItem | undefined;
  hydrate: () => Promise<void>;
}

export const useLibraryStore = create<LibraryState>((set, get) => {
  const hydrate = async () => {
    try {
      set({ isLoading: true, error: undefined });
      const texts = await db.getAllTexts();
      set({ texts, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load texts', isLoading: false });
    }
  };

  void hydrate();

  return {
    texts: [],
    isLoading: true,
    error: undefined,
    addText: (text) => {
      const newText: TextItem = {
        ...text,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      set((state) => ({ texts: [...state.texts, newText] }));
      void db.putText(newText);
      return newText.id;
    },
    updateText: (id, updates) => {
      set((state) => {
        const next = state.texts.map((t) =>
          t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t
        );
        const updated = next.find((t) => t.id === id);
        if (updated) void db.putText(updated);
        return { texts: next };
      });
    },
    deleteText: (id) => {
      set((state) => ({ texts: state.texts.filter((t) => t.id !== id) }));
      void db.deleteText(id);
    },
    getText: (id) => get().texts.find((t) => t.id === id),
    hydrate,
  };
});