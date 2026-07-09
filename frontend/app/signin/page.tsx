'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import Button, { buttonVariants } from '@/app/components/Button';
import AuthCard from '@/app/components/AuthCard';
import FormField from '@/app/components/FormField';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <AuthCard
      title="Welcome back."
      subtitle="Sign in to continue to bazaar."
      footer={
        <>
          <p className="text-xs text-neutral-400 font-medium">New to our platform?</p>
          <Link href="/signup" className={buttonVariants({ variant: 'secondary', width: 'full' })}>
            Create an account
          </Link>
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
          placeholder="name@example.com"
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
