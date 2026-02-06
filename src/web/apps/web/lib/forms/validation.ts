import type { z } from 'zod';
import type { TouchedOf, FieldErrorsOf } from './types';

export function validate<T extends Record<string, unknown>>(
  schema: z.ZodType<T>,
  values: T,
  touched: TouchedOf<T>,
  fieldNames: readonly (keyof T)[],
): { ok: true; data: T; errors: FieldErrorsOf<T> } | { ok: false; errors: FieldErrorsOf<T> } {
  const result = schema.safeParse(values);

  if (result.success) {
    return { ok: true, data: result.data, errors: {} };
  }

  const flat = result.error.flatten().fieldErrors;
  const errors: FieldErrorsOf<T> = {};

  for (const k of fieldNames) {
    const msg = flat[String(k)]?.[0];
    if (touched[k] && msg) errors[k] = msg;
  }

  return { ok: false, errors };
}

export function validateAll<T extends Record<string, unknown>>(
  schema: z.ZodType<T>,
  values: T,
  fieldNames: readonly (keyof T)[],
) {
  const next: TouchedOf<T> = {};
  for (const k of fieldNames) next[k] = true;
  const res = validate(schema, values, next, fieldNames);
  return { touched: next, ...res };
}
