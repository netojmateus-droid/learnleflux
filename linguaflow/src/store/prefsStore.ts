
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserPrefs } from '@/types';
import { idbStorage } from '@/lib/db';

interface PrefsState {
  prefs: UserPrefs;
  setTheme: (theme: UserPrefs['theme']) => void;
  setFontSize: (size: number) => void;
  setLineHeight: (height: number) => void;
  setAmbientSound: (sound: UserPrefs['ambientSound']) => void;
  setTargetLang: (lang: string) => void;
}

const defaultPrefs: UserPrefs = {
  theme: 'dark',
  targetLang: 'en',
  fontSize: 100, // as percentage
  lineHeight: 1.6,
  ambientSound: 'none',
};

export const usePrefsStore = create<PrefsState>()(
  persist(
    (set) => ({
      prefs: defaultPrefs,
      setTheme: (theme) => set((state) => ({ prefs: { ...state.prefs, theme } })),
      setFontSize: (size) => set((state) => ({ prefs: { ...state.prefs, fontSize: size } })),
      setLineHeight: (height) => set((state) => ({ prefs: { ...state.prefs, lineHeight: height } })),
      setAmbientSound: (sound) => set((state) => ({ prefs: { ...state.prefs, ambientSound: sound } })),
      setTargetLang: (lang) => set((state) => ({ prefs: { ...state.prefs, targetLang: lang } })),
    }),
    {
      name: 'preferences-storage',
      storage: idbStorage,
      onRehydrateStorage: () => (state) => {
        if (state) {
            // Apply theme on load
            const { theme } = state.prefs;
            if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
      }
    }
  )
);
   