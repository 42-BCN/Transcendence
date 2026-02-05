'use client';

import { useState } from 'react';
import { Form } from '@ui/composites/form';
import { TextField } from '@ui/composites/text-field';
import { Button } from '@ui/controls/button';
import { signupSchema } from './signup-form.schema';

type FieldErrors = Partial<Record<'email' | 'password' | 'confirmPassword', string>>;

export function SignupForm() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  const mismatch = confirm.length > 0 && password !== confirm;

  function handleSubmit(e) {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);
    const raw = {
      email: String(fd.get('email') ?? ''),
      password: String(fd.get('password') ?? ''),
      confirmPassword: String(fd.get('confirmPassword') ?? ''),
    };

    const result = signupSchema.safeParse(raw);

    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;

      setErrors({
        email: flat.email?.[0],
        password: flat.password?.[0],
        confirmPassword: flat.confirmPassword?.[0],
      });

      return;
    }

    // If schema passes, clear server/schema errors
    setErrors({});
    console.log('validData', result.data);

    // Send to API / server action here
  }

  return (
    <Form onSubmit={handleSubmit}>
      <TextField label="email" name="email" type="email" isRequired fieldError={errors.email} />

      <TextField
        name="password"
        label="Password"
        type="password"
        onChange={(v: string) => setPassword(v)}
        isRequired
        minLength={8}
        description="Minimum 8 characters"
        fieldError={errors.password}
      />

      <TextField
        label="Confirm password"
        type="password"
        name="confirmPassword"
        isRequired
        onChange={(v: string) => setConfirm(v)}
        fieldError={mismatch ? 'Passwords do not match' : errors.confirmPassword}
      />

      <Button type="submit">Create account</Button>
    </Form>
  );
}
