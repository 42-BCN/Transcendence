'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Button, Stack, ApiFeedback } from '@components';
import { useCooldown } from '@/hooks';

import { resendRecoverAction } from './recover.resend.action';

type ResendState = 'idle' | 'sending';

export function RecoverResend() {
  const t = useTranslations('features.auth');
  const [state, setState] = useState<ResendState>('idle');
  const [result, setResult] = useState<Awaited<ReturnType<typeof resendRecoverAction>> | null>(
    null,
  );
  const { remaining, isCoolingDown, startCooldown } = useCooldown({ duration: 30 });
  const isDisabled = state !== 'idle' || isCoolingDown;

  const handleResend = async () => {
    if (isDisabled) return;

    setState('sending');
    startCooldown();

    const nextResult = await resendRecoverAction();
    setResult(nextResult);
    setState('idle');
  };

  const labelIdle = t('actions.sendEmail');
  const labelSending = state === 'sending' && t('verification.resending');
  const labelCooldown = isCoolingDown && `${t('actions.sendEmail')} (${remaining}s)`;

  return (
    <Stack gap="sm">
      <Button onPress={handleResend} isDisabled={isDisabled} variant="secondary">
        {labelSending || labelCooldown || labelIdle}
      </Button>
      <ApiFeedback result={result} successMessage={t('messages.success')} />
    </Stack>
  );
}
