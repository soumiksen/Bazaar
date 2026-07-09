'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import Button, { buttonVariants } from '@/app/components/Button';
import AuthCard from '@/app/components/AuthCard';
import FormField from '@/app/components/FormField';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log({ name, email, password });
  };

  return (
    <AuthCard
      title="Get started."
      subtitle="Create your bazaar account today."
      footer={
        <>
          <p className="text-xs text-neutral-400 font-medium">Already have an account?</p>
          <Link href="/signin" className={buttonVariants({ variant: 'secondary', width: 'full' })}>
            Sign in to your account
          </Link>
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
        />

        <div className="pt-2">
          <Button type="submit" variant="primary" width="full">
            Create Account
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
