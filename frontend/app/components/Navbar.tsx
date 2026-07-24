'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  MagnifyingGlassIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import { GLASS_STYLES } from '../constants';
import { logout as logoutRequest, suggestProducts } from '@/app/lib/api';
import { useAuthStore, selectIsAuthenticated } from '@/app/store/authStore';
import { useCartStore } from '@/app/store/cartStore';
import type { CatalogProduct } from '@/app/types';

const SUGGESTION_DEBOUNCE_MS = 200;

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export default function Navbar({ onSearch }: NavbarProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const clearSession = useAuthStore((state) => state.clearSession);
  const isLoggedIn = useAuthStore(selectIsAuthenticated);
  const cartItems = useCartStore((state) => state.totalQuantity);

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CatalogProduct[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSuggestions(true);
    onSearch?.(query);
  };

  const goToSearchResults = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setShowSuggestions(false);
    router.push(`/?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToSearchResults(searchQuery);
  };

  const handleSuggestionSelect = (product: CatalogProduct) => {
    setShowSuggestions(false);
    setSearchQuery('');
    router.push(`/products/${product.id}`);
  };

  // Debounced autocomplete suggestions as the user types
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      suggestProducts(trimmed)
        .then(setSuggestions)
        .catch(() => setSuggestions([]));
    }, SUGGESTION_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setShowProfile(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowProfile(false);
    const tokenToRevoke = refreshToken;
    clearSession();
    if (tokenToRevoke) {
      logoutRequest(tokenToRevoke).catch(() => {});
    }
    router.push('/');
  };

  return (
    <nav className={`sticky top-4 z-50 mx-4 px-6 py-3.5 ${GLASS_STYLES.container}`}>
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-8">

          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white font-black text-sm shadow-md">
              b
            </div>
            <span className="text-xl font-bold tracking-tight text-neutral-800">
              bazaar.
            </span>
          </Link>

          {/* Search Bar Section */}
          <div className="flex-1 max-w-md relative" ref={searchRef}>
            <label htmlFor="navbar-search" className="sr-only">
              Search products
            </label>
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                id="navbar-search"
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search products..."
                autoComplete="off"
                className="w-full rounded-full border border-zinc-200 bg-white/40 py-2.5 pl-5 pr-12 text-sm text-neutral-800 placeholder-neutral-500 outline-none backdrop-blur-sm transition-all focus:bg-white/60 focus:border-neutral-300"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white shadow transition-colors hover:bg-neutral-800 cursor-pointer"
              >
                <MagnifyingGlassIcon className="h-4 w-4" />
              </button>
            </form>

            {showSuggestions && searchQuery.trim() && suggestions.length > 0 && (
              <div
                role="listbox"
                className="absolute left-0 right-0 mt-2 rounded-2xl border border-white/40 bg-white p-2 shadow-xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                {suggestions.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    role="option"
                    aria-selected="false"
                    onClick={() => handleSuggestionSelect(product)}
                    className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-white/60 cursor-pointer"
                  >
                    <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                      {product.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-neutral-800">{product.title}</p>
                      <p className="truncate text-xs text-neutral-400">{product.category}</p>
                    </div>
                    <span className="flex-shrink-0 text-xs font-bold text-neutral-600">
                      ${product.price.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side Actions Section */}
          <div className="flex items-center gap-3">

            {/* Shopping Cart Button */}
            <Link
              href="/cart"
              aria-label={`Cart, ${cartItems} item${cartItems === 1 ? '' : 's'}`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/40 text-neutral-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-white/60"
            >
              <ShoppingBagIcon className="h-5 w-5" />
              {cartItems > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white/50">
                  {cartItems}
                </span>
              )}
            </Link>

            {/* Profile Dropdown / User Badge */}
            <div className="relative" ref={profileRef}>
              {isLoggedIn && user ? (
                <button
                  onClick={() => setShowProfile((prev) => !prev)}
                  aria-haspopup="true"
                  aria-expanded={showProfile}
                  className="flex items-center gap-3 rounded-full border border-white/40 bg-white/40 p-1 pl-4 shadow-sm backdrop-blur-sm outline-none transition-colors hover:bg-white/60 cursor-pointer"
                >
                  <span className="text-sm font-medium text-neutral-700">
                    {user.name}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-neutral-900 border border-white/40 shadow-sm text-white text-xs font-bold uppercase">
                    {user.name.charAt(0)}
                  </div>
                </button>
              ) : (
                <Link
                  href="/signin"
                  className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-neutral-800"
                >
                  Sign In
                </Link>
              )}

              {/* Profile Dropdown Menu */}
              {showProfile && isLoggedIn && user && (
                <div
                  role="menu"
                  className="absolute right-0 mt-3 w-48 rounded-2xl border border-white/40 bg-white p-2 shadow-xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <Link
                    href="/profile"
                    role="menuitem"
                    onClick={() => setShowProfile(false)}
                    className="block rounded-xl px-4 py-2 text-sm text-neutral-700 transition-colors hover:bg-white/50"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/orders"
                    role="menuitem"
                    onClick={() => setShowProfile(false)}
                    className="block rounded-xl px-4 py-2 text-sm text-neutral-700 transition-colors hover:bg-white/50"
                  >
                    Order History
                  </Link>
                  <hr className="my-1.5 border-white/30" />
                  <button
                    onClick={handleLogout}
                    role="menuitem"
                    className="w-full text-left rounded-xl px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50/50 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
}
