'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { InternalLink, Stack, Text } from '@components';
import { useRouter } from '@/i18n/navigation';
import type { VerifyEmailRes } from '@/contracts/api/auth/auth.contract';
import { VerifyEmailReqSchema } from '@/contracts/api/auth/auth.validation';

type VerifyState = 'loading' | 'success' | 'error';

type VerificationOutcome =
  | { kind: 'success' }
  | { kind: 'validation-error'; key: string }
  | { kind: 'api-error'; code: string };

async function verifyToken(token: string): Promise<VerificationOutcome> {
  try {
    const parsedToken = VerifyEmailReqSchema.safeParse({ token });

    if (!parsedToken.success) {
      return {
        kind: 'validation-error',
        key: parsedToken.error.flatten().fieldErrors.token?.[0] ?? 'REQUIRED',
      };
    }

    const res = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsedToken.data),
    });

    const data = (await res.json()) as VerifyEmailRes;

    if (data.ok) return { kind: 'success' };

    if (data.error.code === 'VALIDATION_ERROR') {
      return {
        kind: 'validation-error',
        key: data.error.details?.fields.token?.[0] ?? 'REQUIRED',
      };
    }

    return { kind: 'api-error', code: data.error.code };
  } catch {
    return { kind: 'api-error', code: 'FETCH_FAILED' };
  }
}

export function VerifyEmailClient() {
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
      const verification = await verifyToken(token);
      if (!mounted) return;

      if (verification.kind === 'success') {
        setState('success');
        setMessage(t('verification.verified'));
        router.replace('/profile');
        return;
      }

      setState('error');

      if (verification.kind === 'validation-error') {
        setMessage(tValidation(verification.key));
        return;
      }

      if (verification.code === 'AUTH_TOKEN_EXPIRED' || verification.code === 'AUTH_FORBIDDEN') {
        setMessage(t('verification.invalidOrExpired'));
        return;
      }

      setMessage(tErrors(verification.code));
    }

    void runVerification();

    return () => {
      mounted = false;
    };
  }, [router, t, tErrors, tValidation, token]);

  return (
    <Stack>
      <Text as="p" variant="body-sm">
        {message}
      </Text>
      {state === 'error' && (
        <InternalLink href="/resend-verification">{t('actions.resendEmail')}</InternalLink>
      )}
      {state !== 'loading' && (
        <InternalLink href="/login" as="link">
          {t('verification.backToLogin')}
        </InternalLink>
      )}
    </Stack>
  );
}
