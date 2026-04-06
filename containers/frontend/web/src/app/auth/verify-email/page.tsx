'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { InternalLink, Stack, Text } from '@components';

type VerifyState = 'loading' | 'success' | 'error';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = useMemo(() => searchParams.get('token')?.trim() ?? '', [searchParams]);
  const [state, setState] = useState<VerifyState>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    let mounted = true;

    async function runVerification() {
      if (!token) {
        if (!mounted) return;
        setState('error');
        setMessage('Verification token is missing.');
        return;
      }

      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (!mounted) return;

      if (res.ok) {
        setState('success');
        setMessage('Email verified. Redirecting to profile...');
        router.replace('/profile');
        return;
      }

      setState('error');
      setMessage('Verification link is invalid or expired.');
    }

    void runVerification();
    return () => {
      mounted = false;
    };
  }, [router, token]);

  return (
    <main className="mx-auto max-w-[520px] p-6">
      <Stack>
        <Text as="h1" variant="heading-md">
          Verify email
        </Text>
        <Text as="p" variant="body-sm">
          {message}
        </Text>
        {state === 'error' && (
          <InternalLink as="button" href="/create-account/success">
            Request a new verification email
          </InternalLink>
        )}
        {state !== 'loading' && (
          <InternalLink href="/login" as="link">
            Back to login
          </InternalLink>
        )}
      </Stack>
    </main>
  );
}
