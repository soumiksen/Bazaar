import Link from 'next/link';
import { BadgeCheck, CreditCard, LayoutDashboard, Rocket, Star } from 'lucide-react';

const BENEFITS = [
  { icon: Rocket, title: 'Set up in minutes', text: 'Create your vendor account and list your first product today.' },
  { icon: LayoutDashboard, title: 'Manage everything', text: 'Update prices, stock and listings from your seller dashboard.' },
  { icon: CreditCard, title: 'Secure payments', text: 'Customers check out through Stripe, so payments stay protected.' },
  { icon: Star, title: 'Build trust', text: 'Collect verified customer reviews and ratings on every product.' },
];

export default function SellerCta() {
  return (
    <section
      aria-labelledby="sell-heading"
      className="overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 p-6 text-white shadow-xl md:p-10"
    >
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="mb-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
            <BadgeCheck className="h-3.5 w-3.5" /> For sellers
          </p>
          <h2 id="sell-heading" className="text-3xl font-black leading-tight tracking-tight md:text-4xl">
            Sell on bazaar.
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
            Turn your products into a storefront and reach shoppers browsing the marketplace every day.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/vendor/signup"
              className="rounded-full bg-white px-6 py-3 text-sm font-bold text-neutral-950 shadow-xl transition-all hover:scale-[1.03] hover:bg-neutral-100 active:scale-95"
            >
              Start selling
            </Link>
            <Link href="/vendor/signin" className="text-sm font-semibold text-white/70 underline-offset-4 hover:text-white hover:underline">
              Seller sign in
            </Link>
          </div>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <Icon className="h-4 w-4" />
              </span>
              <p className="text-sm font-bold">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-white/60">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
