'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { buttonVariants } from '@/app/components/Button';
import { GLASS_STYLES } from '@/app/constants';
import { useAuthStore, selectIsAuthenticated } from '@/app/store/authStore';
import { listOrders, ApiError } from '@/app/lib/api';
import type { OrderSummary } from '@/app/types';

const STATUS_STYLES: Record<OrderSummary['status'], string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  PAID: 'bg-emerald-100 text-emerald-700',
  FAILED: 'bg-red-100 text-red-700',
  CANCELED: 'bg-neutral-200 text-neutral-500',
};

export default function OrdersPage() {
  const router = useRouter();
  const isLoggedIn = useAuthStore(selectIsAuthenticated);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isLoggedIn) {
      router.push('/signin');
      return;
    }

    listOrders()
      .then(setOrders)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Could not load your orders.'))
      .finally(() => setIsLoading(false));
  }, [hasHydrated, isLoggedIn, router]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between px-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-neutral-900">Order History</h1>
          <p className="text-xs text-neutral-400 font-medium uppercase tracking-widest">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'}
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

      {isLoading ? (
        <div className={`p-10 text-center text-sm text-neutral-500 font-medium ${GLASS_STYLES.container}`}>
          Loading your orders...
        </div>
      ) : orders.length === 0 ? (
        <div className={`p-10 flex flex-col items-center gap-4 text-center ${GLASS_STYLES.container}`}>
          <ShoppingBagIcon className="h-10 w-10 text-neutral-300" />
          <div className="space-y-1">
            <p className="text-base font-bold text-neutral-800">No orders yet</p>
            <p className="text-sm text-neutral-500">Your completed purchases will show up here.</p>
          </div>
          <Link href="/" className={buttonVariants({ variant: 'primary' })}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className={`flex items-center justify-between p-5 ${GLASS_STYLES.container} ${GLASS_STYLES.cardHover}`}
            >
              <div className="space-y-1">
                <p className="text-sm font-bold text-neutral-800">Order #{order.id.slice(0, 8)}</p>
                <p className="text-xs text-neutral-400">
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  &middot; {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[order.status]}`}
                >
                  {order.status}
                </span>
                <span className="text-lg font-black text-neutral-900">${order.subtotal.toFixed(2)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
