'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button, { buttonVariants } from '@/app/components/Button';
import { GLASS_STYLES, INPUT_STYLES, LABEL_STYLES } from '@/app/constants';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12 animate-in fade-in duration-500">
      <div className={`w-full max-w-md p-6 sm:p-8 space-y-6 ${GLASS_STYLES.container}`}>

        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-black tracking-tight text-neutral-900">Welcome back.</h1>
          <p className="text-xs text-neutral-400 font-medium uppercase tracking-widest">
            Sign in to continue to bazaar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className={LABEL_STYLES}>Email Address</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className={INPUT_STYLES}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label htmlFor="password" className={LABEL_STYLES}>Password</label>
              <a href="#" className="text-[10px] font-bold text-neutral-500 hover:underline">
                Forgot?
              </a>
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={INPUT_STYLES}
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" width="full">
              Sign In
            </Button>
          </div>
        </form>

        <hr className="border-white/20" />

        <div className="space-y-3 text-center">
          <p className="text-xs text-neutral-400 font-medium">New to our platform?</p>
          <Link href="/signup" className={buttonVariants({ variant: 'secondary', width: 'full' })}>
            Create an account
          </Link>
        </div>

      </div>
    </div>
  );
}
