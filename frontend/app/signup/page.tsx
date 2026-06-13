'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/app/components/Button';
import { GLASS_STYLES } from '@/app/constants';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle credentials registration logic here
    console.log({ name, email, password });
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12 animate-in fade-in duration-500">
      <div className={`w-full max-w-md p-6 sm:p-8 space-y-6 ${GLASS_STYLES.container}`}>
        
        {/* Heading Section */}
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-black tracking-tight text-neutral-900">Get started.</h1>
          <p className="text-xs text-neutral-400 font-medium uppercase tracking-widest">
            Create your bazaar account today.
          </p>
        </div>

        {/* Credentials Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block pl-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Soumik Sen"
              className="w-full rounded-2xl border border-zinc-200 bg-white/40 p-3.5 text-sm text-neutral-800 placeholder-neutral-400 outline-none backdrop-blur-sm transition-all focus:bg-white/60 focus:border-neutral-300"
            />
          </div>

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
            <label htmlFor="password" className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block pl-1">
              Password
            </label>
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
              Create Account
            </Button>
          </div>
        </form>

        <hr className="border-white/20" />

        {/* Redirect back to Login */}
        <div className="space-y-3 text-center">
          <p className="text-xs text-neutral-400 font-medium">Already have an account?</p>
          <Link href="/signin" className="block w-full">
            <Button variant="secondary" width="full">
              Sign in to your account
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}