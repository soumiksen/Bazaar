'use client';

import Link from 'next/link';
import { ArrowLeftIcon, CreditCardIcon } from '@heroicons/react/24/solid';
import CartItem from '@/app/components/CartItem';
import { GLASS_STYLES } from '../constants';

export default function CartPage() {
  // Mock cart items
  const cartItems = [
    {
      id: '1',
      title: "Sequoia Inspiring Musico.",
      category: "Electronics",
      price: "$199.00",
      quantity: 1,
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&auto=format&fit=crop&q=80"
    },
    {
      id: '2',
      title: "Smart VR Headset Pro",
      category: "Gadgets",
      price: "$599.00",
      quantity: 2,
      imageUrl: "https://images.unsplash.com/photo-1592477942940-01fbeb590d7e?w=300&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header with Navigation Back */}
      <div className="flex items-center justify-between px-1">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-neutral-900">Your Shopping Bag</h1>
          <p className="text-xs text-neutral-400 font-medium uppercase tracking-widest">3 items in your selection</p>
        </div>
        <Link 
          href="/" 
          className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/30 px-4 py-2 text-sm font-medium text-neutral-700 backdrop-blur-md transition-all hover:bg-white/60"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Wide Glassy List */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {cartItems.map((item) => (
            <CartItem key={item.id} {...item} />
          ))}
        </div>

        {/* Right Side: Order Summary Glassy Panel */}
        <aside className="lg:col-span-4 sticky top-28">
          <div className={`p-6 space-y-6 ${GLASS_STYLES.container}`}>
            <h2 className="text-xl font-bold text-neutral-800 tracking-tight">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium text-neutral-500">
                <span>Subtotal</span>
                <span className="text-neutral-800">$1,397.00</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-neutral-500">
                <span>Shipping</span>
                <span className="text-neutral-800">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-neutral-500">
                <span>Tax (GST)</span>
                <span className="text-neutral-800">$42.50</span>
              </div>
              <hr className="border-white/20" />
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-neutral-400 uppercase">Estimated Total</span>
                <span className="text-2xl font-black text-neutral-900 leading-none">$1,439.50</span>
              </div>
            </div>

            {/* Glassy Checkout Button */}
            <button className="w-full flex items-center justify-center gap-3 rounded-full bg-neutral-950 py-4 text-sm font-bold text-white shadow-xl shadow-black/10 hover:bg-neutral-800 hover:scale-[1.02] active:scale-95 transition-all duration-300">
              <CreditCardIcon className="h-5 w-5" />
              <span>Proceed to Checkout</span>
            </button>

            {/* Payment Method Icons */}
            <div className="flex justify-center items-center gap-4 opacity-30 grayscale pointer-events-none">
              <div className="h-6 w-10 bg-neutral-400 rounded-sm" />
              <div className="h-6 w-10 bg-neutral-400 rounded-sm" />
              <div className="h-6 w-10 bg-neutral-400 rounded-sm" />
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}