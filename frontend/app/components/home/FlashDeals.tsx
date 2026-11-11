'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import SectionHeading from './SectionHeading';
import ProductCard from '../Card';
import { productCardProps } from './ProductGrid';
import type { CatalogProduct } from '@/app/types';

function msUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Deals reset every day at local midnight. */
function Countdown() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(msUntilMidnight());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const total = remaining === null ? null : Math.max(0, Math.floor(remaining / 1000));
  const parts = [
    { label: 'Hrs', value: total === null ? '--' : pad(Math.floor(total / 3600)) },
    { label: 'Min', value: total === null ? '--' : pad(Math.floor((total % 3600) / 60)) },
    { label: 'Sec', value: total === null ? '--' : pad(total % 60) },
  ];

  return (
    <div className="flex items-center gap-1.5" role="timer" aria-label="Time left in today's deals">
      <span className="mr-1 hidden text-[10px] font-bold uppercase tracking-wider text-neutral-400 sm:inline">Ends in</span>
      {parts.map((part, i) => (
        <div key={part.label} className="flex items-center gap-1.5">
          <div className="flex min-w-11 flex-col items-center rounded-xl bg-neutral-950 px-2 py-1 text-white shadow-md">
            <span className="text-sm font-bold tabular-nums leading-tight">{part.value}</span>
            <span className="text-[8px] font-bold uppercase tracking-wider text-white/60">{part.label}</span>
          </div>
          {i < parts.length - 1 && <span className="text-sm font-bold text-neutral-400">:</span>}
        </div>
      ))}
    </div>
  );
}

export default function FlashDeals({ deals }: { deals: CatalogProduct[] }) {
  const scroller = useRef<HTMLDivElement>(null);

  if (deals.length === 0) return null;

  const scrollBy = (direction: 1 | -1) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <section aria-labelledby="flash-deals-heading" className="rounded-3xl border border-white/40 bg-gradient-to-br from-rose-100/60 via-amber-50/60 to-orange-100/60 p-4 shadow-xs ring-1 ring-black/[0.03] md:p-6">
      <SectionHeading eyebrow="Limited time" title="Flash deals" href="/?view=deals">
        <Countdown />
      </SectionHeading>
      <h2 id="flash-deals-heading" className="sr-only">
        Flash deals
      </h2>

      <div className="relative">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Scroll deals left"
          className="absolute -left-3 top-1/3 z-10 hidden h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white shadow-md hover:bg-neutral-50 md:flex"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div
          ref={scroller}
          className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-3 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {deals.map((product) => (
            <div key={product.id} className="w-44 shrink-0 snap-start sm:w-52">
              <ProductCard {...productCardProps(product)} />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="Scroll deals right"
          className="absolute -right-3 top-1/3 z-10 hidden h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white shadow-md hover:bg-neutral-50 md:flex"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-1 flex items-center gap-1.5 px-1 text-[11px] font-medium text-neutral-500">
        <Zap className="h-3.5 w-3.5 text-amber-500" /> Prices shown are today&rsquo;s deal prices.
      </p>
    </section>
  );
}
