'use client';

import { Form } from '@components/composites/form';
import { useSignupForm } from './use-signup-form.hook';
import { TextField } from '@components/composites/text-field';
import { Button } from '@components/controls/button';
import { useTranslations } from 'next-intl';
import { signupAction } from './signup.action';

export function SignupFeature() {
  const form = useSignupForm();
  const t = useTranslations('auth');

  return (
    <Form
      action={signupAction}
      onSubmit={(e) => {
        const res = form.validateBeforeSubmit();
        if (!res.ok) e.preventDefault();
      }}
    >
      {form.fieldsBase.map((base) => (
        <TextField key={String(base.name)} {...base} {...form.getTextFieldProps(base.name)} />
      ))}

      <Button type="submit">{t('signup.submit')}</Button>
    </Form>
  );
}
