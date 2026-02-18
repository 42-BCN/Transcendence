import { loginSchema } from './login-form.schema';
import type { LoginValues } from './login-form.schema';
import type { TextFieldProps } from '@components/composites/text-field';
import { createEmptyValues } from '@/lib/forms/defaults';
import { useZodForm } from '@/lib/forms/use-zod-form';

type FieldName = keyof LoginValues;

type LoginFieldBase = Omit<TextFieldProps, 'fieldError' | 'value' | 'onChange' | 'onBlur'> & {
  name: FieldName;
};

export const LOGIN_FIELDS_BASE: readonly LoginFieldBase[] = [
  { name: 'email', label: 'Email', type: 'email', isRequired: true, autoComplete: 'email' },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    isRequired: true,
    autoComplete: 'password',
  },
] as const;

const LOGIN_FIELD_NAMES = LOGIN_FIELDS_BASE.map((f) => f.name) as readonly (keyof LoginValues)[];
const DEFAULT_VALUES = createEmptyValues<LoginValues>(LOGIN_FIELD_NAMES);

export function useLoginForm() {
  return {
    fieldsBase: LOGIN_FIELDS_BASE,
    ...useZodForm<LoginValues>({
      schema: loginSchema,
      fieldNames: LOGIN_FIELD_NAMES,
      defaultValues: DEFAULT_VALUES,
    }),
  };
}
