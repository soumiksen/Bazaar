'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BadgeCheck, Eye, Heart, Star } from 'lucide-react';
import { GLASS_STYLES } from '../constants';
import { likeProduct, unlikeProduct } from '@/app/lib/api';
import { useAuthStore, selectIsAuthenticated } from '@/app/store/authStore';
import { useLikeStore } from '@/app/store/likeStore';
import { useToastStore } from '@/app/store/toastStore';
import { useCartControls } from '@/app/hooks/useCartControls';
import { discountPercent, formatPrice, getBadges, vendorHref, type Badge } from '@/app/lib/catalog';
import QuantityControl from './QuantityControl';
import QuickView from './QuickView';

export interface ProductCardProps {
  id: string;
  title?: string;
  category?: string;
  price: number;
  compareAtPrice?: number | null;
  rating?: number;
  reviewCount?: number;
  imageUrl?: string;
  vendorId?: string | null;
  vendorName?: string | null;
  vendorVerified?: boolean;
  createdAt?: string | null;
  unitsSold?: number;
  /** Called after an item is successfully added to the bag. */
  onAddToCart?: (id: string) => void;
}

const BADGE_STYLES: Record<Badge, string> = {
  Sale: 'bg-red-500 text-white',
  'Best Seller': 'bg-amber-400 text-neutral-900',
  New: 'bg-neutral-900 text-white',
  'Free Shipping': 'bg-white/90 text-neutral-700',
};

const MAX_BADGES = 2;

export default function ProductCard(props: ProductCardProps) {
  const {
    id,
    title = '',
    category,
    price,
    compareAtPrice,
    rating,
    reviewCount = 0,
    imageUrl,
    vendorId,
    vendorName,
    vendorVerified,
    createdAt,
    unitsSold,
    onAddToCart,
  } = props;

  const router = useRouter();
  const isLoggedIn = useAuthStore(selectIsAuthenticated);
  const isFavorite = useLikeStore((state) => state.likedProductIds.has(id));
  const setLikes = useLikeStore((state) => state.setLikes);
  const pushToast = useToastStore((state) => state.push);
  const [isTogglingLike, setIsTogglingLike] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const { quantity, cartItem, isBusy, change } = useCartControls(id, title);

  const discount = discountPercent({ price, compareAtPrice });
  const badges = getBadges({
    id,
    title,
    category: category ?? '',
    price,
    compareAtPrice,
    imageUrl: imageUrl ?? null,
    averageRating: rating ?? 0,
    reviewCount,
    createdAt,
    unitsSold,
  }).slice(0, MAX_BADGES);

  const handleToggleLike = async () => {
    if (!isLoggedIn) {
      router.push('/signin');
      return;
    }
    if (isTogglingLike) return;
    setIsTogglingLike(true);

    try {
      const likes = isFavorite ? await unlikeProduct(id) : await likeProduct(id);
      setLikes(likes);
      pushToast({
        kind: 'info',
        message: isFavorite ? `Removed “${title}” from your wishlist` : `Saved “${title}” to your wishlist`,
        actionLabel: isFavorite ? undefined : 'View',
        actionHref: isFavorite ? undefined : '/likes',
      });
    } catch {
      pushToast({ kind: 'error', message: 'Could not update your wishlist. Please try again.' });
    } finally {
      setIsTogglingLike(false);
    }
  };

  const handleChange = async (delta: number) => {
    await change(delta);
    if (delta > 0) onAddToCart?.(id);
  };

  return (
    <>
      <article
        className={`group relative flex h-full w-full flex-col p-2.5 animate-in fade-in slide-in-from-bottom-3 duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-neutral-900/10 ${GLASS_STYLES.container} ${GLASS_STYLES.cardHover}`}
      >
        <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[18px] border border-white/20 bg-neutral-100/40 shadow-inner">
          {!imgLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-neutral-200/20 via-neutral-300/20 to-neutral-200/20" />
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`h-full w-full object-cover mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-110 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {badges.length > 0 && (
            <div className="pointer-events-none absolute left-2 top-2 flex flex-col items-start gap-1">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm ${BADGE_STYLES[badge]}`}
                >
                  {badge === 'Sale' && discount > 0 ? `-${discount}%` : badge}
                </span>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleToggleLike}
            disabled={isTogglingLike}
            aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-pressed={isFavorite}
            className="z-10 absolute right-2 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/50 bg-white/50 text-neutral-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:bg-white active:scale-90 disabled:opacity-60"
          >
            <Heart
              className={`h-4 w-4 transition-all duration-300 ${isFavorite ? 'scale-110 fill-red-500 text-red-500' : ''}`}
            />
          </button>

          <button
            type="button"
            onClick={() => setShowQuickView(true)}
            aria-label={`Quick view ${title}`}
            className="absolute inset-x-2 bottom-2 z-10 flex translate-y-2 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-white/90 py-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-800 opacity-0 shadow-sm backdrop-blur-md transition-all duration-300 hover:bg-white focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <Eye className="h-3.5 w-3.5" />
            Quick view
          </button>
        </div>

        <div className="mt-3 flex flex-1 flex-col gap-1 px-1">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">{category}</span>
            {reviewCount > 0 && rating !== undefined && (
              <div
                className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-neutral-600"
                aria-label={`Rated ${rating.toFixed(1)} out of 5 stars from ${reviewCount} review${reviewCount === 1 ? '' : 's'}`}
              >
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span>{rating.toFixed(1)}</span>
                <span className="text-neutral-400">({reviewCount})</span>
              </div>
            )}
          </div>

          <h3 className="line-clamp-1 text-sm font-semibold tracking-tight text-neutral-800 transition-colors group-hover:text-black">
            {/* Stretched link: the whole card opens the product, while inner controls stay clickable via z-10. */}
            <Link href={`/products/${id}`} className="after:absolute after:inset-0 after:z-[1] after:content-['']">
              {title}
            </Link>
          </h3>

          {vendorName && (
            <p className="flex items-center gap-1 truncate text-xs text-neutral-500">
              <span className="text-neutral-400">by</span>
              {vendorId ? (
                <Link
                  href={vendorHref(vendorId)}
                  className="relative z-10 truncate font-medium text-neutral-600 underline-offset-2 hover:text-black hover:underline"
                >
                  {vendorName}
                </Link>
              ) : (
                <span className="truncate font-medium text-neutral-600">{vendorName}</span>
              )}
              {vendorVerified && <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-sky-500" aria-label="Verified vendor" />}
            </p>
          )}

          <div className="mt-auto flex items-end justify-between gap-2 pt-2">
            <div className="flex flex-wrap items-baseline gap-x-1.5">
              <span className="text-base font-bold tracking-tight text-neutral-900">{formatPrice(price)}</span>
              {discount > 0 && compareAtPrice && (
                <span className="text-xs font-medium text-neutral-400 line-through">{formatPrice(compareAtPrice)}</span>
              )}
            </div>

            <div className="relative z-10 shrink-0">
              <QuantityControl title={title} quantity={quantity} maxQuantity={cartItem?.stock} isBusy={isBusy} onChange={handleChange} />
            </div>
          </div>
        </div>
      </article>

      {showQuickView && (
        <QuickView
          onClose={() => setShowQuickView(false)}
          id={id}
          title={title}
          category={category}
          price={price}
          compareAtPrice={compareAtPrice}
          imageUrl={imageUrl}
          rating={rating}
          reviewCount={reviewCount}
          vendorId={vendorId}
          vendorName={vendorName}
        />
      )}
    </>
  );
}
