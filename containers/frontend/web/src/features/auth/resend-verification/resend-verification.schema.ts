import { z } from 'zod';

import { emailSchema } from '@/contracts/api/auth/auth.validation';
import { createEmptyValues } from '@/hooks/use-form/defaults';

export type ResendVerificationReq = {
  email: string;
};

export const fieldsBase = {
  email: {
    name: 'email',
    labelKey: 'features.auth.fields.email.label',
    placeholderKey: 'features.auth.fields.email.placeholder',
    isRequired: true,
    autoComplete: 'email',
  },
} as const;

const fieldNames: (keyof typeof fieldsBase)[] = ['email'];
const defaultValues = createEmptyValues<ResendVerificationReq>(fieldNames);

const ResendVerificationReqSchema = z
  .object({
    email: emailSchema,
  })
  .strict();

export const formApiReq = {
  schema: ResendVerificationReqSchema,
  fieldNames,
  defaultValues,
} as const;
