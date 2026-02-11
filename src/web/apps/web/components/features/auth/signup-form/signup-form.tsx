'use client';

import { Form } from '@ui/composites/form';
import { useSignupForm } from './use-signup-form.hook';
import { TextField } from '@ui/composites/text-field';
import { Button } from '@ui/controls/button';
// import { Form } from '@ui/composites/form';

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
