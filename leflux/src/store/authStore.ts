import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthProfile } from '@/types';

interface AuthState {
  user?: AuthProfile;
  isAuthenticated: boolean;
  setUser: (profile: AuthProfile) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: undefined,
      isAuthenticated: false,
      setUser: (profile) => set({ user: profile, isAuthenticated: true }),
      signOut: () => set({ user: undefined, isAuthenticated: false }),
    }),
    {
      name: 'leflux-auth',
      version: 1,
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
