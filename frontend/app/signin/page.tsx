'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/app/components/Button';
import { GLASS_STYLES } from '@/app/constants';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle credentials login logic here
    console.log({ email, password });
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12 animate-in fade-in duration-500">
      <div className={`w-full max-w-md p-6 sm:p-8 space-y-6 ${GLASS_STYLES.container}`}>
        
        {/* Heading Section */}
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-black tracking-tight text-neutral-900">Welcome back.</h1>
          <p className="text-xs text-neutral-400 font-medium uppercase tracking-widest">
            Sign in to continue to bazaar.
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block pl-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-2xl border border-zinc-200 bg-white/40 p-3.5 text-sm text-neutral-800 placeholder-neutral-400 outline-none backdrop-blur-sm transition-all focus:bg-white/60 focus:border-neutral-300"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label htmlFor="password" className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                Password
              </label>
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
              className="w-full rounded-2xl border border-zinc-200 bg-white/40 p-3.5 text-sm text-neutral-800 placeholder-neutral-400 outline-none backdrop-blur-sm transition-all focus:bg-white/60 focus:border-neutral-300"
            />
          </div>

          <div className="pt-2">
            <Button variant="primary" width="full">
              Sign In
            </Button>
          </div>
        </form>

        <hr className="border-white/20" />

        {/* Dynamic Route Switching via Secondary Button */}
        <div className="space-y-3 text-center">
          <p className="text-xs text-neutral-400 font-medium">New to our platform?</p>
          <Link href="/signup" className="block w-full">
            <Button variant="secondary" width="full">
              Create an account
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}