import Link from 'next/link';
import { Truck } from 'lucide-react';
import { FREE_SHIPPING_THRESHOLD } from '@/app/lib/catalog';

export default function AnnouncementBar() {
  return (
    <div className="relative z-[60] bg-neutral-950 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-[11px] font-medium tracking-wide">
        <p className="flex items-center gap-2">
          <Truck className="h-3.5 w-3.5 shrink-0" />
          <span>
            Free shipping on orders over <strong className="font-bold">${FREE_SHIPPING_THRESHOLD}</strong>
          </span>
        </p>
        <nav aria-label="Secondary" className="flex items-center gap-4 uppercase tracking-wider">
          <Link href="/vendor/signup" className="text-white/80 transition-colors hover:text-white">
            Become a seller
          </Link>
          <Link href="/#help" className="text-white/80 transition-colors hover:text-white">
            Help
          </Link>
        </nav>
      </div>
    </div>
  );
}
