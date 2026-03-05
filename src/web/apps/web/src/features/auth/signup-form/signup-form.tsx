'use client';

import { Form } from '@components/composites/form';
import { SignupReqSchema, type SignupReq } from '@/contracts/auth/auth.validation';
import { TextField } from '@components/composites/text-field';
import { Button } from '@components/controls/button';
import { useTranslations } from 'next-intl';
import { signupAction } from './signup.action';
import { createEmptyValues } from '@/lib/forms/defaults';
import { useForm } from '@/lib/forms/use-form';
import { useActionState } from 'react';
import type { SignupRes } from '@/contracts/auth/auth.contract';
import Link from 'next/link';
import { Oauth } from '../oauth';

const fieldsBase = {
  email: {
    name: 'email',
    labelKey: 'auth.common.email.label',
    placeholderKey: 'auth.common.email.placeholder',
    type: 'email',
    isRequired: true,
    autoComplete: 'email',
  },
  password: {
    name: 'password',
    labelKey: 'auth.common.password.label',
    placeholderKey: 'auth.common.password.placeholder',
    type: 'password',
    isRequired: true,
    minLength: 8,
    descriptionKey: 'auth.common.password.description',
    autoComplete: 'new-password',
  },
} as const;

const fieldNames = ['email', 'password'] as const satisfies readonly (keyof typeof fieldsBase)[];
const defaultValues = createEmptyValues<SignupReq>(fieldNames);

const formApiReq = {
  schema: SignupReqSchema,
  fieldNames,
  defaultValues,
} as const;

type StateActionProps = {
  state: {
    ok: boolean;
    res: {
      data: SignupRes;
      headers: Headers;
      status: number;
    };
  } | null;
};
function APIError({ state }: StateActionProps) {
  const t2 = useTranslations('api');
  return state?.ok === false ? (
    <div role="alert" className="mb-4">
      {state?.res?.data?.ok === false && t2(state.res.data.error.code)}
    </div>
  ) : null;
}

// eslint-disable-next-line max-lines-per-function
export function SignupFeature() {
  const form = useForm<SignupReq>(formApiReq);
  const t = useTranslations('auth');
  const [state, formAction] = useActionState(signupAction, null);
  return (
    <>
      <APIError state={state} />
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
          {...fieldsBase.email}
        />
        <TextField
          value={form.values.password}
          errorKey={form.errors.password && `validation.${form.errors.password}`}
          onChange={(v) => form.setValue('password', v)}
          onBlur={() => form.setTouch('password')}
          {...fieldsBase.password}
        />
        <Button type="submit">{t('signup.submit')}</Button>
      </Form>
      <Oauth />

      {/* TODO make component */}
      <div className="flex row gap-2 mt-3 justify-center">
        <p className="text-slate-600 text-sm">Have an account?</p>{' '}
        <Link className="text-blue-500 underline text-sm" href={'/login'}>
          Go to login
        </Link>
      </div>
    </>
  );
}
