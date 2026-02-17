'use client';

import { Form } from '@components/composites/form';
import { useLoginForm } from './use-login-form.hook';
import { TextField } from '@components/composites/text-field';
import { Button } from '@components/controls/button';
// import { Form } from '@components/composites/form';

export function LoginFeature() {
  const form = useLoginForm();
  console.log(form);
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
