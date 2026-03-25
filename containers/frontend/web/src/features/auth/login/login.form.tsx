'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';

import { InternalLink } from '@components/controls/link/link';
import { Form } from '@components/composites/form';
import { TextField } from '@components/composites/text-field';
import { Button } from '@components/controls/button';
import { fieldsBase, formApiReq } from './login.schema';
import { useForm } from '@/lib/forms/use-form';
import { type LoginReq } from '@/contracts/api/auth/auth.validation';
import { type LoginRes } from '@/contracts/api/auth/auth.contract';
import { type ApiResponse } from '@/contracts/api/http';

import { loginAction } from './login.action';

type StateActionProps = {
  err: ApiResponse<LoginRes> | null | undefined;
};

// TODO make a component
// TODO Add all error codes form auth to i18n
function APIError({ err }: StateActionProps) {
  const t = useTranslations('api');
  return err?.ok === false ? (
    <div role="alert" className="mb-4">
      {t(err.error.code)}
    </div>
  ) : null;
}

export function LoginForm() {
  const t = useTranslations('auth');
  const form = useForm<LoginReq>(formApiReq);
  const [state, formAction] = useActionState(loginAction, null);

  return (
    <>
      {state?.ok === false ? <APIError err={state} /> : null}
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
          {...fieldsBase.identifier}
        />

        <TextField
          value={form.values.password}
          errorKey={form.errors.password && `validation.${form.errors.password}`}
          onChange={(v) => form.setValue('password', v)}
          onBlur={() => form.setTouch('password')}
          {...fieldsBase.password}
        />
        <div className="flex row gap-2  justify-center">
          <InternalLink href={'/recover'}>{t('login.forgotPassword')}</InternalLink>
        </div>
        <Button type="submit">{t('login.submit')}</Button>
      </Form>
    </>
  );
}
