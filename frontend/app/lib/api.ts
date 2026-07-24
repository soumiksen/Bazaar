import { useAuthStore } from '@/app/store/authStore';
import type { CartSummary, CatalogProduct, ProductDetail, VendorProduct, VendorProductInput } from '@/app/types';

export type Role = 'CUSTOMER' | 'VENDOR' | 'ADMIN';

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface SigninRequest {
  email: string;
  password: string;
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
  user: UserSummary;
}

interface ApiErrorBody {
  message?: string;
  details?: string[];
}

export class ApiError extends Error {
  status: number;
  details: string[];

  constructor(message: string, status: number, details: string[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

async function parseResponse<TResponse>(response: Response): Promise<TResponse> {
  if (!response.ok) {
    const errorBody: ApiErrorBody = await response.json().catch(() => ({}));
    const detailMessage = errorBody.details?.[0];
    throw new ApiError(
      detailMessage ?? errorBody.message ?? 'Something went wrong. Please try again.',
      response.status,
      errorBody.details ?? []
    );
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return response.json() as Promise<TResponse>;
}

async function postJson<TResponse>(path: string, body: unknown): Promise<TResponse> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError('Could not reach the server. Please try again.', 0);
  }

  return parseResponse<TResponse>(response);
}

export function signup(request: SignupRequest): Promise<AuthResponse> {
  return postJson<AuthResponse>('/api/auth/signup', request);
}

export function signin(request: SigninRequest): Promise<AuthResponse> {
  return postJson<AuthResponse>('/api/auth/signin', request);
}

export function logout(refreshToken: string): Promise<void> {
  return postJson<void>('/api/auth/logout', { refreshToken });
}

export async function listCatalogProducts(): Promise<CatalogProduct[]> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/api/products`);
  } catch {
    throw new ApiError('Could not reach the server. Please try again.', 0);
  }

  return parseResponse<CatalogProduct[]>(response);
}

export async function getProduct(id: string): Promise<ProductDetail> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/api/products/${id}`);
  } catch {
    throw new ApiError('Could not reach the server. Please try again.', 0);
  }

  return parseResponse<ProductDetail>(response);
}

export async function searchProducts(query: string): Promise<CatalogProduct[]> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/api/products/search?q=${encodeURIComponent(query)}`);
  } catch {
    throw new ApiError('Could not reach the server. Please try again.', 0);
  }

  return parseResponse<CatalogProduct[]>(response);
}

export async function suggestProducts(query: string): Promise<CatalogProduct[]> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/api/products/search/suggest?q=${encodeURIComponent(query)}`);
  } catch {
    throw new ApiError('Could not reach the server. Please try again.', 0);
  }

  return parseResponse<CatalogProduct[]>(response);
}

/**
 * Attaches the current access token and transparently retries once after a
 * silent token refresh if the server reports the token as expired/invalid.
 */
async function authorizedRequest<TResponse>(path: string, init: RequestInit = {}): Promise<TResponse> {
  const doFetch = (accessToken: string | null) =>
    fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });

  let response: Response;

  try {
    response = await doFetch(useAuthStore.getState().accessToken);
  } catch {
    throw new ApiError('Could not reach the server. Please try again.', 0);
  }

  if (response.status === 401) {
    const refreshToken = useAuthStore.getState().refreshToken;

    if (refreshToken) {
      try {
        const refreshed = await postJson<AuthResponse>('/api/auth/refresh', { refreshToken });
        useAuthStore.getState().setSession(refreshed);
        response = await doFetch(refreshed.accessToken);
      } catch {
        useAuthStore.getState().clearSession();
      }
    } else {
      useAuthStore.getState().clearSession();
    }
  }

  return parseResponse<TResponse>(response);
}

export function listVendorProducts(): Promise<VendorProduct[]> {
  return authorizedRequest<VendorProduct[]>('/api/vendor/products');
}

export function createVendorProduct(input: VendorProductInput): Promise<VendorProduct> {
  return authorizedRequest<VendorProduct>('/api/vendor/products', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateVendorProduct(id: string, input: VendorProductInput): Promise<VendorProduct> {
  return authorizedRequest<VendorProduct>(`/api/vendor/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export function deleteVendorProduct(id: string): Promise<void> {
  return authorizedRequest<void>(`/api/vendor/products/${id}`, { method: 'DELETE' });
}

export function getCart(): Promise<CartSummary> {
  return authorizedRequest<CartSummary>('/api/cart');
}

export function addCartItem(productId: string, quantity: number = 1): Promise<CartSummary> {
  return authorizedRequest<CartSummary>('/api/cart/items', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  });
}

export function updateCartItemQuantity(cartItemId: string, quantity: number): Promise<CartSummary> {
  return authorizedRequest<CartSummary>(`/api/cart/items/${cartItemId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(cartItemId: string): Promise<CartSummary> {
  return authorizedRequest<CartSummary>(`/api/cart/items/${cartItemId}`, { method: 'DELETE' });
}
