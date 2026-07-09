'use client';

import { SubmitEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button, { buttonVariants } from '@/app/components/Button';
import AuthCard from '@/app/components/AuthCard';
import FormField from '@/app/components/FormField';
import { ApiError, signup } from '@/app/lib/api';
import { useAuthStore } from '@/app/store/authStore';
import { useRequireGuest } from '@/app/hooks/useRequireGuest';
import { ERROR_BANNER_STYLES } from '@/app/constants';

export default function VendorSignUpPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const isCheckingGuest = useRequireGuest();
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // storeName isn't persisted yet — the phase-1 auth API has no vendor-profile fields.
      const auth = await signup({ name, email, password, role: 'VENDOR' });
      setSession(auth);
      router.push('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingGuest) return null;

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
        {error && <div className={ERROR_BANNER_STYLES}>{error}</div>}

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
          <Button type="submit" variant="primary" width="full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create Vendor Account'}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
