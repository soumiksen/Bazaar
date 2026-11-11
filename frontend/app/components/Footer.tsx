import Link from 'next/link';
import { CreditCard } from 'lucide-react';

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'About',
    links: [
      { label: 'About bazaar.', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Blog', href: '#' },
    ],
  },
  {
    title: 'Customer service',
    links: [
      { label: 'Help center', href: '#' },
      { label: 'Track an order', href: '/orders' },
      { label: 'Shipping & delivery', href: '#' },
      { label: 'Returns & refunds', href: '#' },
    ],
  },
  {
    title: 'Sellers',
    links: [
      { label: 'Sell on bazaar.', href: '/vendor/signup' },
      { label: 'Seller sign in', href: '/vendor/signin' },
      { label: 'Seller handbook', href: '#' },
      { label: 'Seller policies', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of service', href: '#' },
      { label: 'Privacy policy', href: '#' },
      { label: 'Cookie policy', href: '#' },
      { label: 'Accessibility', href: '#' },
    ],
  },
];

const PAYMENT_METHODS = ['Visa', 'Mastercard', 'Amex', 'Discover', 'Apple Pay'];

function SocialIcon({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-white/50 text-neutral-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-neutral-950 hover:text-white"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        {children}
      </svg>
    </a>
  );
}

export default function Footer() {
  return (
    <footer id="help" className="relative z-10 mx-auto mt-8 w-full max-w-7xl scroll-mt-24 px-4 pb-8">
      <div className="rounded-3xl border border-white/30 bg-white/40 p-6 shadow-xs ring-1 ring-black/[0.03] backdrop-blur-xl md:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-sm font-black text-white shadow-md">b</span>
              <span className="text-xl font-bold tracking-tight text-neutral-800">bazaar.</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-neutral-500">
              A marketplace for independent sellers and the shoppers who love them.
            </p>
            <div className="mt-5 flex gap-2">
              <SocialIcon label="Instagram">
                <path d="M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 4 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.6 6.8 7 7C8.3 24 8.7 24 12 24s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 100 12.4 6.2 6.2 0 000-12.4zM12 16a4 4 0 110-8 4 4 0 010 8zm6.4-11.8a1.4 1.4 0 100 2.9 1.4 1.4 0 000-2.9z" />
              </SocialIcon>
              <SocialIcon label="Facebook">
                <path d="M24 12a12 12 0 10-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0024 12z" />
              </SocialIcon>
              <SocialIcon label="X">
                <path d="M18.2 2.3h3.3l-7.2 8.3 8.5 11.2h-6.7l-5.2-6.8-6 6.8H1.6l7.7-8.8L1.2 2.3H8l4.7 6.2 5.5-6.2zm-1.2 17.5h1.8L7.1 4.2H5.1L17 19.8z" />
              </SocialIcon>
              <SocialIcon label="YouTube">
                <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 00.5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 002.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 002.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
              </SocialIcon>
            </div>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">{column.title}</p>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-neutral-600 transition-colors hover:text-black hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/50 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-neutral-500">&copy; {new Date().getFullYear()} bazaar. All rights reserved.</p>
          <ul className="flex flex-wrap items-center gap-2" aria-label="Accepted payment methods">
            {PAYMENT_METHODS.map((method) => (
              <li
                key={method}
                className="flex items-center gap-1.5 rounded-lg border border-white/60 bg-white/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-600 shadow-sm"
              >
                <CreditCard className="h-3 w-3" />
                {method}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
