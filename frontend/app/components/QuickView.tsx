'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Star, X } from 'lucide-react';
import { useCartControls } from '@/app/hooks/useCartControls';
import { discountPercent, formatPrice, vendorHref } from '@/app/lib/catalog';
import QuantityControl from './QuantityControl';

interface QuickViewProps {
  id: string;
  title: string;
  category?: string;
  price: number;
  compareAtPrice?: number | null;
  imageUrl?: string;
  rating?: number;
  reviewCount: number;
  vendorId?: string | null;
  vendorName?: string | null;
  onClose: () => void;
}

export default function QuickView({
  id,
  title,
  category,
  price,
  compareAtPrice,
  imageUrl,
  rating,
  reviewCount,
  vendorId,
  vendorName,
  onClose,
}: QuickViewProps) {
  const { quantity, cartItem, isBusy, change } = useCartControls(id, title);
  const discount = discountPercent({ price, compareAtPrice });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  // Portal to <body>: the card applies a hover transform, which would otherwise trap a fixed overlay.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${title}`}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-neutral-950/40 p-4 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative grid w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl sm:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/80 text-neutral-700 shadow-sm hover:bg-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="aspect-[4/3] bg-neutral-100 sm:aspect-auto sm:min-h-[22rem]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
        </div>

        <div className="flex flex-col gap-3 p-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">{category}</span>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900">{title}</h2>

          {vendorName && (
            <p className="text-sm text-neutral-500">
              Sold by{' '}
              {vendorId ? (
                <Link href={vendorHref(vendorId)} onClick={onClose} className="font-medium text-neutral-700 hover:underline">
                  {vendorName}
                </Link>
              ) : (
                <span className="font-medium text-neutral-700">{vendorName}</span>
              )}
            </p>
          )}

          {reviewCount > 0 && rating !== undefined && (
            <div className="flex items-center gap-1.5 text-sm text-neutral-600">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-medium">{rating.toFixed(1)}</span>
              <span className="text-neutral-400">
                ({reviewCount} review{reviewCount === 1 ? '' : 's'})
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-black tracking-tight text-neutral-900">{formatPrice(price)}</span>
            {discount > 0 && compareAtPrice && (
              <>
                <span className="text-sm font-medium text-neutral-400 line-through">{formatPrice(compareAtPrice)}</span>
                <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
            <QuantityControl
              title={title}
              quantity={quantity}
              maxQuantity={cartItem?.stock}
              isBusy={isBusy}
              onChange={change}
              label="Add to bag"
            />
            <Link
              href={`/products/${id}`}
              onClick={onClose}
              className="text-sm font-semibold text-neutral-600 underline-offset-4 hover:text-black hover:underline"
            >
              View full details
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
