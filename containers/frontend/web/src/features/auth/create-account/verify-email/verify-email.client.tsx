'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { InternalLink, Text } from '@components';
import { useRouter } from '@/i18n/navigation';
import type { VerifyEmailRes } from '@/contracts/api/auth/auth.contract';
import { verifyEmailAction } from './verify-email.action';

type VerifyState = 'loading' | 'success' | 'error';

async function verifyEmailFlow({
  token,
  router,
  setState,
  setVerification,
  isMounted,
}: {
  token: string;
  router: ReturnType<typeof useRouter>;
  setState: (s: VerifyState) => void;
  setVerification: (v: VerifyEmailRes) => void;
  isMounted: () => boolean;
}) {
  const verification = await verifyEmailAction(token);
  if (!isMounted()) return;

  setVerification(verification);

  if (verification.ok) {
    setState('success');
    router.replace('/profile');
    return;
  }

  setState('error');
}

function resolveVerificationMessage(
  verification: VerifyEmailRes | null,
  t: ReturnType<typeof useTranslations>,
  tErrors: ReturnType<typeof useTranslations>,
) {
  if (!verification) return t('verification.verifying');
  if (verification.ok) return t('verification.verified');

  switch (verification.error.code) {
    case 'VALIDATION_ERROR':
      return tErrors(verification.error.code ?? 'REQUIRED');

    case 'AUTH_TOKEN_EXPIRED':
    case 'AUTH_FORBIDDEN':
      return t('verification.invalidOrExpired');

    case 'FETCH_FAILED':
      return tErrors('FETCH_FAILED');

    case 'AUTH_INTERNAL_ERROR':
    default:
      return tErrors('AUTH_INTERNAL_ERROR');
  }
}

export function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tErrors = useTranslations('errors');
  const t = useTranslations('features.auth');
  const token = useMemo(() => searchParams.get('token')?.trim() ?? '', [searchParams]);

  const [state, setState] = useState<VerifyState>('loading');
  const [verification, setVerification] = useState<VerifyEmailRes | null>(null);

  const message = resolveVerificationMessage(verification, t, tErrors);

  useEffect(() => {
    let mounted = true;

    void verifyEmailFlow({
      token,
      router,
      setState,
      setVerification,
      isMounted: () => mounted,
    });

    return () => {
      mounted = false;
    };
  }, [router, token]);

  return (
    <>
      <Text as="p" variant="body-sm">
        {message}
      </Text>

      {state !== 'loading' && (
        <InternalLink href="/login" as="link">
          {t('verification.backToLogin')}
        </InternalLink>
      )}
    </>
  );
}
