'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';

import { Form, ApiFeedback, TextField, Stack, SubmitButton } from '@components';
import { useAutoFocus, useForm } from '@/hooks';
import { type SignupReq } from '@/contracts/api/auth/auth.validation';

import { createAccountAction } from './create-account.action';
import { formApiReq, fieldsBase } from './create-account.schema';
import { createSubmitHandler } from '@/lib/http/submitHandler';

export function CreateAccountForm() {
  const form = useForm<SignupReq>(formApiReq);
  const t = useTranslations('features.auth');
  const [state, formAction] = useActionState(createAccountAction, null);
  const emailRef = useAutoFocus<HTMLInputElement>();
  return (
    <>
      <Form onSubmit={createSubmitHandler(form, formAction)}>
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
          <SubmitButton idleLabel={t('actions.signup')} />
          <ApiFeedback result={state ?? null} successMessage={t('messages.success')} />
        </Stack>
      </Form>
    </>
  );
}
