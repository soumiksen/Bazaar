import { notFound } from 'next/navigation';
import { ApiError, getProduct } from '@/app/lib/api';
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

  return <ProductDetailView product={product} />;
}
