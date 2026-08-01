import { notFound } from 'next/navigation';
import { ApiError, getProduct, getProductReviews } from '@/app/lib/api';
import ProductDetailView from '@/app/components/ProductDetailView';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;

  const product = await getProduct(id).catch((error) => {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  });

  const reviews = await getProductReviews(id).catch(() => ({ items: [], totalCount: 0, averageRating: 0 }));

  return <ProductDetailView product={product} reviews={reviews} />;
}
