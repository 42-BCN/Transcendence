'use client';

import { useTranslations } from 'next-intl';

import { InternalLink } from '@components/controls/link/link';
import { Form } from '@components/composites/form';
import { TextField } from '@components/composites/text-field';
import { Button } from '@components/controls/button';
import { fieldsBase, formApiReq } from './login.schema';
import { useForm } from '@/lib/forms/use-form';
import { type LoginReq } from '@/contracts/auth/auth.validation';

import { loginAction } from './login.action';

export function LoginForm() {
  const t = useTranslations('auth');
  const form = useForm<LoginReq>(formApiReq);
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
      <div className="flex row gap-2 mt-3 justify-center">
        <InternalLink href={'/recover'}>{t('login.forgotPassword')}</InternalLink>
      </div>
      <Button type="submit">{t('login.submit')}</Button>
    </Form>
  );
}
