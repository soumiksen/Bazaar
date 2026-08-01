import ProductCard from "./components/Card";
import { listCatalogProducts, searchProducts } from "@/app/lib/api";
import { GLASS_STYLES } from "@/app/constants";

interface HomeProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? '';
  const isSearching = query.length > 0;

  const products = isSearching
    ? await searchProducts(query).catch(() => [])
    : await listCatalogProducts().catch(() => []);

  if (products.length === 0) {
    return (
      <div className={`p-12 text-center text-sm text-neutral-500 font-medium ${GLASS_STYLES.container}`}>
        {isSearching ? `No products found for "${query}".` : 'No products are available yet. Check back soon.'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isSearching && (
        <p className="px-1 text-xs text-neutral-400 font-medium uppercase tracking-widest">
          {products.length} result{products.length === 1 ? '' : 's'} for &ldquo;{query}&rdquo;
        </p>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.title}
            category={product.category}
            price={`$${product.price.toFixed(2)}`}
            rating={product.averageRating}
            reviewCount={product.reviewCount}
            imageUrl={product.imageUrl ?? undefined}
          />
        ))}
      </div>
    </div>
  );
}
