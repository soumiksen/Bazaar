import ProductCard from '../Card';
import type { CatalogProduct } from '@/app/types';

export function productCardProps(product: CatalogProduct) {
  return {
    id: product.id,
    title: product.title,
    category: product.category,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    rating: product.averageRating,
    reviewCount: product.reviewCount,
    imageUrl: product.imageUrl ?? undefined,
    vendorId: product.vendorId,
    vendorName: product.vendorName,
    vendorVerified: product.vendorVerified,
    createdAt: product.createdAt,
    unitsSold: product.unitsSold,
  };
}

/** Responsive product grid: 2 columns on mobile, 3 on tablet, 4 on desktop. */
export default function ProductGrid({ products }: { products: CatalogProduct[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} {...productCardProps(product)} />
      ))}
    </div>
  );
}
