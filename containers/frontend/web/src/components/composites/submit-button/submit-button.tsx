'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@components/controls/button';
import { useTranslations } from 'next-intl';

type SubmitButtonProps = {
  idleLabel: string;
  id?: string;
};

export function SubmitButton({ idleLabel, id }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const t = useTranslations('components.submitButton');
  const pendingLabel = t('pendingLabel');
  const label = pending ? pendingLabel : idleLabel;

  return (
    <Button id={id} type="submit" isDisabled={pending} variant="cta">
      <span className="fancy-btn__label">{label}</span>
    </Button>
  );
}
