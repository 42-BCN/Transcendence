import { SignupReqSchema, type SignupReq } from '@/contracts/auth/auth.validation';
import { createEmptyValues } from '@/lib/forms/defaults';

export const fieldsBase = {
  email: {
    name: 'email',
    labelKey: 'auth.common.email.label',
    placeholderKey: 'auth.common.email.placeholder',
    type: 'email',
    isRequired: true,
    autoComplete: 'email',
  },
  password: {
    name: 'password',
    labelKey: 'auth.common.password.label',
    placeholderKey: 'auth.common.password.placeholder',
    type: 'password',
    isRequired: true,
    minLength: 8,
    descriptionKey: 'auth.common.password.description',
    autoComplete: 'new-password',
  },
} as const;

const fieldNames = ['email', 'password'] as const satisfies readonly (keyof typeof fieldsBase)[];
const defaultValues = createEmptyValues<SignupReq>(fieldNames);

export const formApiReq = {
  schema: SignupReqSchema,
  fieldNames,
  defaultValues,
} as const;
