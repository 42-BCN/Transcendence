'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Button, Stack, ApiFeedback } from '@components';
import { useCooldown } from '@/hooks';

import { resendVerificationAction } from './resend-verification.action';

type ResendState = 'idle' | 'sending';

export function ResendVerification() {
  const t = useTranslations('features.auth');
  const [state, setState] = useState<ResendState>('idle');
  const [result, setResult] = useState<Awaited<ReturnType<typeof resendVerificationAction>> | null>(
    null,
  );
  const { remaining, isCoolingDown, startCooldown } = useCooldown({ duration: 30 });
  const isDisabled = state !== 'idle' || isCoolingDown;

  const handleResend = async () => {
    if (isDisabled) return;

    setState('sending');
    startCooldown();

    const nextResult = await resendVerificationAction();
    setResult(nextResult);
    setState('idle');
  };

  const labelIdle = t('actions.resendEmail');
  const labelSending = state === 'sending' && t('verification.resending');
  const labelCooldown = isCoolingDown && `${t('actions.resendEmail')} (${remaining}s)`;

  return (
    <Stack gap="sm">
      <Button onPress={handleResend} isDisabled={isDisabled} variant="secondary">
        {labelSending || labelCooldown || labelIdle}
      </Button>
      <ApiFeedback result={result} successMessage={t('messages.success')} />
    </Stack>
  );
}
