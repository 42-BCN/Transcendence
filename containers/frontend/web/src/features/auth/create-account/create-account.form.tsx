'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';

import { useForm } from '@/lib/forms/use-form';
import { type SignupReq } from '@/contracts/api/auth/auth.validation';
import { Button, Form, Text, TextField } from '@components';

import { createAccountAction } from './create-account.action';
import { formApiReq, fieldsBase } from './create-account.schema';
import { useAutoFocus } from '@/hooks/useAutoFocus';

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
        <Button type="submit">{t('actions.signup')}</Button>
      </Form>
      {state && !state.ok && <Text variant="caption">{state.error.code}</Text>}
    </>
  );
}
