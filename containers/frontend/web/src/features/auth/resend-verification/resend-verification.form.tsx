'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';

import { ApiFeedback, Form, Stack, SubmitButton, TextField } from '@components';
import { useAutoFocus, useForm } from '@/hooks';

import { resendVerificationAction } from './resend-verification.action';
import { fieldsBase, formApiReq, type ResendVerificationReq } from './resend-verification.schema';

export function ResendVerificationForm() {
  const form = useForm<ResendVerificationReq>(formApiReq);
  const t = useTranslations('features.auth');
  const [state, formAction] = useActionState(resendVerificationAction, null);
  const emailRef = useAutoFocus<HTMLInputElement>();

  return (
    <Form
      action={formAction}
      onSubmit={(e) => {
        const res = form.validateBeforeSubmit();
        if (!res.ok) e.preventDefault();
      }}
    >
      <TextField
        value={form.values.email}
        errorKey={form.errors.email && `validation.${form.errors.email}`}
        onChange={(v) => form.setValue('email', v)}
        onBlur={() => form.setTouch('email')}
        inputRef={emailRef}
        {...fieldsBase.email}
      />

      <Stack gap="sm">
        <SubmitButton idleLabel={t('actions.resendEmail')} />
        <ApiFeedback result={state ?? null} successMessage={t('messages.success')} />
      </Stack>
    </Form>
  );
}
