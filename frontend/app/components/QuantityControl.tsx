'use client';

import { Minus, Plus, ShoppingBag } from 'lucide-react';

interface QuantityControlProps {
  title: string;
  quantity: number;
  maxQuantity?: number;
  isBusy: boolean;
  onChange: (delta: number) => void;
  /** Show a text label next to the bag icon when the product is not yet in the bag. */
  label?: string;
}

/** Black circular "add to bag" button that becomes a − n + stepper once the item is in the bag. */
export default function QuantityControl({ title, quantity, maxQuantity, isBusy, onChange, label }: QuantityControlProps) {
  if (quantity > 0) {
    return (
      <div className="flex h-9 items-center gap-0.5 rounded-full bg-neutral-950 px-1 text-white shadow-md">
        <button
          type="button"
          onClick={() => onChange(-1)}
          disabled={isBusy}
          aria-label={`Decrease quantity of ${title}`}
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-all hover:bg-white/20 active:scale-90 disabled:opacity-60"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="min-w-5 text-center text-sm font-semibold tabular-nums" aria-live="polite">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => onChange(1)}
          disabled={isBusy || (maxQuantity !== undefined && quantity >= maxQuantity)}
          aria-label={`Increase quantity of ${title}`}
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-all hover:bg-white/20 active:scale-90 disabled:opacity-40"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onChange(1)}
      disabled={isBusy}
      aria-label={`Add ${title} to bag`}
      className={`flex h-9 cursor-pointer items-center justify-center gap-2 rounded-full bg-neutral-950 text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-neutral-800 active:scale-95 disabled:opacity-60 ${
        label ? 'px-5 text-sm font-bold' : 'w-9'
      }`}
    >
      <ShoppingBag className="h-4 w-4" />
      {label && <span>{label}</span>}
    </button>
  );
}
