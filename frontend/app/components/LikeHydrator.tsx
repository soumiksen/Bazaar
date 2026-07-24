'use client';

import { useEffect } from 'react';
import { useAuthStore, selectIsAuthenticated } from '@/app/store/authStore';
import { useLikeStore } from '@/app/store/likeStore';
import { getLikes } from '@/app/lib/api';

export default function LikeHydrator() {
  const hasAuthHydrated = useAuthStore((state) => state.hasHydrated);
  const isLoggedIn = useAuthStore(selectIsAuthenticated);
  const setLikes = useLikeStore((state) => state.setLikes);
  const clearLikes = useLikeStore((state) => state.clearLikes);

  useEffect(() => {
    if (!hasAuthHydrated) return;

    if (!isLoggedIn) {
      clearLikes();
      return;
    }

    getLikes()
      .then(setLikes)
      .catch(() => clearLikes());
  }, [hasAuthHydrated, isLoggedIn, setLikes, clearLikes]);

  return null;
}
