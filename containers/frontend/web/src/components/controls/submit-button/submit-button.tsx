'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@components';
import { useTranslations } from 'next-intl';

type SubmitButtonProps = {
  idleLabel: string;
  variant?: 'primary' | 'secondary';
};

export function SubmitButton({ idleLabel, variant = 'primary' }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const t = useTranslations('components.submitButton');
  const pendingLabel = t('pendingLabel');
  const label = pending ? pendingLabel : idleLabel;

  return (
    <Button type="submit" isDisabled={pending} variant={variant}>
      {label}
    </Button>
  );
}
