'use client';

import { Form } from '@components/composites/form';
import { type SignupFormValues, SignupFormSchema } from './signup-form.schema';
import { TextField } from '@components/composites/text-field';
import { Button } from '@components/controls/button';
import { useTranslations } from 'next-intl';
import { signupAction } from './signup.action';
import { createEmptyValues } from '@/lib/forms/defaults';
import { useForm } from '@/lib/forms/use-form';

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
  confirmPassword: {
    name: 'confirmPassword',
    labelKey: 'auth.common.confirmPassword.label',
    type: 'password',
    isRequired: true,
    minLength: 8,
    autoComplete: 'new-password',
  },
} as const;

const fieldNames = [
  'email',
  'password',
  'confirmPassword',
] as const satisfies readonly (keyof typeof fieldsBase)[];
const defaultValues = createEmptyValues<SignupFormValues>(fieldNames);

const formApiReq = {
  schema: SignupFormSchema,
  fieldNames,
  defaultValues,
} as const;

export function SignupFeature() {
  const form = useForm<SignupFormValues>(formApiReq);
  const t = useTranslations('auth');

  return (
    <Form
      action={signupAction}
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

      <TextField
        value={form.values.confirmPassword}
        errorKey={form.errors.confirmPassword && `validation.${form.errors.confirmPassword}`}
        onChange={(v) => form.setValue('confirmPassword', v)}
        onBlur={() => form.setTouch('confirmPassword')}
        {...fieldsBase.confirmPassword}
      />

      <Button type="submit">{t('signup.submit')}</Button>
    </Form>
  );
}
