import Link from 'next/link';
import { BadgeCheck, Star } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { summarizeVendors, vendorHref } from '@/app/lib/catalog';
import type { CatalogProduct } from '@/app/types';

const BANNER_GRADIENTS = [
  'from-amber-100 to-rose-100',
  'from-sky-100 to-indigo-100',
  'from-emerald-100 to-teal-100',
  'from-fuchsia-100 to-orange-100',
];

export default function TopVendors({ products }: { products: CatalogProduct[] }) {
  const vendors = summarizeVendors(products).slice(0, 4);
  if (vendors.length === 0) return null;

  return (
    <section id="vendors" aria-labelledby="vendors-heading" className="scroll-mt-32">
      <SectionHeading eyebrow="Trusted sellers" title="Top vendors" />
      <h2 id="vendors-heading" className="sr-only">
        Top vendors
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {vendors.map((vendor, i) => (
          <article
            key={vendor.id}
            className="group overflow-hidden rounded-3xl border border-white/30 bg-white/50 shadow-xs ring-1 ring-black/[0.03] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-neutral-900/10"
          >
            <div className={`relative h-24 overflow-hidden bg-gradient-to-br ${BANNER_GRADIENTS[i % BANNER_GRADIENTS.length]}`}>
              <div className="absolute inset-0 grid grid-cols-3">
                {vendor.images.map((src) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={src} src={src} alt="" loading="lazy" className="h-full w-full object-cover opacity-80 mix-blend-multiply" />
                ))}
              </div>
            </div>

            <div className="relative px-4 pb-4">
              <div className="-mt-7 mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-950 text-xl font-black text-white shadow-lg ring-4 ring-white">
                {vendor.name.charAt(0).toUpperCase()}
              </div>

              <div className="flex items-center gap-1.5">
                <h3 className="truncate text-base font-bold tracking-tight text-neutral-900">{vendor.name}</h3>
                {vendor.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-sky-500" aria-label="Verified" />}
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
                {vendor.reviewCount > 0 ? (
                  <span className="flex items-center gap-1 font-medium text-neutral-700">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {vendor.averageRating.toFixed(1)}
                    <span className="font-normal text-neutral-400">({vendor.reviewCount})</span>
                  </span>
                ) : (
                  <span className="text-neutral-400">No reviews yet</span>
                )}
                <span>
                  {vendor.productCount} product{vendor.productCount === 1 ? '' : 's'}
                </span>
              </div>

              {vendor.verified && (
                <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-600">
                  <BadgeCheck className="h-3 w-3" /> Verified
                </span>
              )}

              <Link
                href={vendorHref(vendor.id)}
                className="mt-4 flex w-full items-center justify-center rounded-full bg-neutral-950 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-neutral-800 active:scale-95"
              >
                Visit store
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
