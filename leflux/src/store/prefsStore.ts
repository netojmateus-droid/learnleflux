import { create } from 'zustand';
import { UserPrefs } from '@/types';
import { db } from '@/lib/db/indexeddb';

const defaultPrefs: UserPrefs = {
  theme: 'dark',
  targetLang: 'en',
  fontSize: 16,
  lineHeight: 1.6,
  ambientSound: 'none',
};

interface PrefsState {
  prefs: UserPrefs;
  updatePrefs: (updates: Partial<UserPrefs>) => void;
  hydrate: () => Promise<void>;
  isLoading: boolean;
  error?: string;
}

export const usePrefsStore = create<PrefsState>((set, get) => {
  const hydrate = async () => {
    try {
      set({ isLoading: true, error: undefined });
      const stored = await db.getPrefs();
      set({ prefs: stored ?? defaultPrefs, isLoading: false });
    } catch (error) {
      set({ prefs: defaultPrefs, isLoading: false, error: error instanceof Error ? error.message : 'Failed to load preferences' });
    }
  };

  void hydrate();

  return {
    prefs: defaultPrefs,
    isLoading: true,
    error: undefined,
    updatePrefs: (updates) => {
      const next = { ...get().prefs, ...updates };
      set({ prefs: next });
      void db.putPrefs(next);
    },
    hydrate,
  };
});