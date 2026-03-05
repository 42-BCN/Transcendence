'use client';

import { Form } from '@components/composites/form';
import { TextField } from '@components/composites/text-field';
import { Button } from '@components/controls/button';
import { useTranslations } from 'next-intl';
import { loginAction } from './login.action';

import { createEmptyValues } from '@/lib/forms/defaults';
import { useForm } from '@/lib/forms/use-form';

import { LoginReqSchema, type LoginReq } from '@/contracts/auth/auth.validation';
import Link from 'next/link';
import { Oauth } from '../oauth';

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
const defaultValues = createEmptyValues<LoginReq>(fieldNames);

const formApiReq = {
  schema: LoginReqSchema,
  fieldNames,
  defaultValues,
} as const;

export function LoginFeature() {
  const form = useForm<LoginReq>(formApiReq);
  const t = useTranslations('auth');
  return (
    <>
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

      <Oauth />
      <div className="flex row gap-2 mt-3 justify-center">
        <p className="text-slate-600 text-sm">Don't have an account?</p>{' '}
        <Link className="text-blue-500 underline text-sm" href={'/signup'}>
          Go to register
        </Link>
      </div>
    </>
  );
}
