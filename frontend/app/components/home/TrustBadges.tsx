import { PackageCheck, RotateCcw, ShieldCheck, Truck } from 'lucide-react';

const BADGES = [
  { icon: ShieldCheck, title: 'Secure payments', text: 'Encrypted checkout powered by Stripe' },
  { icon: PackageCheck, title: 'Buyer protection', text: 'Get help if your order isn’t right' },
  { icon: Truck, title: 'Fast delivery', text: 'Free shipping on orders over $50' },
  { icon: RotateCcw, title: 'Easy returns', text: 'Simple returns on eligible items' },
];

export default function TrustBadges() {
  return (
    <section aria-label="Why shop with us">
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {BADGES.map(({ icon: Icon, title, text }) => (
          <li
            key={title}
            className="flex items-center gap-3 rounded-3xl border border-white/30 bg-white/40 p-4 shadow-xs ring-1 ring-black/[0.03] backdrop-blur-xl"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-white shadow-md">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-800">{title}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-neutral-500">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
