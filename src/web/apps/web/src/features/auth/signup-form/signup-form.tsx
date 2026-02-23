'use client';

import { Form } from '@components/composites/form';
import { useSignupForm } from './use-signup-form.hook';
import { TextField } from '@components/composites/text-field';
import { Button } from '@components/controls/button';
import { useTranslations } from 'next-intl';

export type SignupFeatureProps = {
  action: (formData: FormData) => void | Promise<void>;
};

export function SignupFeature({ action }: SignupFeatureProps) {
  const form = useSignupForm();
  const t = useTranslations('auth');
  console.log(form);
  return (
    <Form
      action={action}
      method="POST"
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
