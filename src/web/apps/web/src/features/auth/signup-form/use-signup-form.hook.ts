import { signupSchema } from './signup-form.schema';
import type { SignupValues } from './signup-form.schema';
import type { TextFieldProps } from '@components/composites/text-field';
import { createEmptyValues } from '@/lib/forms/defaults';
import { useZodForm } from '@/lib/forms/use-zod-form';

type FieldName = keyof SignupValues;

type SignupFieldBase = Omit<TextFieldProps, 'fieldError' | 'value' | 'onChange' | 'onBlur'> & {
  name: FieldName;
};

export const SIGNUP_FIELDS_BASE: readonly SignupFieldBase[] = [
  { name: 'email', label: 'Email', type: 'email', isRequired: true },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    isRequired: true,
    minLength: 8,
    description: 'Minimum 8 characters',
  },
  {
    name: 'confirmPassword',
    label: 'Confirm password',
    type: 'password',
    isRequired: true,
    minLength: 8,
  },
] as const;

const SIGNUP_FIELD_NAMES = SIGNUP_FIELDS_BASE.map((f) => f.name) as readonly (keyof SignupValues)[];
const DEFAULT_VALUES = createEmptyValues<SignupValues>(SIGNUP_FIELD_NAMES);

export function useSignupForm() {
  return {
    fieldsBase: SIGNUP_FIELDS_BASE,
    ...useZodForm<SignupValues>({
      schema: signupSchema,
      fieldNames: SIGNUP_FIELD_NAMES,
      defaultValues: DEFAULT_VALUES,
    }),
  };
}
