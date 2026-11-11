'use client';

import { useState } from 'react';
import { CheckCircle2, Mail } from 'lucide-react';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();

    if (!value) {
      setError('Please enter your email address.');
      return;
    }
    if (!EMAIL_PATTERN.test(value)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError(null);
    setSubscribed(true);
  };

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="rounded-3xl border border-white/40 bg-gradient-to-br from-sky-100/80 via-white/60 to-amber-100/70 p-6 text-center shadow-xs ring-1 ring-black/[0.03] md:p-10"
    >
      <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-neutral-950 text-white shadow-md">
        <Mail className="h-5 w-5" />
      </span>
      <h2 id="newsletter-heading" className="text-2xl font-black tracking-tight text-neutral-900">
        Get 10% off your first order
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-neutral-600">
        Join our newsletter for new arrivals, exclusive deals and seller spotlights. Unsubscribe anytime.
      </p>

      {subscribed ? (
        <p role="status" className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2 rounded-2xl bg-white/70 px-4 py-3 text-sm font-semibold text-emerald-700">
          <CheckCircle2 className="h-4 w-4" /> Thanks for subscribing! Check your inbox soon.
        </p>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mx-auto mt-6 max-w-md">
          <div className="flex items-center rounded-full border border-zinc-200 bg-white/70 p-1 backdrop-blur-sm focus-within:border-neutral-300 focus-within:bg-white">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'newsletter-error' : undefined}
              className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-neutral-800 placeholder-neutral-400 outline-none"
            />
            <button
              type="submit"
              className="shrink-0 cursor-pointer rounded-full bg-neutral-950 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-neutral-800 active:scale-95"
            >
              Subscribe
            </button>
          </div>
          {error && (
            <p id="newsletter-error" role="alert" className="mt-2 text-xs font-medium text-red-500">
              {error}
            </p>
          )}
        </form>
      )}
    </section>
  );
}
