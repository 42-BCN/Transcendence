import { z } from 'zod';

import { passwordSchema } from '@/contracts/api/auth/auth.validation';
import { createEmptyValues } from '@/hooks/use-form/defaults';

const ResetPasswordFormSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, { message: 'REQUIRED' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'PASSWORDS_DO_NOT_MATCH',
  });

export type ResetPasswordFormReq = z.infer<typeof ResetPasswordFormSchema>;

export const fieldsBase = {
  password: {
    name: 'password',
    type: 'password',
    labelKey: 'features.auth.fields.password.label',
    placeholderKey: 'features.auth.fields.password.placeholder',
    isRequired: true,
    autoComplete: 'new-password',
  },
  confirmPassword: {
    name: 'confirmPassword',
    type: 'password',
    labelKey: 'features.auth.fields.confirmPassword.label',
    placeholderKey: 'features.auth.fields.confirmPassword.placeholder',
    isRequired: true,
    autoComplete: 'new-password',
  },
} as const;

const fieldNames: (keyof typeof fieldsBase)[] = ['password', 'confirmPassword'];
const defaultValues = createEmptyValues<ResetPasswordFormReq>(fieldNames);

export const formApiReq = {
  schema: ResetPasswordFormSchema,
  fieldNames,
  defaultValues,
} as const;
