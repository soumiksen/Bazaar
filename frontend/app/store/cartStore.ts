import { create } from 'zustand';
import type { CartSummary } from '@/app/types';

interface CartState {
  items: CartSummary['items'];
  totalQuantity: number;
  subtotal: number;
  hasLoaded: boolean;
  setCart: (cart: CartSummary) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()((set) => ({
  items: [],
  totalQuantity: 0,
  subtotal: 0,
  hasLoaded: false,
  setCart: (cart) =>
    set({
      items: cart.items,
      totalQuantity: cart.totalQuantity,
      subtotal: cart.subtotal,
      hasLoaded: true,
    }),
  clearCart: () => set({ items: [], totalQuantity: 0, subtotal: 0, hasLoaded: true }),
}));
