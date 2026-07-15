'use client';

import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { GLASS_STYLES } from '@/app/constants';
import type { VendorProduct } from '@/app/types';

interface VendorProductRowProps {
  product: VendorProduct;
  isActive?: boolean;
  onEdit?: (product: VendorProduct) => void;
  onDelete?: (id: string) => void;
}

export default function VendorProductRow({ product, isActive = false, onEdit, onDelete }: VendorProductRowProps) {
  const { id, title, category, price, stock, status, imageUrl } = product;

  return (
    <div
      className={`p-4 flex flex-col sm:flex-row items-center gap-6 ${GLASS_STYLES.container} ${GLASS_STYLES.cardHover} ${
        isActive ? 'border-neutral-300 bg-white/60' : ''
      }`}
    >
      <div className="relative h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-neutral-100/40 border border-white/20">
        <img src={imageUrl} alt={title} className="h-full w-full object-cover mix-blend-multiply" />
      </div>

      <div className="flex-1 flex flex-col sm:flex-row justify-between w-full gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">{category}</span>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-200 text-neutral-500'
              }`}
            >
              {status === 'active' ? 'Active' : 'Draft'}
            </span>
          </div>
          <h3 className="text-base font-bold text-neutral-800 leading-tight">{title}</h3>
          <p className="text-sm font-medium text-neutral-400">{stock} in stock</p>
        </div>

        <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 w-full sm:w-auto">
          <p className="text-lg font-black text-neutral-900">{price}</p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={`Edit ${title}`}
              onClick={() => onEdit?.(product)}
              className="h-9 w-9 flex items-center justify-center rounded-full bg-white/50 border border-white/50 text-neutral-600 hover:bg-white/80 hover:text-neutral-900 transition-all duration-300 cursor-pointer"
            >
              <PencilSquareIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label={`Delete ${title}`}
              onClick={() => onDelete?.(id)}
              className="h-9 w-9 flex items-center justify-center rounded-full bg-red-50/50 border border-red-100 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
