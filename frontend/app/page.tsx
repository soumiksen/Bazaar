import ProductCard from "./components/Card";
import { listCatalogProducts } from "@/app/lib/api";
import { GLASS_STYLES } from "@/app/constants";

export default async function Home() {
  const products = await listCatalogProducts().catch(() => []);

  if (products.length === 0) {
    return (
      <div className={`p-12 text-center text-sm text-neutral-500 font-medium ${GLASS_STYLES.container}`}>
        No products are available yet. Check back soon.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          title={product.title}
          category={product.category}
          price={`$${product.price.toFixed(2)}`}
          imageUrl={product.imageUrl ?? undefined}
        />
      ))}
    </div>
  );
}
