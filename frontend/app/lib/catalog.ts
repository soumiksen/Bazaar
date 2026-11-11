import {
  Dumbbell,
  Footprints,
  Laptop,
  CookingPot,
  Shirt,
  Sofa,
  Sparkles,
  Watch,
  type LucideIcon,
} from 'lucide-react';
import type { CatalogProduct } from '@/app/types';

export const FREE_SHIPPING_THRESHOLD = 50;
export const NEW_WINDOW_DAYS = 14;
export const BEST_SELLER_MIN_UNITS = 3;

export interface CategoryDef {
  name: string;
  icon: LucideIcon;
  tint: string;
}

/** Categories shown as tiles on the homepage (name must match product.category). */
export const FEATURED_CATEGORIES: CategoryDef[] = [
  { name: 'Beauty', icon: Sparkles, tint: 'bg-rose-100 text-rose-600' },
  { name: 'Fitness', icon: Dumbbell, tint: 'bg-emerald-100 text-emerald-600' },
  { name: 'Apparel', icon: Shirt, tint: 'bg-amber-100 text-amber-600' },
  { name: 'Kitchen', icon: CookingPot, tint: 'bg-orange-100 text-orange-600' },
  { name: 'Home', icon: Sofa, tint: 'bg-sky-100 text-sky-600' },
  { name: 'Electronics', icon: Laptop, tint: 'bg-indigo-100 text-indigo-600' },
  { name: 'Footwear', icon: Footprints, tint: 'bg-teal-100 text-teal-600' },
  { name: 'Accessories', icon: Watch, tint: 'bg-fuchsia-100 text-fuchsia-600' },
];

/** Groups for the "All Categories" mega-menu. */
export const CATEGORY_GROUPS: { title: string; items: string[] }[] = [
  { title: 'Fashion', items: ['Apparel', 'Footwear', 'Accessories'] },
  { title: 'Tech', items: ['Electronics', 'Audio', 'Cameras', 'Wearables'] },
  { title: 'Living', items: ['Home', 'Kitchen'] },
  { title: 'Health & Beauty', items: ['Beauty', 'Fitness'] },
];

export const ALL_CATEGORIES = CATEGORY_GROUPS.flatMap((group) => group.items);

export function categoryHref(category: string): string {
  return `/?category=${encodeURIComponent(category)}`;
}

export function vendorHref(vendorId: string): string {
  return `/?vendor=${encodeURIComponent(vendorId)}`;
}

export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function discountPercent(product: Pick<CatalogProduct, 'price' | 'compareAtPrice'>): number {
  const { price, compareAtPrice } = product;
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function isOnSale(product: Pick<CatalogProduct, 'price' | 'compareAtPrice'>): boolean {
  return discountPercent(product) > 0;
}

export function isNewProduct(product: Pick<CatalogProduct, 'createdAt'>, now: number = Date.now()): boolean {
  if (!product.createdAt) return false;
  const created = Date.parse(product.createdAt);
  if (Number.isNaN(created)) return false;
  return now - created <= NEW_WINDOW_DAYS * 24 * 60 * 60 * 1000;
}

export type Badge = 'Sale' | 'Best Seller' | 'New' | 'Free Shipping';

/** Badges in priority order. Only genuinely applicable badges are returned. */
export function getBadges(product: CatalogProduct): Badge[] {
  const badges: Badge[] = [];
  if (isOnSale(product)) badges.push('Sale');
  if ((product.unitsSold ?? 0) >= BEST_SELLER_MIN_UNITS) badges.push('Best Seller');
  if (isNewProduct(product)) badges.push('New');
  if (product.price >= FREE_SHIPPING_THRESHOLD) badges.push('Free Shipping');
  return badges;
}

export function newestFirst(products: CatalogProduct[]): CatalogProduct[] {
  return [...products].sort((a, b) => (Date.parse(b.createdAt ?? '') || 0) - (Date.parse(a.createdAt ?? '') || 0));
}

export function bestSellers(products: CatalogProduct[]): CatalogProduct[] {
  return [...products].sort(
    (a, b) =>
      (b.unitsSold ?? 0) - (a.unitsSold ?? 0) ||
      b.reviewCount - a.reviewCount ||
      b.averageRating - a.averageRating,
  );
}

export function topRated(products: CatalogProduct[]): CatalogProduct[] {
  return [...products].sort(
    (a, b) =>
      Number(b.reviewCount > 0) - Number(a.reviewCount > 0) ||
      b.averageRating - a.averageRating ||
      b.reviewCount - a.reviewCount,
  );
}

export function dealsFirst(products: CatalogProduct[]): CatalogProduct[] {
  return products.filter(isOnSale).sort((a, b) => discountPercent(b) - discountPercent(a));
}

export interface VendorSummary {
  id: string;
  name: string;
  verified: boolean;
  productCount: number;
  reviewCount: number;
  averageRating: number;
  images: string[];
}

export function summarizeVendors(products: CatalogProduct[]): VendorSummary[] {
  const byId = new Map<string, VendorSummary & { ratingTotal: number }>();

  for (const product of products) {
    if (!product.vendorId || !product.vendorName) continue;
    let vendor = byId.get(product.vendorId);
    if (!vendor) {
      vendor = {
        id: product.vendorId,
        name: product.vendorName,
        verified: Boolean(product.vendorVerified),
        productCount: 0,
        reviewCount: 0,
        averageRating: 0,
        images: [],
        ratingTotal: 0,
      };
      byId.set(product.vendorId, vendor);
    }
    vendor.productCount += 1;
    vendor.reviewCount += product.reviewCount;
    vendor.ratingTotal += product.averageRating * product.reviewCount;
    if (product.imageUrl && vendor.images.length < 3) vendor.images.push(product.imageUrl);
  }

  return [...byId.values()]
    .map(({ ratingTotal, ...vendor }) => ({
      ...vendor,
      averageRating: vendor.reviewCount > 0 ? ratingTotal / vendor.reviewCount : 0,
    }))
    .sort(
      (a, b) =>
        Number(b.verified) - Number(a.verified) ||
        b.productCount - a.productCount ||
        b.averageRating - a.averageRating,
    );
}

export function productsInCategory(products: CatalogProduct[], category: string): CatalogProduct[] {
  const wanted = category.toLowerCase();
  return products.filter((product) => product.category.toLowerCase() === wanted);
}
