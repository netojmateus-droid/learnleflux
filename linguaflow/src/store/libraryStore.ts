
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TextItem } from '@/types';
import { idbStorage } from '@/lib/db';
import { nanoid } from 'nanoid';

interface LibraryState {
  texts: TextItem[];
  addText: (text: Omit<TextItem, 'id' | 'createdAt' | 'updatedAt' | 'lastRead'>) => void;
  updateText: (id: string, updates: Partial<TextItem>) => void;
  removeText: (id: string) => void;
  getTextById: (id: string) => TextItem | undefined;
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      texts: [],
      addText: (text) => {
        const now = Date.now();
        const newText: TextItem = {
          ...text,
          id: nanoid(),
          createdAt: now,
          updatedAt: now,
          lastRead: now,
        };
        set((state) => ({ texts: [...state.texts, newText] }));
      },
      updateText: (id, updates) => {
        set((state) => ({
          texts: state.texts.map((text) =>
            text.id === id ? { ...text, ...updates, updatedAt: Date.now() } : text
          ),
        }));
      },
      removeText: (id) => {
        set((state) => ({
          texts: state.texts.filter((text) => text.id !== id),
        }));
      },
      getTextById: (id: string) => {
        return get().texts.find(text => text.id === id);
      },
    }),
    {
      name: 'texts-storage',
      storage: idbStorage,
    }
  )
);
   