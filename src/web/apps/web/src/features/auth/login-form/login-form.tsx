'use client';

import { Form } from '@components/composites/form';
import { useLoginForm } from './use-login-form.hook';
import { TextField } from '@components/composites/text-field';
import { Button } from '@components/controls/button';
import { useTranslations } from 'next-intl';
import { loginAction } from './login.action';

export function LoginFeature() {
  const form = useLoginForm();
  const t = useTranslations('auth');
  return (
    <Form
      action={loginAction}
      onSubmit={(e) => {
        const res = form.validateBeforeSubmit();
        if (!res.ok) e.preventDefault();
      }}
    >
      {form.fieldsBase.map((base) => {
        const name = base.name;

        return <TextField key={String(name)} {...base} {...form.getTextFieldProps(name)} />;
      })}

      <Button type="submit">{t('login.submit')}</Button>
    </Form>
  );
}
