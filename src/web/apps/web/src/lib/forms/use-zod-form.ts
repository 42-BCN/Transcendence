'use client';

import { useState } from 'react';
import { validate, validateAll } from './validation';
import type { z } from 'zod';
import type { FieldErrorsOf, TouchedOf } from './types';
import { VALIDATION_I18N_KEY } from '@/contracts/http/validation';

type Args<T extends Record<string, unknown>> = {
  schema: z.ZodType<T>;
  fieldNames: readonly (keyof T)[];
  defaultValues: Readonly<T>;
};

export function useZodForm<T extends Record<string, unknown>>({
  schema,
  fieldNames,
  defaultValues,
}: Args<T>) {
  const [values, setValues] = useState<T>(() => defaultValues);
  const [touched, setTouched] = useState<TouchedOf<T>>(() => ({}));
  const [errors, setErrors] = useState<FieldErrorsOf<T>>(() => ({}));

  const setField = <K extends keyof T>(name: K, value: T[K]) =>
    setValues((p) => ({ ...p, [name]: value }));

  const blurField = <K extends keyof T>(name: K) =>
    setTouched((p) => {
      const next = { ...p, [name]: true };
      setErrors(validate(schema, values, next, fieldNames).errors);
      return next;
    });

  const validateBeforeSubmit = () => {
    const res = validateAll(schema, values, fieldNames);
    setTouched(res.touched);
    setErrors(res.errors);
    return res;
  };

  const getTextFieldProps = <K extends keyof T>(name: K) => ({
    name: String(name),
    value: String(values[name] ?? ''),
    errorKey: errors[name] && `validation.${errors[name]}`,
    onChange: (v: string) => setField(name, v as T[K]),
    onBlur: () => blurField(name),
  });

  return { values, touched, errors, setField, blurField, validateBeforeSubmit, getTextFieldProps };
}
