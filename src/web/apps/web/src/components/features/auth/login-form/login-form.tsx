'use client';

import { Form } from '@ui/composites/form';
import { useLoginForm } from './use-login-form.hook';
import { TextField } from '@ui/composites/text-field';
import { Button } from '@ui/controls/button';
// import { Form } from '@ui/composites/form';

export function LoginFeature() {
  const form = useLoginForm();

  return (
    <Form
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

      <Button type="submit">Log in</Button>
    </Form>
  );
}
