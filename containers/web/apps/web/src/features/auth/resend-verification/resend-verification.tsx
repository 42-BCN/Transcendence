'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@components/controls/button';
import { resendVerificationAction } from './resend-verification.action';

import { feedbackStyles } from './resend-verification.styles';
import { Stack } from '@components/primitives/stack';

type ResendState = 'idle' | 'sending' | 'cooldown';
type Feedback = 'success' | 'error' | null;

export function ResendVerification() {
  const t = useTranslations('auth.createAccount.success');
  const [state, setState] = useState<ResendState>('idle');
  const [countdown, setCountdown] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(null);

  useEffect(() => {
    if (state === 'cooldown' && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (countdown === 0 && state === 'cooldown') {
      setState('idle');
    }
  }, [state, countdown]);

  const handleResend = async () => {
    if (state !== 'idle') return;
    setFeedback(null);
    setState('sending');
    await new Promise((r) => setTimeout(r, 800));
    const result = await resendVerificationAction();
    if (result.ok) {
      setFeedback('success');
      setState('cooldown');
      setCountdown(30);
    } else {
      setFeedback('error');
      setState('idle');
    }
  };

  const buttonTexts: Record<ResendState, string> = {
    sending: t('resending'),
    cooldown: `${t('resend')} (${countdown}s)`,
    idle: t('resend'),
  };

  return (
    <Stack gap="xs">
      <Button onPress={handleResend} isDisabled={state !== 'idle'} variant="secondary">
        {buttonTexts[state]}
      </Button>
      {feedback === 'success' && <p className={feedbackStyles('success')}>{t('resendSuccess')}</p>}
      {feedback === 'error' && <p className={feedbackStyles('error')}>{t('resendError')}</p>}
    </Stack>
  );
}
