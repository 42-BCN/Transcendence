'use client';

import { useState, useCallback, useMemo } from 'react';
import { validate, validateAll } from './validation';
import type { z } from 'zod';

type TouchedOf<T extends Record<string, unknown>> = Partial<Record<keyof T, boolean>>;

type FieldErrorsOf<T extends Record<string, unknown>> = Partial<Record<keyof T, string>>;

type FormApi<T extends Record<string, unknown>> = {
  values: T;
  setValue: <K extends keyof T>(name: K, value: T[K]) => void;

  touched: TouchedOf<T>;
  setTouch: <K extends keyof T>(name: K) => void;

  errors: Partial<Record<keyof T, string>>;

  validateBeforeSubmit: () => { ok: true; data: T } | { ok: false };
};

type useFormProps<T> = {
  schema: z.ZodType<T>;
  fieldNames: readonly (keyof T)[];
  defaultValues: T;
};

export function useForm<T extends Record<string, unknown>>(args: useFormProps<T>): FormApi<T> {
  const { schema, fieldNames, defaultValues } = args;

  const [values, setValues] = useState<T>(() => defaultValues);
  const [touched, setTouched] = useState<TouchedOf<T>>(() => ({}));
  const [errors, setErrors] = useState<FieldErrorsOf<T>>(() => ({}));

  const setValue = <K extends keyof T>(name: K, value: T[K]) =>
    setValues((p) => ({ ...p, [name]: value }));

  const setTouch = useCallback(
    <K extends keyof T>(name: K) =>
      setTouched((p) => {
        const next = { ...p, [name]: true };
        setErrors(validate(schema, values, next, fieldNames).errors);
        return next;
      }),
    [schema, values, fieldNames],
  );

  const validateBeforeSubmit = useCallback(() => {
    const res = validateAll(schema, values, fieldNames);
    setTouched(res.touched);
    setErrors(res.errors);
    return res;
  }, [schema, fieldNames]);

  return useMemo(
    () => ({ values, setValue, touched, setTouch, errors, validateBeforeSubmit }),
    [values, setValue, touched, setTouch, errors, validateBeforeSubmit],
  );
}
