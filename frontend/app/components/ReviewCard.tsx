'use client';

import { StarIcon } from '@heroicons/react/24/solid';
import type { Review } from '../types';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="p-5 flex flex-col justify-between space-y-3 rounded-2xl border border-neutral-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={review.avatar}
            alt={`${review.name}'s avatar`}
            className="h-9 w-9 rounded-full object-cover border border-neutral-100 shadow-sm"
          />
          <div>
            <h4 className="text-sm font-bold text-neutral-800 leading-tight">{review.name}</h4>
            <span className="text-[10px] text-neutral-400 font-medium">{review.date}</span>
          </div>
        </div>

        <div
          className="flex items-center gap-0.5 rounded-full bg-neutral-50 border border-neutral-100 px-2 py-0.5"
          aria-label={`Rating: ${review.rating} out of 5 stars`}
        >
          {Array.from({ length: review.rating }).map((_, index) => (
            <StarIcon key={index} className="h-3 w-3 text-amber-400" />
          ))}
        </div>
      </div>

      <p className="text-sm leading-relaxed text-neutral-600 font-normal pl-1">
        &ldquo;{review.comment}&rdquo;
      </p>
    </div>
  );
}
