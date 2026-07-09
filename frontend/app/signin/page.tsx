'use client';

import { SubmitEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button, { buttonVariants } from '@/app/components/Button';
import AuthCard from '@/app/components/AuthCard';
import FormField from '@/app/components/FormField';
import { ApiError, signin } from '@/app/lib/api';
import { useAuthStore } from '@/app/store/authStore';
import { useRequireGuest } from '@/app/hooks/useRequireGuest';
import { ERROR_BANNER_STYLES } from '@/app/constants';

export default function SignInPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const isCheckingGuest = useRequireGuest();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const auth = await signin({ email, password });
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
        {error && <div className={ERROR_BANNER_STYLES}>{error}</div>}

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
          <Button type="submit" variant="primary" width="full" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
