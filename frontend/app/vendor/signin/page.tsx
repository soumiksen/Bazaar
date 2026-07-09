'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import Button, { buttonVariants } from '@/app/components/Button';
import AuthCard from '@/app/components/AuthCard';
import FormField from '@/app/components/FormField';

export default function VendorSignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <AuthCard
      badge="Vendor Portal"
      title="Welcome back, seller."
      subtitle="Sign in to manage your bazaar store."
      footer={
        <>
          <p className="text-xs text-neutral-400 font-medium">New to selling on bazaar?</p>
          <Link href="/vendor/signup" className={buttonVariants({ variant: 'secondary', width: 'full' })}>
            Create a vendor account
          </Link>
          <p className="text-[11px] text-neutral-400 pt-1">
            Shopping instead?{' '}
            <Link href="/signin" className="font-bold text-neutral-600 hover:underline">
              Sign in as a customer
            </Link>
          </p>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          id="email"
          label="Email Address"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="store@example.com"
        />

        <FormField
          id="password"
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          labelAction={
            <a href="#" className="text-[10px] font-bold text-neutral-500 hover:underline">
              Forgot?
            </a>
          }
        />

        <div className="pt-2">
          <Button type="submit" variant="primary" width="full">
            Sign In
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
