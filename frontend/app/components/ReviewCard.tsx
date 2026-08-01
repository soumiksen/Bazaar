'use client';

import { StarIcon } from '@heroicons/react/24/solid';
import type { Review } from '../types';

interface ReviewCardProps {
  review: Review;
  isOwnReview?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

function initialsOf(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function ReviewCard({ review, isOwnReview = false, onEdit, onDelete }: ReviewCardProps) {
  return (
    <div className="p-5 flex flex-col justify-between space-y-3 rounded-2xl border border-neutral-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-bold text-white border border-neutral-100 shadow-sm">
            {initialsOf(review.userName) || '?'}
          </div>
          <div>
            <h4 className="text-sm font-bold text-neutral-800 leading-tight">
              {review.userName}
              {isOwnReview && <span className="ml-2 text-[10px] font-medium text-neutral-400">(You)</span>}
            </h4>
            <span className="text-[10px] text-neutral-400 font-medium">{formatDate(review.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-0.5 rounded-full bg-neutral-50 border border-neutral-100 px-2 py-0.5"
            aria-label={`Rating: ${review.rating} out of 5 stars`}
          >
            {Array.from({ length: review.rating }).map((_, index) => (
              <StarIcon key={index} className="h-3 w-3 text-amber-400" />
            ))}
          </div>

          {isOwnReview && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onEdit}
                className="text-[10px] font-bold text-neutral-500 underline underline-offset-2 hover:text-neutral-800 cursor-pointer"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="text-[10px] font-bold text-red-400 underline underline-offset-2 hover:text-red-600 cursor-pointer"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {review.comment && (
        <p className="text-sm leading-relaxed text-neutral-600 font-normal pl-1">&ldquo;{review.comment}&rdquo;</p>
      )}
    </div>
  );
}
