'use client';

import { useActionState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { ApiFeedback, Form, InternalLink, Stack, SubmitButton, TextField } from '@components';
import { useForm } from '@/hooks/use-form/use-form';

import { resetPasswordAction } from './reset-password.action';
import { fieldsBase, formApiReq, type ResetPasswordFormReq } from './reset-password.schema';

export function ResetPasswordForm() {
  const t = useTranslations('features.auth');
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get('token')?.trim() ?? '', [searchParams]);
  const form = useForm<ResetPasswordFormReq>(formApiReq);
  const [state, formAction] = useActionState(resetPasswordAction, null);

  return (
    <Form
      action={formAction}
      onSubmit={(e) => {
        const res = form.validateBeforeSubmit();
        if (!res.ok) e.preventDefault();
      }}
    >
      <input type="hidden" name="token" value={token} readOnly />

      <TextField
        value={form.values.password}
        errorKey={form.errors.password && `validation.${form.errors.password}`}
        onChange={(v) => form.setValue('password', v)}
        onBlur={() => form.setTouch('password')}
        {...fieldsBase.password}
      />

      <TextField
        value={form.values.confirmPassword}
        errorKey={form.errors.confirmPassword && `validation.${form.errors.confirmPassword}`}
        onChange={(v) => form.setValue('confirmPassword', v)}
        onBlur={() => form.setTouch('confirmPassword')}
        {...fieldsBase.confirmPassword}
      />

      <Stack gap="sm">
        <SubmitButton idleLabel={t('reset.submit')} />
        <ApiFeedback result={state ?? null} successMessage={t('reset.success')} />
      </Stack>

      <InternalLink href="/login" className="block text-center">
        {t('reset.backToLogin')}
      </InternalLink>
    </Form>
  );
}
