import { LoginReqSchema, type LoginReq } from '@/contracts/auth/auth.validation';
import { createEmptyValues } from '@/lib/forms/defaults';

export const fieldsBase = {
  identifier: {
    name: 'identifier',
    labelKey: 'auth.common.identifier.label',
    placeholderKey: 'auth.common.identifier.placeholder',
    isRequired: true,
  },
  password: {
    name: 'password',
    labelKey: 'auth.common.password.label',
    placeholderKey: 'auth.common.password.placeholder',
    type: 'password',
    isRequired: true,
    autoComplete: 'current-password',
  },
} as const;

const fieldNames: (keyof typeof fieldsBase)[] = ['identifier', 'password'];
const defaultValues = createEmptyValues<LoginReq>(fieldNames);

export const formApiReq = {
  schema: LoginReqSchema,
  fieldNames,
  defaultValues,
} as const;
