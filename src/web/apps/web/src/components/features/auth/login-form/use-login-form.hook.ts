import { loginSchema } from './login-form.schema';
import type { LoginValues } from './login-form.schema';
import type { TextFieldProps } from '@ui/composites/text-field';
import { createEmptyValues } from '@/lib/forms/defaults';
import { useZodForm } from '@/lib/forms/use-zod-form';

type FieldName = keyof LoginValues;

type LoginFieldBase = Omit<TextFieldProps, 'fieldError' | 'value' | 'onChange' | 'onBlur'> & {
  name: FieldName;
};

export const SIGNUP_FIELDS_BASE: readonly LoginFieldBase[] = [
  { name: 'email', label: 'Email', type: 'email', isRequired: true },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    isRequired: true,
  },
] as const;

const SIGNUP_FIELD_NAMES = SIGNUP_FIELDS_BASE.map((f) => f.name) as readonly (keyof LoginValues)[];
const DEFAULT_VALUES = createEmptyValues<LoginValues>(SIGNUP_FIELD_NAMES);

export function useLoginForm() {
  return {
    fieldsBase: SIGNUP_FIELDS_BASE,
    ...useZodForm<LoginValues>({
      schema: loginSchema,
      fieldNames: SIGNUP_FIELD_NAMES,
      defaultValues: DEFAULT_VALUES,
    }),
  };
}
