import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type AuthUser } from '@/lib/api/auth';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:      null,
      token:     null,
      setAuth:   (token, user) => set({ token, user }),
      clearAuth: ()            => set({ token: null, user: null }),
    }),
    { name: 'dodoo-auth' },
  ),
);
