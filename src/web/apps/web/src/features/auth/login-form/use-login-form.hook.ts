// import { loginSchema } from './login-form.schema';
// import type { LoginValues } from './login-form.schema';
import type { TextFieldProps } from '@components/composites/text-field';
import { createEmptyValues } from '@/lib/forms/defaults';
import { useZodForm } from '@/lib/forms/use-zod-form';

import { AuthLoginRequestSchema } from '@/contracts/auth/auth.validation';
import type { AuthLoginRequest } from '@/contracts/auth/auth.validation';

type FieldName = keyof AuthLoginRequest;

type I18nKey = string;

type LoginFieldBase = Omit<
  TextFieldProps,
  'fieldError' | 'value' | 'onChange' | 'onBlur' | 'label'
> & {
  name: FieldName;
  labelKey: I18nKey;
  placeholderKey?: I18nKey;
  descriptionKey?: I18nKey;
};

const fieldsBase: readonly LoginFieldBase[] = [
  {
    name: 'identifier',
    labelKey: 'auth.common.identifier.label',
    placeholderKey: 'auth.common.identifier.placeholder',
    isRequired: true,
  },
  {
    name: 'password',
    labelKey: 'auth.common.password.label',
    placeholderKey: 'auth.common.password.placeholder',
    type: 'password',
    isRequired: true,
    autoComplete: 'current-password',
  },
] as const;

const fieldNames = fieldsBase.map((f) => f.name) as readonly (keyof AuthLoginRequest)[];
const defaultValues = createEmptyValues<AuthLoginRequest>(fieldNames);

export function useLoginForm() {
  return {
    fieldsBase,
    ...useZodForm<AuthLoginRequest>({
      schema: AuthLoginRequestSchema,
      fieldNames,
      defaultValues,
    }),
  };
}
