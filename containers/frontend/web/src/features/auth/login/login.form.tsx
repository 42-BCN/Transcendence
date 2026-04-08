'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';

import { Form, InternalLink, SubmitButton, TextField, ApiFeedback, Stack } from '@components';
import { fieldsBase, formApiReq } from './login.schema';
import { useForm } from '@/hooks/use-form/use-form';
import { type LoginReq } from '@/contracts/api/auth/auth.validation';

import { loginAction } from './login.action';
import { useAutoFocus } from '@/hooks/useAutoFocus';

export function LoginForm() {
  const t = useTranslations('features.auth');
  const form = useForm<LoginReq>(formApiReq);
  const [state, formAction] = useActionState(loginAction, null);
  const identifierRef = useAutoFocus<HTMLInputElement>();

  return (
    <Form
      action={formAction}
      onSubmit={(e) => {
        const res = form.validateBeforeSubmit();
        if (!res.ok) e.preventDefault();
      }}
    >
      <TextField
        value={form.values.identifier}
        errorKey={form.errors.identifier && `validation.${form.errors.identifier}`}
        onChange={(v) => form.setValue('identifier', v)}
        onBlur={() => form.setTouch('identifier')}
        inputRef={identifierRef}
        {...fieldsBase.identifier}
      />

      <TextField
        value={form.values.password}
        errorKey={form.errors.password && `validation.${form.errors.password}`}
        onChange={(v) => form.setValue('password', v)}
        onBlur={() => form.setTouch('password')}
        {...fieldsBase.password}
      />

      <InternalLink href="/recover" className="block text-center">
        {t('login.forgotPassword')}
      </InternalLink>
      <Stack gap="sm">
        <SubmitButton idleLabel={t('login.submit')} />
        <ApiFeedback result={state ?? null} successMessage={t('messages.success')} />
      </Stack>
    </Form>
  );
}
