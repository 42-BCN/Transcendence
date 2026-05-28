import { LoginReqSchema, type LoginReq } from '@/contracts/api/auth/auth.validation';
import { createEmptyValues } from '@/hooks/use-form/defaults';

export const fieldsBase = {
  identifier: {
    name: 'identifier',
    labelKey: 'features.auth.fields.identifier.label',
    placeholderKey: 'features.auth.fields.identifier.placeholder',
    isRequired: true,
  },
  password: {
    name: 'password',
    labelKey: 'features.auth.fields.password.label',
    placeholderKey: 'features.auth.fields.password.placeholder',
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
