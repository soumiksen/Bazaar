'use client';

import { useMemo, useState } from 'react';
import SectionHeading from './SectionHeading';
import ProductGrid from './ProductGrid';
import { bestSellers, newestFirst, topRated } from '@/app/lib/catalog';
import type { CatalogProduct } from '@/app/types';

const TABS = [
  { id: 'new', label: 'New Arrivals', sort: newestFirst },
  { id: 'best', label: 'Best Sellers', sort: bestSellers },
  { id: 'top', label: 'Top Rated', sort: topRated },
] as const;

const VISIBLE_COUNT = 8;

export default function FeaturedProducts({ products }: { products: CatalogProduct[] }) {
  const [active, setActive] = useState<(typeof TABS)[number]['id']>('new');

  const sorted = useMemo(
    () => ({ new: newestFirst(products), best: bestSellers(products), top: topRated(products) }),
    [products],
  );
  const visible = sorted[active].slice(0, VISIBLE_COUNT);

  return (
    <section aria-labelledby="featured-heading">
      <SectionHeading eyebrow="Curated for you" title="Featured products" href="/?view=all" linkLabel="View all" />
      <h2 id="featured-heading" className="sr-only">
        Featured products
      </h2>

      <div role="tablist" aria-label="Featured product lists" className="mb-5 flex flex-wrap gap-2 px-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            type="button"
            aria-selected={active === tab.id}
            aria-controls="featured-panel"
            onClick={() => setActive(tab.id)}
            className={`cursor-pointer rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
              active === tab.id
                ? 'bg-neutral-950 text-white shadow-md'
                : 'border border-white/50 bg-white/50 text-neutral-600 hover:bg-white/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div id="featured-panel" role="tabpanel" aria-labelledby={`tab-${active}`}>
        <ProductGrid products={visible} />
      </div>
    </section>
  );
}
