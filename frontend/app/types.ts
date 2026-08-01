export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductReviews {
  items: Review[];
  totalCount: number;
  averageRating: number;
}

export interface CatalogProduct {
  id: string;
  title: string;
  category: string;
  price: number;
  imageUrl: string | null;
  averageRating: number;
  reviewCount: number;
}

export interface ProductDetail {
  id: string;
  title: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  description: string | null;
  vendorName: string;
  createdAt: string;
  averageRating: number;
  reviewCount: number;
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  category: string;
  price: number;
  imageUrl: string | null;
  stock: number;
  quantity: number;
}

export interface CartSummary {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
}

export interface LikedProduct {
  id: string;
  productId: string;
  title: string;
  category: string;
  price: number;
  imageUrl: string | null;
  stock: number;
}

export interface LikesSummary {
  items: LikedProduct[];
  totalCount: number;
}

export type VendorProductStatus = 'ACTIVE' | 'DRAFT';

export interface VendorProduct {
  id: string;
  title: string;
  category: string;
  price: number;
  stock: number;
  status: VendorProductStatus;
  imageUrl: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VendorProductInput {
  title: string;
  category: string;
  price: number;
  stock: number;
  status: VendorProductStatus;
  imageUrl: string;
  description: string;
}
