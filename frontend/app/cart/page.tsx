'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CreditCardIcon } from '@heroicons/react/24/solid';
import { ArrowLeftIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import CartItem from '@/app/components/CartItem';
import Button, { buttonVariants } from '@/app/components/Button';
import { GLASS_STYLES } from '@/app/constants';
import { useCartStore } from '@/app/store/cartStore';
import { removeCartItem, updateCartItemQuantity, ApiError } from '@/app/lib/api';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const totalQuantity = useCartStore((state) => state.totalQuantity);
  const subtotal = useCartStore((state) => state.subtotal);
  const hasLoaded = useCartStore((state) => state.hasLoaded);
  const setCart = useCartStore((state) => state.setCart);

  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleQuantityChange = async (id: string, delta: number) => {
    const item = items.find((cartItem) => cartItem.id === id);
    if (!item) return;

    const nextQuantity = item.quantity + delta;
    setPendingId(id);
    setError(null);

    try {
      const cart =
        nextQuantity <= 0 ? await removeCartItem(id) : await updateCartItemQuantity(id, nextQuantity);
      setCart(cart);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not update your cart. Please try again.');
    } finally {
      setPendingId(null);
    }
  };

  const handleRemove = async (id: string) => {
    setPendingId(id);
    setError(null);

    try {
      const cart = await removeCartItem(id);
      setCart(cart);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not update your cart. Please try again.');
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">

      <div className="flex items-center justify-between px-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-neutral-900">Your Shopping Bag</h1>
          <p className="text-xs text-neutral-400 font-medium uppercase tracking-widest">
            {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'} in your selection
          </p>
        </div>
        <Link href="/" className={buttonVariants({ variant: 'secondary' })}>
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-2xl bg-red-50/70 border border-red-100 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {!hasLoaded ? (
        <div className={`p-10 text-center text-sm text-neutral-500 font-medium ${GLASS_STYLES.container}`}>
          Loading your cart...
        </div>
      ) : items.length === 0 ? (
        <div className={`p-10 flex flex-col items-center gap-4 text-center ${GLASS_STYLES.container}`}>
          <ShoppingBagIcon className="h-10 w-10 text-neutral-300" />
          <div className="space-y-1">
            <p className="text-base font-bold text-neutral-800">Your bag is empty</p>
            <p className="text-sm text-neutral-500">Browse products and add something you like.</p>
          </div>
          <Link href="/" className={buttonVariants({ variant: 'primary' })}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <div className="lg:col-span-8 flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.id} className={pendingId === item.id ? 'opacity-60 pointer-events-none' : ''}>
                <CartItem
                  id={item.id}
                  title={item.title}
                  price={item.price}
                  category={item.category}
                  imageUrl={item.imageUrl}
                  quantity={item.quantity}
                  maxQuantity={item.stock}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                />
              </div>
            ))}
          </div>

          <aside className="lg:col-span-4 sticky top-28">
            <div className={`p-6 space-y-6 ${GLASS_STYLES.container}`}>
              <h2 className="text-xl font-bold text-neutral-800 tracking-tight">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium text-neutral-500">
                  <span>Subtotal</span>
                  <span className="text-neutral-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-neutral-500">
                  <span>Shipping</span>
                  <span className="text-neutral-800">FREE</span>
                </div>
                <hr className="border-white/20" />
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-neutral-400 uppercase">Estimated Total</span>
                  <span className="text-2xl font-black text-neutral-900 leading-none">${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <Button width="full" variant="primary">
                <CreditCardIcon className="h-5 w-5" />
                <span>Proceed to Checkout</span>
              </Button>

              <div className="flex justify-center items-center gap-4 opacity-30 grayscale pointer-events-none" aria-hidden="true">
                <div className="h-6 w-10 bg-neutral-400 rounded-sm" />
                <div className="h-6 w-10 bg-neutral-400 rounded-sm" />
                <div className="h-6 w-10 bg-neutral-400 rounded-sm" />
              </div>
            </div>
          </aside>

        </div>
      )}
    </div>
  );
}
