'use client';

import Link from 'next/link';
import { ArrowLeftIcon, HeartIcon } from '@heroicons/react/24/outline';
import ProductCard from '@/app/components/Card';
import { buttonVariants } from '@/app/components/Button';
import { GLASS_STYLES } from '@/app/constants';
import { useLikeStore } from '@/app/store/likeStore';

export default function LikesPage() {
  const items = useLikeStore((state) => state.items);
  const hasLoaded = useLikeStore((state) => state.hasLoaded);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">

      <div className="flex items-center justify-between px-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-neutral-900">Your Wishlist</h1>
          <p className="text-xs text-neutral-400 font-medium uppercase tracking-widest">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        <Link href="/" className={buttonVariants({ variant: 'secondary' })}>
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {!hasLoaded ? (
        <div className={`p-10 text-center text-sm text-neutral-500 font-medium ${GLASS_STYLES.container}`}>
          Loading your wishlist...
        </div>
      ) : items.length === 0 ? (
        <div className={`p-10 flex flex-col items-center gap-4 text-center ${GLASS_STYLES.container}`}>
          <HeartIcon className="h-10 w-10 text-neutral-300" />
          <div className="space-y-1">
            <p className="text-base font-bold text-neutral-800">Your wishlist is empty</p>
            <p className="text-sm text-neutral-500">Tap the heart on any product to save it here.</p>
          </div>
          <Link href="/" className={buttonVariants({ variant: 'primary' })}>
            Start Browsing
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <ProductCard
              key={item.id}
              id={item.productId}
              title={item.title}
              category={item.category}
              price={`$${item.price.toFixed(2)}`}
              imageUrl={item.imageUrl ?? undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
