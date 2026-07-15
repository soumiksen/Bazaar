export interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  comment: string;
  avatar: string;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  price: string;
  rating: number;
  imageUrl: string;
}

export interface CartItemData {
  id: string;
  title: string;
  price: string;
  category: string;
  imageUrl: string;
  quantity: number;
}

export interface VendorProduct {
  id: string;
  title: string;
  category: string;
  price: string;
  stock: number;
  status: 'active' | 'draft';
  imageUrl: string;
  description: string;
}
