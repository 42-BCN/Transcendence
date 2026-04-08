'use client';

import { Text } from '@components';
import { useTranslations } from 'next-intl';
import { apiFeedbackStyles } from './api-feedback.styles';

type ApiErrorResult<TCode extends string> = {
  ok: false;
  error: {
    code: TCode;
  };
};

type ApiSuccessResult = {
  ok: true;
};

type ApiFeedbackResult<TCode extends string> = ApiSuccessResult | ApiErrorResult<TCode>;

type ApiFeedbackProps<TCode extends string> = {
  result: ApiFeedbackResult<TCode> | null;
  successMessage: string;
};

export function ApiFeedback<TCode extends string>({
  result,
  successMessage,
}: ApiFeedbackProps<TCode>) {
  if (!result) return null;

  const tError = useTranslations('errors');

  if (result.ok || result?.api?.ok)
    return (
      <Text variant="body-xs" className={apiFeedbackStyles.success}>
        {successMessage}
      </Text>
    );

  const errorKey = result?.api?.error?.code || (result?.error.code as Parameters<typeof tError>[0]);

  return (
    <Text variant="body-xs" className={apiFeedbackStyles.error}>
      {tError(errorKey)}
    </Text>
  );
}
