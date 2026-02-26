'use client';

import { Form } from '@components/composites/form';
import { TextField } from '@components/composites/text-field';
import { Button } from '@components/controls/button';
import { useTranslations } from 'next-intl';
import { loginAction } from './login.action';

import { createEmptyValues } from '@/lib/forms/defaults';
import { useForm } from '@/lib/forms/use-form';

import { AuthLoginRequestSchema, type AuthLoginRequest } from '@/contracts/auth/auth.validation';

const fieldsBase = {
  identifier: {
    name: 'identifier',
    labelKey: 'auth.common.identifier.label',
    placeholderKey: 'auth.common.identifier.placeholder',
    isRequired: true,
  },
  password: {
    name: 'password',
    labelKey: 'auth.common.password.label',
    placeholderKey: 'auth.common.password.placeholder',
    type: 'password',
    isRequired: true,
    autoComplete: 'current-password',
  },
} as const;

const fieldNames: (keyof typeof fieldsBase)[] = ['identifier', 'password'];
const defaultValues = createEmptyValues<AuthLoginRequest>(fieldNames);

const formApiReq = {
  schema: AuthLoginRequestSchema,
  fieldNames,
  defaultValues,
} as const;

export function LoginFeature() {
  const form = useForm<AuthLoginRequest>(formApiReq);
  const t = useTranslations('auth');
  return (
    <Form
      action={loginAction}
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
        {...fieldsBase.identifier}
      />

      <TextField
        value={form.values.password}
        errorKey={form.errors.password && `validation.${form.errors.password}`}
        onChange={(v) => form.setValue('password', v)}
        onBlur={() => form.setTouch('password')}
        {...fieldsBase.password}
      />

      <Button type="submit">{t('login.submit')}</Button>
    </Form>
  );
}
