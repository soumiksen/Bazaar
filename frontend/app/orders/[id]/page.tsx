'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { buttonVariants } from '@/app/components/Button';
import { GLASS_STYLES } from '@/app/constants';
import { useAuthStore, selectIsAuthenticated } from '@/app/store/authStore';
import { getOrder, ApiError } from '@/app/lib/api';
import type { Order } from '@/app/types';

const STATUS_STYLES: Record<Order['status'], string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  PAID: 'bg-emerald-100 text-emerald-700',
  FAILED: 'bg-red-100 text-red-700',
  CANCELED: 'bg-neutral-200 text-neutral-500',
};

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const isLoggedIn = useAuthStore(selectIsAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isLoggedIn) {
      router.push('/signin');
      return;
    }

    getOrder(params.id)
      .then(setOrder)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load this order.'))
      .finally(() => setIsLoading(false));
  }, [hasHydrated, isLoggedIn, params.id, router]);

  return (
    <div className="mx-auto max-w-2xl space-y-8 py-8 animate-in fade-in duration-500">
      <Link href="/orders" className={buttonVariants({ variant: 'secondary' })}>
        <ArrowLeftIcon className="h-4 w-4" />
        <span>Back to Orders</span>
      </Link>

      {isLoading ? (
        <div className={`p-10 text-center text-sm text-neutral-500 font-medium ${GLASS_STYLES.container}`}>
          Loading order...
        </div>
      ) : error || !order ? (
        <div className={`p-10 text-center text-sm text-neutral-500 font-medium ${GLASS_STYLES.container}`}>
          {error ?? 'Order not found.'}
        </div>
      ) : (
        <div className={`p-8 space-y-6 ${GLASS_STYLES.container}`}>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-black tracking-tight text-neutral-900">
                Order #{order.id.slice(0, 8)}
              </h1>
              <p className="text-xs text-neutral-400">
                Placed{' '}
                {new Date(order.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[order.status]}`}
            >
              {order.status}
            </span>
          </div>

          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold text-neutral-800">{item.title}</p>
                  <p className="text-xs text-neutral-400">
                    ${item.unitPrice.toFixed(2)} &times; {item.quantity}
                  </p>
                </div>
                <span className="font-bold text-neutral-900">${(item.unitPrice * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <hr className="border-white/20" />

          <div className="flex justify-between text-base font-black text-neutral-900">
            <span>Total</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
