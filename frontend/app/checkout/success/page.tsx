'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { GLASS_STYLES } from '@/app/constants';
import { buttonVariants } from '@/app/components/Button';
import { useCartStore } from '@/app/store/cartStore';
import { getOrderBySession, ApiError } from '@/app/lib/api';
import type { Order } from '@/app/types';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const clearCart = useCartStore((state) => state.clearCart);

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setIsLoading(false);
      setError('Missing checkout session.');
      return;
    }

    let cancelled = false;

    getOrderBySession(sessionId)
      .then((result) => {
        if (cancelled) return;
        setOrder(result);
        clearCart();
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof ApiError ? err.message : 'Could not load your order. It may still be processing.'
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [sessionId, clearCart]);

  return (
    <div className="mx-auto max-w-xl space-y-8 py-12 text-center animate-in fade-in duration-500">
      {isLoading ? (
        <div className={`p-10 text-sm font-medium text-neutral-500 ${GLASS_STYLES.container}`}>
          Confirming your payment...
        </div>
      ) : order ? (
        <div className={`p-10 space-y-6 ${GLASS_STYLES.container}`}>
          <CheckCircleIcon className="mx-auto h-14 w-14 text-emerald-500" />
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-neutral-900">Payment Successful</h1>
            <p className="text-sm text-neutral-500">Thanks for your order — a confirmation is on its way.</p>
          </div>

          <div className="space-y-2 text-left">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm text-neutral-600">
                <span>
                  {item.title} <span className="text-neutral-400">&times;{item.quantity}</span>
                </span>
                <span className="font-semibold text-neutral-800">
                  ${(item.unitPrice * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <hr className="border-white/20" />
            <div className="flex justify-between text-sm font-bold text-neutral-900">
              <span>Total</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <Link href="/" className={buttonVariants({ variant: 'secondary' })}>
              Continue Shopping
            </Link>
            <Link href="/orders" className={buttonVariants({ variant: 'primary' })}>
              View Orders
            </Link>
          </div>
        </div>
      ) : (
        <div className={`p-10 space-y-4 ${GLASS_STYLES.container}`}>
          <h1 className="text-xl font-bold text-neutral-900">Payment received</h1>
          <p className="text-sm text-neutral-500">
            {error ?? 'Your order is still being finalized. Check your order history in a moment.'}
          </p>
          <Link href="/orders" className={buttonVariants({ variant: 'primary' })}>
            View Orders
          </Link>
        </div>
      )}
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
