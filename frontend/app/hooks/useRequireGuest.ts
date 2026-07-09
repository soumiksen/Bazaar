'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, selectIsAuthenticated } from '@/app/store/authStore';

/**
 * Redirects an already-authenticated user away from guest-only routes
 * (sign in / sign up). Returns true while the caller should hold off
 * rendering the form, either because hydration hasn't finished yet or
 * because a redirect is in flight.
 */
export function useRequireGuest(redirectTo: string = '/'): boolean {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [hasHydrated, isAuthenticated, router, redirectTo]);

  return !hasHydrated || isAuthenticated;
}
