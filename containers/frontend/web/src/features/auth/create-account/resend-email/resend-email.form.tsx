'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Stack, ApiFeedback } from '@components';

import { resendVerificationAction } from './resend-email.action';
import { AsyncCooldownButton } from '@components/composites/async-cooldown-button/async-cooldown-button';

export function ResendVerification() {
  const t = useTranslations('features.auth');
  const [result, setResult] = useState<Awaited<ReturnType<typeof resendVerificationAction>> | null>(
    null,
  );

  const handleResend = async () => {
    const nextResult = await resendVerificationAction();
    setResult(nextResult);
  };

  return (
    <Stack gap="sm">
      <AsyncCooldownButton
        onPress={handleResend}
        cooldownSeconds={30}
        startOnMount
        idleLabel={t('actions.resendEmail')}
        pendingLabel={t('verification.resending')}
        formatCooldownLabel={(remaining) => `${t('actions.resendEmail')} (${remaining}s)`}
      />
      <ApiFeedback result={result} successMessage={t('messages.success')} />
    </Stack>
  );
}
