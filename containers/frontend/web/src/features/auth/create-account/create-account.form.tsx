'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';

import { Button, Form, ApiFeedback, TextField, Stack } from '@components';
import { useAutoFocus, useForm } from '@/hooks';
import { type SignupReq } from '@/contracts/api/auth/auth.validation';

import { createAccountAction } from './create-account.action';
import { formApiReq, fieldsBase } from './create-account.schema';

export function CreateAccountForm() {
  const form = useForm<SignupReq>(formApiReq);
  const t = useTranslations('features.auth');
  const [state, formAction] = useActionState(createAccountAction, null);
  const emailRef = useAutoFocus<HTMLInputElement>();
  return (
    <>
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
        <TextField
          value={form.values.password}
          errorKey={form.errors.password && `validation.${form.errors.password}`}
          onChange={(v) => form.setValue('password', v)}
          onBlur={() => form.setTouch('password')}
          {...fieldsBase.password}
        />
        <Stack gap="sm">
          <Button type="submit">{t('actions.signup')}</Button>
          <ApiFeedback result={state ?? null} successMessage={t('messages.success')} />
        </Stack>
      </Form>
    </>
  );
}
