'use client';

import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { GLASS_STYLES } from '@/app/constants';

interface CartItemProps {
  id: string;
  title: string;
  price: string;
  category: string;
  imageUrl: string;
  quantity: number;
  onQuantityChange?: (id: string, delta: number) => void;
  onRemove?: (id: string) => void;
}

export default function CartItem({
  id,
  title,
  price,
  category,
  imageUrl,
  quantity,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  return (
    <div className={`p-4 flex flex-col sm:flex-row items-center gap-6 ${GLASS_STYLES.container}`}>
      <div className="relative h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 overflow-hidden rounded-2xl bg-neutral-100/40 border border-white/20">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover mix-blend-multiply"
        />
      </div>

      <div className="flex-1 flex flex-col sm:flex-row justify-between w-full gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">{category}</span>
          <h3 className="text-base font-bold text-neutral-800 leading-tight">{title}</h3>
          <p className="text-lg font-black text-neutral-900">{price}</p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
          <div className="flex items-center gap-1 rounded-full bg-white/40 border border-white/50 p-1 backdrop-blur-sm">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => onQuantityChange?.(id, -1)}
              className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/60 transition-colors cursor-pointer"
            >
              <MinusIcon className="h-3.5 w-3.5 text-neutral-600" />
            </button>
            <span className="w-8 text-center text-sm font-bold text-neutral-800">{quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => onQuantityChange?.(id, 1)}
              className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/60 transition-colors cursor-pointer"
            >
              <PlusIcon className="h-3.5 w-3.5 text-neutral-600" />
            </button>
          </div>

          <button
            type="button"
            aria-label={`Remove ${title} from cart`}
            onClick={() => onRemove?.(id)}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-red-50/50 border border-red-100 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
