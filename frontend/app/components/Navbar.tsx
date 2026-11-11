'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Menu, Store, X } from 'lucide-react';
import {
  HeartIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import { GLASS_STYLES } from '../constants';
import { ALL_CATEGORIES, CATEGORY_GROUPS, categoryHref } from '@/app/lib/catalog';
import { logout as logoutRequest, suggestProducts } from '@/app/lib/api';
import { useAuthStore, selectIsAuthenticated } from '@/app/store/authStore';
import { useCartStore } from '@/app/store/cartStore';
import { useLikeStore } from '@/app/store/likeStore';
import type { CatalogProduct } from '@/app/types';

const SUGGESTION_DEBOUNCE_MS = 200;
const NAV_CATEGORIES = ['Beauty', 'Fitness', 'Apparel', 'Kitchen', 'Home', 'Electronics'];

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
  const likedItems = useLikeStore((state) => state.totalCount);

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CatalogProduct[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchCategory, setSearchCategory] = useState('');
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
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
    if (!trimmed && !searchCategory) return;
    setShowSuggestions(false);
    const params = new URLSearchParams();
    if (trimmed) params.set('q', trimmed);
    if (searchCategory) params.set('category', searchCategory);
    router.push(`/?${params.toString()}`);
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
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setShowMegaMenu(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setShowMegaMenu(false);
        setShowDrawer(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!showDrawer) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [showDrawer]);

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
    <nav className={`sticky top-4 z-50 mx-4 px-4 py-3.5 sm:px-6 ${GLASS_STYLES.container}`}>
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-3 md:gap-8">

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setShowDrawer(true)}
            aria-label="Open menu"
            className="-ml-2 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-neutral-700 hover:bg-white/50 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

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
          <div className="relative hidden max-w-xl flex-1 sm:block" ref={searchRef}>
            <label htmlFor="navbar-search" className="sr-only">
              Search products
            </label>
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center rounded-full border border-zinc-200 bg-white/40 backdrop-blur-sm transition-all focus-within:border-neutral-300 focus-within:bg-white/60"
            >
              <div className="relative hidden shrink-0 md:block">
                <label htmlFor="navbar-category" className="sr-only">
                  Search category
                </label>
                <select
                  id="navbar-category"
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="max-w-[9.5rem] cursor-pointer appearance-none rounded-l-full bg-transparent py-2.5 pl-5 pr-8 text-xs font-bold uppercase tracking-wider text-neutral-600 outline-none"
                >
                  <option value="">All</option>
                  {ALL_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
              </div>
              <span className="hidden h-5 w-px bg-zinc-200 md:block" aria-hidden="true" />
              <input
                id="navbar-search"
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search products, brands and stores..."
                autoComplete="off"
                className="w-full min-w-0 bg-transparent py-2.5 pl-4 pr-12 text-sm text-neutral-800 placeholder-neutral-500 outline-none"
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

            {/* Wishlist Button */}
            <Link
              href="/likes"
              aria-label={`Wishlist, ${likedItems} item${likedItems === 1 ? '' : 's'}`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/40 text-neutral-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-white/60"
            >
              <HeartIcon className="h-5 w-5" />
              {likedItems > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white/50">
                  {likedItems}
                </span>
              )}
            </Link>

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

        {/* Mobile search */}
        <form onSubmit={handleSearchSubmit} className="relative mt-3 sm:hidden">
          <label htmlFor="navbar-search-mobile" className="sr-only">
            Search products
          </label>
          <input
            id="navbar-search-mobile"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            autoComplete="off"
            className="w-full rounded-full border border-zinc-200 bg-white/40 py-2.5 pl-5 pr-12 text-sm text-neutral-800 placeholder-neutral-500 outline-none backdrop-blur-sm focus:border-neutral-300 focus:bg-white/60"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-neutral-900 text-white"
          >
            <MagnifyingGlassIcon className="h-4 w-4" />
          </button>
        </form>

        {/* Category navigation (desktop) */}
        <div ref={megaRef} className="relative mt-3 hidden border-t border-white/40 pt-2.5 lg:block">
          <ul className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-neutral-600">
            <li>
              <button
                type="button"
                onClick={() => setShowMegaMenu((prev) => !prev)}
                aria-expanded={showMegaMenu}
                aria-haspopup="true"
                className="flex cursor-pointer items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2 text-white shadow-sm transition-colors hover:bg-neutral-800"
              >
                <Menu className="h-3.5 w-3.5" />
                All Categories
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showMegaMenu ? 'rotate-180' : ''}`} />
              </button>
            </li>
            {NAV_CATEGORIES.map((category) => (
              <li key={category}>
                <Link
                  href={categoryHref(category)}
                  className="block rounded-full px-3.5 py-2 transition-colors hover:bg-white/60 hover:text-black"
                >
                  {category}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/?view=deals" className="block rounded-full px-3.5 py-2 text-red-500 transition-colors hover:bg-red-50/60">
                Deals
              </Link>
            </li>
            <li className="ml-auto">
              <Link
                href="/vendor/signup"
                className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-neutral-900 transition-colors hover:bg-white/60"
              >
                <Store className="h-3.5 w-3.5" />
                Sell on bazaar.
              </Link>
            </li>
          </ul>

          {showMegaMenu && (
            <div className="absolute left-0 right-0 top-full z-50 mt-3 rounded-3xl border border-white/40 bg-white p-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="grid grid-cols-4 gap-8">
                {CATEGORY_GROUPS.map((group) => (
                  <div key={group.title}>
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">{group.title}</p>
                    <ul className="space-y-1">
                      {group.items.map((item) => (
                        <li key={item}>
                          <Link
                            href={categoryHref(item)}
                            onClick={() => setShowMegaMenu(false)}
                            className="block rounded-xl px-3 py-2 text-sm font-medium normal-case tracking-normal text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-black"
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4 text-xs normal-case">
                <Link href="/" onClick={() => setShowMegaMenu(false)} className="font-semibold text-neutral-700 hover:underline">
                  Browse everything
                </Link>
                <Link href="/?view=deals" onClick={() => setShowMegaMenu(false)} className="font-semibold text-red-500 hover:underline">
                  Shop today&rsquo;s deals
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {showDrawer && createPortal(
        <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm" onClick={() => setShowDrawer(false)} />
          <div className="absolute inset-y-0 left-0 flex w-80 max-w-[85%] flex-col overflow-y-auto bg-white p-5 shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-xl font-bold tracking-tight text-neutral-800">bazaar.</span>
              <button
                type="button"
                onClick={() => setShowDrawer(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <Link
              href="/?view=deals"
              onClick={() => setShowDrawer(false)}
              className="mb-4 block rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold uppercase tracking-wider text-red-500"
            >
              Today&rsquo;s deals
            </Link>

            {CATEGORY_GROUPS.map((group) => (
              <div key={group.title} className="mb-4">
                <p className="mb-1 px-1 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">{group.title}</p>
                {group.items.map((item) => (
                  <Link
                    key={item}
                    href={categoryHref(item)}
                    onClick={() => setShowDrawer(false)}
                    className="block rounded-xl px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            ))}

            <div className="mt-auto space-y-1 border-t border-neutral-100 pt-4 text-sm font-medium text-neutral-700">
              <Link href="/vendor/signup" onClick={() => setShowDrawer(false)} className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-neutral-100">
                <Store className="h-4 w-4" /> Sell on bazaar.
              </Link>
              <Link href="/likes" onClick={() => setShowDrawer(false)} className="block rounded-xl px-3 py-2 hover:bg-neutral-100">
                Wishlist
              </Link>
              <Link href="/orders" onClick={() => setShowDrawer(false)} className="block rounded-xl px-3 py-2 hover:bg-neutral-100">
                Order history
              </Link>
              <Link href="/#help" onClick={() => setShowDrawer(false)} className="block rounded-xl px-3 py-2 hover:bg-neutral-100">
                Help
              </Link>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </nav>
  );
}
