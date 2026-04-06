'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { InternalLink, Stack, Text } from '@components';
import { type VerifyEmailRes } from '@/contracts/api/auth/auth.contract';
import { VerifyEmailReqSchema } from '@/contracts/api/auth/auth.validation';

type VerifyState = 'loading' | 'success' | 'error';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations('features.auth');
  const tErrors = useTranslations('errors');
  const tValidation = useTranslations('validation');
  const token = useMemo(() => searchParams.get('token')?.trim() ?? '', [searchParams]);
  const [state, setState] = useState<VerifyState>('loading');
  const [message, setMessage] = useState(t('verification.verifying'));

  useEffect(() => {
    let mounted = true;

    async function runVerification() {
      const parsedToken = VerifyEmailReqSchema.safeParse({ token });

      if (!parsedToken.success) {
        if (!mounted) return;
        setState('error');
        setMessage(tValidation(parsedToken.error.flatten().fieldErrors.token?.[0] ?? 'REQUIRED'));
        return;
      }

      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedToken.data),
      });

      const data = (await res.json()) as VerifyEmailRes;

      if (!mounted) return;

      if (data.ok) {
        setState('success');
        setMessage(t('verification.verified'));
        router.replace('/profile');
        return;
      }

      setState('error');
      if (data.error.code === 'VALIDATION_ERROR') {
        setMessage(tValidation(data.error.details?.fields.token?.[0] ?? 'REQUIRED'));
        return;
      }

      if (data.error.code === 'AUTH_TOKEN_EXPIRED' || data.error.code === 'AUTH_FORBIDDEN') {
        setMessage(t('verification.invalidOrExpired'));
        return;
      }

      setMessage(tErrors(data.error.code));
    }

    void runVerification();

    return () => {
      mounted = false;
    };
  }, [router, t, tErrors, tValidation, token]);

  return (
    <main className="mx-auto max-w-[520px] p-6">
      <Stack>
        <Text as="h1" variant="heading-md">
          {t('verification.title')}
        </Text>
        <Text as="p" variant="body-sm">
          {message}
        </Text>
        {state === 'error' && (
          <InternalLink as="button" href="/create-account/success">
            {t('actions.resendEmail')}
          </InternalLink>
        )}
        {state !== 'loading' && (
          <InternalLink href="/login" as="link">
            {t('verification.backToLogin')}
          </InternalLink>
        )}
      </Stack>
    </main>
  );
}
