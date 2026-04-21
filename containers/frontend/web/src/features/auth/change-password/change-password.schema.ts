import { z } from 'zod';

import { passwordSchema } from '@/contracts/api/auth/auth.validation';
import { createEmptyValues } from '@/hooks/use-form/defaults';

export const fieldsBase = {
  currentPassword: {
    name: 'currentPassword',
    labelKey: 'features.auth.fields.currentPassword.label',
    placeholderKey: 'features.auth.fields.currentPassword.placeholder',
    type: 'password',
    isRequired: true,
    autoComplete: 'current-password',
  },
  newPassword: {
    name: 'newPassword',
    labelKey: 'features.auth.fields.newPassword.label',
    placeholderKey: 'features.auth.fields.newPassword.placeholder',
    type: 'password',
    isRequired: true,
    minLength: 8,
    descriptionKey: 'features.auth.fields.newPassword.description',
    autoComplete: 'new-password',
  },
} as const;

const ChangePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, { message: 'REQUIRED' }),
    newPassword: passwordSchema,
  })
  .strict();

export type ChangePasswordReq = z.infer<typeof ChangePasswordFormSchema>;
export type ChangePasswordFormReq = ChangePasswordReq;

const fieldNames = [
  'currentPassword',
  'newPassword',
] as const satisfies readonly (keyof typeof fieldsBase)[];
const defaultValues = createEmptyValues<ChangePasswordFormReq>(fieldNames);

export const formApiReq = {
  schema: ChangePasswordFormSchema,
  fieldNames,
  defaultValues,
} as const;
