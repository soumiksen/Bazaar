'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/app/store/authStore';

export default function AuthHydrator() {
  useEffect(() => {
    useAuthStore.persist.rehydrate();
  }, []);

  return null;
}
