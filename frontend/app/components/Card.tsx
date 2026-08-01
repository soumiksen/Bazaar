'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBagIcon, StarIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { GLASS_STYLES } from '../constants';
import { likeProduct, unlikeProduct } from '@/app/lib/api';
import { useAuthStore, selectIsAuthenticated } from '@/app/store/authStore';
import { useLikeStore } from '@/app/store/likeStore';

interface ProductCardProps {
  id: string;
  title?: string;
  category?: string;
  price?: string;
  rating?: number;
  reviewCount?: number;
  imageUrl?: string;
  onAddToCart?: (id: string) => void;
}

export default function ProductCard({
  id,
  title,
  category,
  price,
  rating,
  reviewCount = 0,
  imageUrl,
  onAddToCart,
}: ProductCardProps) {
  const router = useRouter();
  const isLoggedIn = useAuthStore(selectIsAuthenticated);
  const isFavorite = useLikeStore((state) => state.likedProductIds.has(id));
  const setLikes = useLikeStore((state) => state.setLikes);
  const [isTogglingLike, setIsTogglingLike] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isLoggedIn) {
      router.push('/signin');
      return;
    }

    if (isTogglingLike) return;
    setIsTogglingLike(true);

    try {
      const likes = isFavorite ? await unlikeProduct(id) : await likeProduct(id);
      setLikes(likes);
    } catch {
      // silently ignore; the heart simply won't reflect the toggle
    } finally {
      setIsTogglingLike(false);
    }
  };

  return (
    <Link href={`/products/${id}`} className="block" aria-label={`View ${title} details`}>
      <article className={`group relative w-full max-w-sm p-4 animate-in fade-in slide-in-from-bottom-3 duration-500 ${GLASS_STYLES.container} ${GLASS_STYLES.cardHover}`}>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[18px] bg-neutral-100/40 border border-white/20 shadow-inner">
          {!imgLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-neutral-200/20 via-neutral-300/20 to-neutral-200/20" />
          )}

          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`h-full w-full object-cover mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <button
            type="button"
            onClick={handleToggleLike}
            disabled={isTogglingLike}
            aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-pressed={isFavorite}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/50 bg-white/30 text-neutral-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:bg-white/80 cursor-pointer active:scale-90 disabled:opacity-60"
          >
            <HeartOutline
              className={`h-4 w-4 transition-all duration-300 ${
                isFavorite ? 'fill-red-500 text-red-500 scale-110' : 'text-neutral-700'
              }`}
            />
          </button>
        </div>

        <div className="mt-4 flex flex-col space-y-2 px-1">

          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">
              {category}
            </span>

            {reviewCount > 0 && rating !== undefined ? (
              <div
                className="flex items-center gap-1 rounded-full bg-white/40 border border-white/50 px-2 py-0.5 backdrop-blur-sm text-[11px] font-medium text-neutral-600"
                aria-label={`Rated ${rating.toFixed(1)} out of 5 stars from ${reviewCount} review${reviewCount === 1 ? '' : 's'}`}
              >
                <StarIcon className="h-3 w-3 text-amber-400 fill-current" />
                <span>{rating.toFixed(1)}</span>
              </div>
            ) : (
              <span className="rounded-full bg-white/40 border border-white/50 px-2 py-0.5 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                New
              </span>
            )}
          </div>

          <h3 className="text-base font-semibold tracking-tight text-neutral-800 transition-colors group-hover:text-black line-clamp-1">
            {title}
          </h3>

          <div className="pt-2 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Price</span>
              <span className="text-lg font-bold tracking-tight text-neutral-900">{price}</span>
            </div>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onAddToCart?.(id); }}
              aria-label={`Add ${title} to cart`}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-950 text-white shadow-md transition-all duration-300 hover:bg-neutral-800 hover:scale-105 active:scale-95 cursor-pointer group-hover:shadow-neutral-950/20"
            >
              <ShoppingBagIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
