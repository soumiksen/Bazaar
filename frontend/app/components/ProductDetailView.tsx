'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBagIcon, StarIcon, ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { GLASS_STYLES } from '@/app/constants';
import ReviewCard from '@/app/components/ReviewCard';
import { useAuthStore, selectIsAuthenticated } from '@/app/store/authStore';
import { useCartStore } from '@/app/store/cartStore';
import { useLikeStore } from '@/app/store/likeStore';
import { addCartItem, likeProduct, unlikeProduct, ApiError } from '@/app/lib/api';
import type { ProductDetail, Review } from '@/app/types';

const FALLBACK_IMAGE_URL =
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';

const COLOR_SWATCHES = [
  { id: 'blue', class: 'bg-blue-500 ring-blue-400' },
  { id: 'orange', class: 'bg-orange-500 ring-orange-400' },
  { id: 'green', class: 'bg-emerald-500 ring-emerald-400' },
  { id: 'red', class: 'bg-rose-500 ring-rose-400' },
  { id: 'cyan', class: 'bg-cyan-400 ring-cyan-300' },
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 1,
    name: 'Alex Ryman',
    rating: 5,
    date: '2 days ago',
    comment:
      'The soundstage on these is incredibly wide. The glass design elements match my desktop setup perfectly, and the battery easily lasts all week.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    name: 'Sarah Jenkins',
    rating: 4,
    date: '1 week ago',
    comment:
      'Super crisp highs and deep bass without distortion. The earcups feel premium, though it takes a day or two to fully break them in.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
  },
];

interface ProductDetailViewProps {
  product: ProductDetail;
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const router = useRouter();
  const isLoggedIn = useAuthStore(selectIsAuthenticated);
  const setCart = useCartStore((state) => state.setCart);
  const isFavorite = useLikeStore((state) => state.likedProductIds.has(product.id));
  const setLikes = useLikeStore((state) => state.setLikes);
  const [selectedColor, setSelectedColor] = useState(COLOR_SWATCHES[0].id);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [isTogglingLike, setIsTogglingLike] = useState(false);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      router.push('/signin');
      return;
    }

    setIsAddingToCart(true);
    setCartError(null);

    try {
      const cart = await addCartItem(product.id, 1);
      setCart(cart);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    } catch (error) {
      setCartError(error instanceof ApiError ? error.message : 'Could not add to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleLike = async () => {
    if (!isLoggedIn) {
      router.push('/signin');
      return;
    }

    if (isTogglingLike) return;
    setIsTogglingLike(true);

    try {
      const likes = isFavorite ? await unlikeProduct(product.id) : await likeProduct(product.id);
      setLikes(likes);
    } catch {
      // silently ignore; the heart simply won't reflect the toggle
    } finally {
      setIsTogglingLike(false);
    }
  };

  const averageRating =
    reviews.length === 0 ? 0 : reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const reviewerName = useAuthStore.getState().user?.name ?? 'You';

    setReviews((prev) => [
      {
        id: Date.now(),
        name: reviewerName,
        rating: newRating,
        date: 'Just now',
        comment: newComment,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      },
      ...prev,
    ]);
    setNewComment('');
    setNewRating(5);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-12">

      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/30 px-4 py-2 text-sm font-medium text-neutral-700 backdrop-blur-md transition-all hover:bg-white/60 active:scale-95"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Back to products</span>
        </Link>
      </div>

      <div className={`grid grid-cols-1 gap-8 md:grid-cols-12 p-6 md:p-8 ${GLASS_STYLES.container}`}>

        {/* Image Showcase */}
        <div className="md:col-span-5 flex flex-col justify-center relative aspect-square w-full overflow-hidden rounded-[20px] bg-neutral-100/40 border border-white/20 shadow-inner">
          {!imgLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-neutral-200/20 via-neutral-300/20 to-neutral-200/20" />
          )}
          <img
            src={product.imageUrl ?? FALLBACK_IMAGE_URL}
            alt={product.title}
            onLoad={() => setImgLoaded(true)}
            className={`h-full w-full object-cover mix-blend-multiply transition-all duration-700 ${
              imgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          />

          <button
            type="button"
            onClick={handleToggleLike}
            disabled={isTogglingLike}
            aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-pressed={isFavorite}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-white/30 text-neutral-700 shadow-sm backdrop-blur-md transition-all hover:bg-white/80 active:scale-90 cursor-pointer disabled:opacity-60"
          >
            <HeartOutline
              className={`h-5 w-5 transition-transform duration-300 ${
                isFavorite ? 'fill-red-500 text-red-500 scale-110' : 'text-neutral-700'
              }`}
            />
          </button>
        </div>

        {/* Editorial Info */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-6 md:pl-4">
          <div className="space-y-4">
            <span className="inline-flex items-center rounded-full bg-white/40 border border-white/50 px-3 py-1 backdrop-blur-sm text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-500">
              {product.category}
            </span>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 leading-tight">
              {product.title}
            </h1>

            <div className="flex items-center gap-3 text-sm font-medium text-neutral-600">
              <div className="flex items-center gap-1 rounded-full bg-white/40 border border-white/50 px-2.5 py-1 backdrop-blur-sm">
                <StarIcon className="h-4 w-4 text-amber-400" />
                <span className="font-bold text-neutral-800">{averageRating.toFixed(1)}</span>
              </div>
              <span className="text-neutral-400 text-xs">
                {reviews.length} review{reviews.length === 1 ? '' : 's'}
              </span>
              <span className="text-neutral-400 text-xs">Sold by {product.vendorName}</span>
            </div>

            {product.description && (
              <div className="pt-2 border-t border-white/20">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Description
                </span>
                <p className="text-sm leading-relaxed text-neutral-600 max-w-md">{product.description}</p>
              </div>
            )}
          </div>

          <div className="space-y-6 pt-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-3">
                Popular Colors
              </span>
              <div className="flex items-center gap-3">
                {COLOR_SWATCHES.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    aria-label={`Select ${color.id} color`}
                    aria-pressed={selectedColor === color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`h-6 w-6 rounded-full transition-all duration-300 shadow-sm hover:scale-110 active:scale-95 cursor-pointer ${color.class} ${
                      selectedColor === color.id ? 'ring-2 ring-offset-2 ring-neutral-800' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/20 pt-6">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Total Price</span>
                <span className="text-2xl font-black tracking-tight text-neutral-900">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-[11px] font-medium text-neutral-400">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || isAddingToCart}
                  className="flex items-center gap-2 rounded-full bg-neutral-950 px-6 py-3.5 text-sm font-bold text-white shadow-xl transition-all duration-300 hover:bg-neutral-800 hover:scale-[1.02] active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                >
                  {justAdded ? (
                    <>
                      <CheckIcon className="h-4 w-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBagIcon className="h-4 w-4" />
                      <span>{isAddingToCart ? 'Adding...' : 'Add to Shopping Bag'}</span>
                    </>
                  )}
                </button>
                {cartError && <span className="text-xs font-medium text-red-500">{cartError}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="space-y-6 max-w-3xl">
        <div className="space-y-1 px-1">
          <h2 className="text-xl font-bold tracking-tight text-neutral-900">Verified Customer Reviews</h2>
          <p className="text-xs text-neutral-400 font-medium">What buyers think about {product.title}.</p>
        </div>

        {isLoggedIn ? (
          <form onSubmit={handleSubmitReview} className={`p-5 space-y-4 ${GLASS_STYLES.container}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-neutral-800">Share your experience</span>

              <div className="flex items-center gap-1 bg-white/40 border border-white/50 rounded-full px-2.5 py-1 backdrop-blur-sm">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                    onClick={() => setNewRating(star)}
                    className="outline-none transition-transform hover:scale-125 cursor-pointer"
                  >
                    <StarIcon
                      className={`h-4 w-4 transition-colors ${
                        star <= newRating ? 'text-amber-400' : 'text-neutral-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your thoughts about this product..."
              rows={3}
              className="w-full rounded-2xl border border-zinc-200 bg-white/40 p-4 text-sm text-neutral-800 placeholder-neutral-400 outline-none backdrop-blur-sm transition-all focus:bg-white/60 focus:border-neutral-300 resize-none"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-full bg-neutral-950 px-5 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-neutral-800 hover:scale-105 active:scale-95 cursor-pointer"
              >
                Submit Review
              </button>
            </div>
          </form>
        ) : (
          <div className={`p-4 text-center text-sm text-neutral-500 font-medium ${GLASS_STYLES.container}`}>
            Please{' '}
            <Link href="/signin" className="text-black underline font-bold">
              Sign In
            </Link>{' '}
            to leave a review.
          </div>
        )}

        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>

    </div>
  );
}
