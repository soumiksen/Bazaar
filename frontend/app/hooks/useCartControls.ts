'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addCartItem, updateCartItemQuantity, removeCartItem, ApiError } from '@/app/lib/api';
import { useAuthStore, selectIsAuthenticated } from '@/app/store/authStore';
import { useCartStore } from '@/app/store/cartStore';
import { useToastStore } from '@/app/store/toastStore';

/**
 * Shared add / increment / decrement logic for a product, backed by the persisted cart.
 * Used by the product card and the quick-view dialog.
 */
export function useCartControls(productId: string, title: string) {
  const router = useRouter();
  const isLoggedIn = useAuthStore(selectIsAuthenticated);
  const setCart = useCartStore((state) => state.setCart);
  const cartItem = useCartStore((state) => state.items.find((item) => item.productId === productId));
  const pushToast = useToastStore((state) => state.push);
  const [isBusy, setIsBusy] = useState(false);
  const quantity = cartItem?.quantity ?? 0;

  const change = async (delta: number) => {
    if (!isLoggedIn) {
      router.push('/signin');
      return;
    }
    if (isBusy) return;
    setIsBusy(true);

    try {
      let cart;
      if (!cartItem) {
        cart = await addCartItem(productId, 1);
      } else if (quantity + delta <= 0) {
        cart = await removeCartItem(cartItem.id);
      } else {
        cart = await updateCartItemQuantity(cartItem.id, quantity + delta);
      }
      setCart(cart);

      if (delta > 0) {
        pushToast({ message: `Added “${title}” to your bag`, actionLabel: 'View bag', actionHref: '/cart' });
      } else if (quantity + delta <= 0) {
        pushToast({ kind: 'info', message: `Removed “${title}” from your bag` });
      }
    } catch (error) {
      pushToast({
        kind: 'error',
        message: error instanceof ApiError ? error.message : 'Could not update your bag. Please try again.',
      });
    } finally {
      setIsBusy(false);
    }
  };

  return { quantity, cartItem, isBusy, change };
}
