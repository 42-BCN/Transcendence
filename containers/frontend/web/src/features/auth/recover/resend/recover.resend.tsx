'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Stack, ApiFeedback, AsyncCooldownButton } from '@components';

import { resendRecoverAction } from './recover.resend.action';

export function RecoverResend() {
  const t = useTranslations('features.auth');
  const [result, setResult] = useState<Awaited<ReturnType<typeof resendRecoverAction>> | null>(
    null,
  );

  const handleResend = async () => {
    const nextResult = await resendRecoverAction();
    setResult(nextResult);
  };

  return (
    <Stack gap="sm">
      <AsyncCooldownButton
        onPress={handleResend}
        cooldownSeconds={30}
        startOnMount
        idleLabel={t('actions.sendEmail')}
        pendingLabel={t('verification.resending')}
        formatCooldownLabel={(remaining) => `${t('actions.sendEmail')} (${remaining}s)`}
      />

      <ApiFeedback result={result} successMessage={t('messages.success')} />
    </Stack>
  );
}
