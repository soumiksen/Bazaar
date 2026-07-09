import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthResponse, UserSummary } from '@/app/lib/api';

interface AuthState {
  user: UserSummary | null;
  accessToken: string | null;
  refreshToken: string | null;
  hasHydrated: boolean;
  setSession: (auth: AuthResponse) => void;
  clearSession: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      hasHydrated: false,
      setSession: (auth) =>
        set({
          user: auth.user,
          accessToken: auth.accessToken,
          refreshToken: auth.refreshToken,
        }),
      clearSession: () => set({ user: null, accessToken: null, refreshToken: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'bazaar-auth',
      skipHydration: true,
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export const selectIsAuthenticated = (state: AuthState) => state.user !== null;
