import Link from 'next/link';
import HeroCarousel, { type HeroSlide } from './HeroCarousel';
import { bestSellers, categoryHref, dealsFirst, discountPercent, newestFirst, productsInCategory, topRated } from '@/app/lib/catalog';
import type { CatalogProduct } from '@/app/types';

interface PromoTile {
  label: string;
  title: string;
  href: string;
  imageUrl?: string;
}

export default function Hero({ products }: { products: CatalogProduct[] }) {
  const newest = newestFirst(products)[0];
  const deals = dealsFirst(products);
  const topDeal = deals[0];
  const featured = topRated(bestSellers(products))[0];
  const maxDiscount = topDeal ? discountPercent(topDeal) : 0;

  const slides: HeroSlide[] = [
    {
      eyebrow: 'New this season',
      title: 'Fresh finds from independent sellers',
      text: 'Discover the latest arrivals from vendors across the marketplace, added every week.',
      ctaLabel: 'Shop new arrivals',
      href: '/?view=new',
      imageUrl: newest?.imageUrl ?? undefined,
      gradient: 'from-amber-100/90 via-orange-50/80 to-rose-100/70',
    },
    {
      eyebrow: 'Limited-time offers',
      title: maxDiscount > 0 ? `Save up to ${maxDiscount}% on top picks` : 'Today’s best deals',
      text: 'Hand-picked markdowns across electronics, fashion, home and more. Prices drop while stock lasts.',
      ctaLabel: 'Shop deals',
      href: '/?view=deals',
      imageUrl: topDeal?.imageUrl ?? undefined,
      gradient: 'from-sky-100/90 via-cyan-50/80 to-indigo-100/70',
    },
    {
      eyebrow: 'Meet the makers',
      title: 'Shop stores you can trust',
      text: 'Browse verified vendors, read real reviews and buy with confidence.',
      ctaLabel: 'Explore stores',
      href: '/#vendors',
      imageUrl: featured?.imageUrl ?? undefined,
      gradient: 'from-emerald-100/90 via-teal-50/80 to-cyan-100/70',
    },
  ];

  const tiles: PromoTile[] = [
    { label: 'Skincare & fragrance', title: 'The Beauty Edit', href: categoryHref('Beauty'), imageUrl: productsInCategory(products, 'Beauty')[0]?.imageUrl ?? undefined },
    { label: 'Make it yours', title: 'Home Refresh', href: categoryHref('Home'), imageUrl: productsInCategory(products, 'Home')[0]?.imageUrl ?? undefined },
  ];

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_17rem]">
      <HeroCarousel slides={slides} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
        {tiles.map((tile) => (
          <Link
            key={tile.title}
            href={tile.href}
            className="group relative flex min-h-36 flex-col justify-end overflow-hidden rounded-3xl border border-white/40 bg-white/40 p-4 shadow-xs ring-1 ring-black/[0.03] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-neutral-900/10"
          >
            {tile.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={tile.imageUrl}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-neutral-950/10 to-transparent" />
            <div className="relative text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/70">{tile.label}</p>
              <p className="text-lg font-bold tracking-tight">{tile.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
