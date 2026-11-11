import Link from 'next/link';
import { X } from 'lucide-react';
import { listCatalogProducts, searchProducts } from '@/app/lib/api';
import { GLASS_STYLES } from '@/app/constants';
import { dealsFirst, isNewProduct, newestFirst } from '@/app/lib/catalog';
import type { CatalogProduct } from '@/app/types';
import ProductGrid from './components/home/ProductGrid';
import Hero from './components/home/Hero';
import CategoryTiles from './components/home/CategoryTiles';
import FlashDeals from './components/home/FlashDeals';
import FeaturedProducts from './components/home/FeaturedProducts';
import TopVendors from './components/home/TopVendors';
import PromoBanners from './components/home/PromoBanners';
import SellerCta from './components/home/SellerCta';
import TrustBadges from './components/home/TrustBadges';
import Newsletter from './components/home/Newsletter';

interface HomeProps {
  searchParams: Promise<{ q?: string; category?: string; vendor?: string; view?: string }>;
}

const VIEW_TITLES: Record<string, string> = {
  deals: 'Deals',
  new: 'New arrivals',
  all: 'All products',
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? '';
  const category = params.category?.trim() ?? '';
  const vendorId = params.vendor?.trim() ?? '';
  const view = params.view?.trim() ?? '';
  const isFiltered = Boolean(query || category || vendorId || view);

  const catalog = await listCatalogProducts().catch((): CatalogProduct[] => []);

  if (!isFiltered) {
    if (catalog.length === 0) {
      return (
        <div className={`p-12 text-center text-sm text-neutral-500 font-medium ${GLASS_STYLES.container}`}>
          No products are available yet. Check back soon.
        </div>
      );
    }

    return (
      <div className="space-y-12">
        <Hero products={catalog} />
        <CategoryTiles products={catalog} />
        <FlashDeals deals={dealsFirst(catalog).slice(0, 12)} />
        <FeaturedProducts products={catalog} />
        <TopVendors products={catalog} />
        <PromoBanners products={catalog} />
        <SellerCta />
        <TrustBadges />
        <Newsletter />
      </div>
    );
  }

  // ---- Filtered / search results ----
  let products: CatalogProduct[];
  if (query) {
    const results = await searchProducts(query).catch((): CatalogProduct[] => []);
    // Enrich search hits with full catalog data (ratings, vendor, sale price) when available.
    const byId = new Map(catalog.map((product) => [product.id, product]));
    products = results.map((result) => byId.get(result.id) ?? result);
  } else {
    products = catalog;
  }

  if (category) products = products.filter((product) => product.category.toLowerCase() === category.toLowerCase());
  if (vendorId) products = products.filter((product) => product.vendorId === vendorId);
  if (view === 'deals') products = dealsFirst(products);
  if (view === 'new') products = newestFirst(products).filter((product) => isNewProduct(product));

  const vendorName = vendorId ? catalog.find((product) => product.vendorId === vendorId)?.vendorName : undefined;
  const title = vendorName
    ? vendorName
    : query
      ? `Results for “${query}”`
      : category || VIEW_TITLES[view] || 'Products';

  const chips = [
    category && { label: category },
    vendorName && { label: `Store: ${vendorName}` },
    view && VIEW_TITLES[view] && { label: VIEW_TITLES[view] },
  ].filter(Boolean) as { label: string }[];

  return (
    <div className="space-y-6">
      <div className="px-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">
          {products.length} result{products.length === 1 ? '' : 's'}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900">{title}</h1>
        {(chips.length > 0 || query) && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {chips.map((chip) => (
              <span key={chip.label} className="rounded-full border border-white/60 bg-white/60 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                {chip.label}
              </span>
            ))}
            <Link href="/" className="flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-black">
              <X className="h-3.5 w-3.5" /> Clear filters
            </Link>
          </div>
        )}
      </div>

      {products.length === 0 ? (
        <div className={`p-12 text-center text-sm text-neutral-500 font-medium ${GLASS_STYLES.container}`}>
          No products found{query ? ` for “${query}”` : ''}.{' '}
          <Link href="/" className="font-semibold text-neutral-800 underline underline-offset-4">
            Browse everything
          </Link>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
