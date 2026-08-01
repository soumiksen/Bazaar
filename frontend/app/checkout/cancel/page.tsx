import Link from 'next/link';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { GLASS_STYLES } from '@/app/constants';
import { buttonVariants } from '@/app/components/Button';

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-xl py-12 text-center animate-in fade-in duration-500">
      <div className={`p-10 space-y-6 ${GLASS_STYLES.container}`}>
        <XCircleIcon className="mx-auto h-14 w-14 text-neutral-300" />
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight text-neutral-900">Checkout Canceled</h1>
          <p className="text-sm text-neutral-500">No charge was made. Your cart is still saved.</p>
        </div>
        <Link href="/cart" className={buttonVariants({ variant: 'primary' })}>
          Back to Cart
        </Link>
      </div>
    </div>
  );
}
