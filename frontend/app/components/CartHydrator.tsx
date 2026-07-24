'use client';

import { useEffect } from 'react';
import { useAuthStore, selectIsAuthenticated } from '@/app/store/authStore';
import { useCartStore } from '@/app/store/cartStore';
import { getCart } from '@/app/lib/api';

export default function CartHydrator() {
  const hasAuthHydrated = useAuthStore((state) => state.hasHydrated);
  const isLoggedIn = useAuthStore(selectIsAuthenticated);
  const setCart = useCartStore((state) => state.setCart);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (!hasAuthHydrated) return;

    if (!isLoggedIn) {
      clearCart();
      return;
    }

    getCart()
      .then(setCart)
      .catch(() => clearCart());
  }, [hasAuthHydrated, isLoggedIn, setCart, clearCart]);

  return null;
}
