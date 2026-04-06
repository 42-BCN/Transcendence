'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

import { useForm } from '@/lib/forms/use-form';
import { type SignupReq } from '@/contracts/api/auth/auth.validation';
import { type SignupRes } from '@/contracts/api/auth/auth.contract';
import { Form } from '@components/composites/form';
import { TextField } from '@components/composites/text-field';
import { Button } from '@components/controls/button';

import { createAccountAction } from './create-account.action';
import { formApiReq, fieldsBase } from './create-account.schema';

type StateActionProps = {
  state:
    | {
        ok: boolean;
        res: {
          data: SignupRes;
          headers: Headers;
          status: number;
        };
      }
    | null
    | undefined;
};

function useCreateAccountFieldNavigation() {
  const emailRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  return { emailRef };
}

// TODO make a component
function APIError({ state }: StateActionProps) {
  const t2 = useTranslations('errors');
  return state?.ok === false ? (
    <div role="alert" className="mb-4">
      {state?.res?.data?.ok === false && t2(state.res.data.error.code)}
    </div>
  ) : null;
}

export function CreateAccountForm() {
  const form = useForm<SignupReq>(formApiReq);
  const t = useTranslations('features.auth');
  const [state, formAction] = useActionState(createAccountAction, null);
  const { emailRef } = useCreateAccountFieldNavigation();

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
    </>
  );
}
