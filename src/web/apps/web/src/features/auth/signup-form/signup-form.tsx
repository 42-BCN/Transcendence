'use client';

import { Form } from '@components/composites/form';
import { useSignupForm } from './use-signup-form.hook';
import { TextField } from '@components/composites/text-field';
import { Button } from '@components/controls/button';
// import { Form } from '@components/composites/form';

export type SignupFeatureProps = {
  action: (formData: FormData) => void | Promise<void>;
};

export function SignupFeature({ action }: SignupFeatureProps) {
  const form = useSignupForm();

  return (
    <Form
      action={action}
      method="POST"
      onSubmit={(e) => {
        const res = form.validateBeforeSubmit();
        if (!res.ok) e.preventDefault();
      }}
    >
      {form.fieldsBase.map((base) => {
        const name = base.name;

        return <TextField key={String(name)} {...base} {...form.getTextFieldProps(name)} />;
      })}

      <Button type="submit">Sign up</Button>
    </Form>
  );
}
