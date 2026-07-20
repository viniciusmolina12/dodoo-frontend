import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type AuthUser } from '@/lib/api/auth';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  _hasHydrated: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
  setHasHydrated: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:           null,
      token:          null,
      _hasHydrated:   false,
      setAuth:        (token, user) => set({ token, user }),
      clearAuth:      ()            => set({ token: null, user: null }),
      setHasHydrated: (v)           => set({ _hasHydrated: v }),
    }),
    {
      name: 'dodoo-auth',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
