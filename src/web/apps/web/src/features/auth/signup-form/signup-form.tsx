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

export function googleLogo() {
  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="block">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
      <path fill="none" d="M0 0h48v48H0z" />
    </svg>
  );
}

export function SignupFeature() {
  const form = useForm<SignupFormValues>(formApiReq);
  const t = useTranslations('auth');

  return (
    <>
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
      <div className="w-100 mt-6">
        <hr />
        <Button icon={googleLogo()}>Sign up with google</Button>
      </div>
    </>
  );
}
