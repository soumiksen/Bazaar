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

export type OrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELED';

export interface CheckoutSession {
  checkoutUrl: string;
  orderId: string;
}

export interface OrderItem {
  id: string;
  productId: string | null;
  title: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  status: OrderStatus;
  subtotal: number;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderSummary {
  id: string;
  status: OrderStatus;
  subtotal: number;
  itemCount: number;
  createdAt: string;
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
