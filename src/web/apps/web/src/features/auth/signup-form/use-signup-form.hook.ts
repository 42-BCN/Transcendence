import { signupSchema } from './signup-form.schema';
import type { SignupValues } from './signup-form.schema';
import type { TextFieldProps } from '@components/composites/text-field';
import { createEmptyValues } from '@/lib/forms/defaults';
import { useZodForm } from '@/lib/forms/use-zod-form';

type FieldName = keyof SignupValues;

type SignupFieldBase = Omit<TextFieldProps, 'fieldError' | 'value' | 'onChange' | 'onBlur'> & {
  name: FieldName;
};

export const fieldsBase: readonly SignupFieldBase[] = [
  { name: 'email', label: 'Email', type: 'email', isRequired: true, autoComplete: 'email' },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    isRequired: true,
    minLength: 8,
    description: 'Minimum 8 characters',
    autoComplete: 'new-password',
  },
  {
    name: 'confirmPassword',
    label: 'Confirm password',
    type: 'password',
    isRequired: true,
    minLength: 8,
    autoComplete: 'new-password',
  },
] as const;

const fieldNames = fieldsBase.map((f) => f.name) as readonly (keyof SignupValues)[];
const defaultValues = createEmptyValues<SignupValues>(fieldNames);

export function useSignupForm() {
  return {
    fieldsBase,
    ...useZodForm<SignupValues>({
      schema: signupSchema,
      fieldNames,
      defaultValues,
    }),
  };
}
