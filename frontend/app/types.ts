export interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  comment: string;
  avatar: string;
}

export interface CatalogProduct {
  id: string;
  title: string;
  category: string;
  price: number;
  imageUrl: string | null;
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
