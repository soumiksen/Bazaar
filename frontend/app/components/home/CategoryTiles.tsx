import Link from 'next/link';
import SectionHeading from './SectionHeading';
import { FEATURED_CATEGORIES, categoryHref, productsInCategory } from '@/app/lib/catalog';
import type { CatalogProduct } from '@/app/types';

export default function CategoryTiles({ products }: { products: CatalogProduct[] }) {
  return (
    <section aria-labelledby="categories-heading">
      <SectionHeading eyebrow="Browse" title="Shop by category" href="/" linkLabel="All products" />
      <h2 id="categories-heading" className="sr-only">
        Shop by category
      </h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {FEATURED_CATEGORIES.map(({ name, icon: Icon, tint }) => {
          const count = productsInCategory(products, name).length;
          return (
            <li key={name}>
              <Link
                href={categoryHref(name)}
                className="group flex flex-col items-center gap-2.5 rounded-3xl border border-white/30 bg-white/40 p-4 text-center shadow-xs ring-1 ring-black/[0.03] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/70 hover:shadow-lg hover:shadow-neutral-900/10"
              >
                <span className={`flex h-14 w-14 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 ${tint}`}>
                  <Icon className="h-6 w-6" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">{name}</span>
                <span className="-mt-1.5 text-[11px] font-medium text-neutral-400">{count} item{count === 1 ? '' : 's'}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
