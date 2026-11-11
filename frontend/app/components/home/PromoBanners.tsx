import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD, categoryHref, productsInCategory } from '@/app/lib/catalog';
import type { CatalogProduct } from '@/app/types';

export default function PromoBanners({ products }: { products: CatalogProduct[] }) {
  const banners = [
    {
      eyebrow: 'Free shipping',
      title: `On every order over $${FREE_SHIPPING_THRESHOLD}`,
      cta: 'Start shopping',
      href: '/',
      imageUrl: productsInCategory(products, 'Electronics')[0]?.imageUrl,
      gradient: 'from-sky-200/90 to-cyan-100/80',
    },
    {
      eyebrow: 'Wellness',
      title: 'Gear up for your best workout',
      cta: 'Shop fitness',
      href: categoryHref('Fitness'),
      imageUrl: productsInCategory(products, 'Fitness')[0]?.imageUrl,
      gradient: 'from-emerald-200/90 to-teal-100/80',
    },
    {
      eyebrow: 'Style',
      title: 'Your next favourite outfit',
      cta: 'Shop apparel',
      href: categoryHref('Apparel'),
      imageUrl: productsInCategory(products, 'Apparel')[0]?.imageUrl,
      gradient: 'from-amber-200/90 to-rose-100/80',
    },
  ];

  return (
    <section aria-label="Promotions" className="grid gap-4 md:grid-cols-3">
      {banners.map((banner) => (
        <Link
          key={banner.title}
          href={banner.href}
          className={`group relative flex min-h-40 items-center overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br p-6 shadow-xs ring-1 ring-black/[0.03] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-neutral-900/10 ${banner.gradient}`}
        >
          {banner.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={banner.imageUrl}
              alt=""
              loading="lazy"
              className="absolute inset-y-0 right-0 h-full w-2/5 object-cover opacity-90 mix-blend-multiply transition-transform duration-700 group-hover:scale-105 [mask-image:linear-gradient(to_right,transparent,black_40%)]"
            />
          )}
          <div className="relative max-w-[60%]">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500">{banner.eyebrow}</p>
            <p className="mt-1 text-lg font-black leading-snug tracking-tight text-neutral-900">{banner.title}</p>
            <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-800">
              {banner.cta}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}
