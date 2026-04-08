import { SignupReqSchema, type SignupReq } from '@/contracts/api/auth/auth.validation';
import { createEmptyValues } from '@/lib/forms/defaults';

export const fieldsBase = {
  email: {
    name: 'email',
    labelKey: 'features.auth.fields.email.label',
    placeholderKey: 'features.auth.fields.email.placeholder',
    type: 'email',
    isRequired: true,
    autoComplete: 'email',
  },
  password: {
    name: 'password',
    labelKey: 'features.auth.fields.password.label',
    placeholderKey: 'features.auth.fields.password.placeholder',
    type: 'password',
    isRequired: true,
    minLength: 8,
    descriptionKey: 'features.auth.fields.password.description',
    autoComplete: 'new-password',
  },
  // privacy: {
  //   name: 'privacy',
  //   labelKey: 'features.auth.signup.privacy.label',
  //   type: 'checkbox',
  //   isRequired: true,
  // },
} as const;

const fieldNames = [
  'email',
  'password',
  // 'privacy',
] as const satisfies readonly (keyof typeof fieldsBase)[];
const defaultValues = createEmptyValues<SignupReq>(fieldNames);

export const formApiReq = {
  schema: SignupReqSchema,
  fieldNames,
  defaultValues,
} as const;
