'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/store/authStore';

/**
 * Redirects away from vendor-only routes unless the signed-in user has the
 * VENDOR role. Returns true while the caller should hold off rendering,
 * either because hydration hasn't finished yet or because a redirect is
 * in flight.
 */
export function useRequireVendor(redirectTo: string = '/vendor/signin'): boolean {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const user = useAuthStore((state) => state.user);
  const isVendor = user?.role === 'VENDOR';

  useEffect(() => {
    if (hasHydrated && !isVendor) {
      router.replace(redirectTo);
    }
  }, [hasHydrated, isVendor, router, redirectTo]);

  return !hasHydrated || !isVendor;
}
