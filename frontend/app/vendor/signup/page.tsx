'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import Button, { buttonVariants } from '@/app/components/Button';
import AuthCard from '@/app/components/AuthCard';
import FormField from '@/app/components/FormField';

export default function VendorSignUpPage() {
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log({ name, storeName, email, password });
  };

  return (
    <AuthCard
      badge="Vendor Portal"
      title="Start selling."
      subtitle="Set up your store on bazaar today."
      footer={
        <>
          <p className="text-xs text-neutral-400 font-medium">Already selling on bazaar?</p>
          <Link href="/vendor/signin" className={buttonVariants({ variant: 'secondary', width: 'full' })}>
            Sign in to your store
          </Link>
          <p className="text-[11px] text-neutral-400 pt-1">
            Looking to shop instead?{' '}
            <Link href="/signup" className="font-bold text-neutral-600 hover:underline">
              Create a customer account
            </Link>
          </p>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          id="name"
          label="Full Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Soumik Sen"
        />

        <FormField
          id="storeName"
          label="Store Name"
          required
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          placeholder="Soumik's Emporium"
        />

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
        />

        <div className="pt-2">
          <Button type="submit" variant="primary" width="full">
            Create Vendor Account
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
