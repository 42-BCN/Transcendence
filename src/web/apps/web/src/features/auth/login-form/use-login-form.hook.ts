import { loginSchema } from './login-form.schema';
import type { LoginValues } from './login-form.schema';
import type { TextFieldProps } from '@components/composites/text-field';
import { createEmptyValues } from '@/lib/forms/defaults';
import { useZodForm } from '@/lib/forms/use-zod-form';

type FieldName = keyof LoginValues;

type LoginFieldBase = Omit<TextFieldProps, 'fieldError' | 'value' | 'onChange' | 'onBlur'> & {
  name: FieldName;
};

const fieldsBase: readonly LoginFieldBase[] = [
  { name: 'email', label: 'Email', type: 'email', isRequired: true, autoComplete: 'email' },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    isRequired: true,
    autoComplete: 'password',
  },
] as const;

const fieldNames = fieldsBase.map((f) => f.name) as readonly (keyof LoginValues)[];
const defaultValues = createEmptyValues<LoginValues>(fieldNames);

export function useLoginForm() {
  return {
    fieldsBase,
    ...useZodForm<LoginValues>({
      schema: loginSchema,
      fieldNames,
      defaultValues,
    }),
  };
}
