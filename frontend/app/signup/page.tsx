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

export default function SignUpPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const isCheckingGuest = useRequireGuest();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const auth = await signup({ name, email, password, role: 'CUSTOMER' });
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
          <Button type="submit" variant="primary" width="full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
