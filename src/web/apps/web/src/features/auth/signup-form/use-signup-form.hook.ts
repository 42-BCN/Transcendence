import type { TextFieldProps } from '@components/composites/text-field';
import { createEmptyValues } from '@/lib/forms/defaults';
import { useZodForm } from '@/lib/forms/use-zod-form';
import { type SignupFormValues, SignupFormSchema } from './signup-form.schema';

type FieldName = keyof SignupFormValues;
type I18nKey = string;

type SignupFieldBase = Omit<TextFieldProps, 'errorKey' | 'value' | 'onChange' | 'onBlur'> & {
  name: FieldName;
  labelKey: I18nKey;
  placeholderKey?: I18nKey;
  descriptionKey?: I18nKey;
};

export const fieldsBase: readonly SignupFieldBase[] = [
  {
    name: 'email',
    labelKey: 'auth.common.email.label',
    placeholderKey: 'auth.common.email.placeholder',
    type: 'email',
    isRequired: true,
    autoComplete: 'email',
  },
  {
    name: 'password',
    labelKey: 'auth.common.password.label',
    placeholderKey: 'auth.common.password.placeholder',
    type: 'password',
    isRequired: true,
    minLength: 8,
    descriptionKey: 'auth.common.password.description',
    autoComplete: 'new-password',
  },
  {
    name: 'confirmPassword',
    labelKey: 'auth.common.confirmPassword.label',
    type: 'password',
    isRequired: true,
    minLength: 8,
    autoComplete: 'new-password',
  },
] as const;

const fieldNames = fieldsBase.map((f) => f.name) as readonly (keyof SignupFormValues)[];
const defaultValues = createEmptyValues<SignupFormValues>(fieldNames);

export function useSignupForm() {
  return {
    fieldsBase,
    ...useZodForm<SignupFormValues>({
      schema: SignupFormSchema,
      fieldNames,
      defaultValues,
    }),
  };
}
