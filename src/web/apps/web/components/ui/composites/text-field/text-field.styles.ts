// components/forms/field/text-field.styles.ts
import { cn } from '@/lib/styles/cn';

const rootBase = 'grid gap-1.5';
const labelBase = 'text-sm font-medium';
const descriptionBase = 'text-xs text-gray-600';
const errorBase = 'text-xs text-red-600';

export const textFieldBase = {
  root: rootBase,
  label: labelBase,
  description: descriptionBase,
  error: errorBase,
};

export function textFieldRootClass() {
  return cn(textFieldBase.root);
}

export function textFieldLabelClass({ state }: { state: { isDisabled: boolean } }) {
  return cn(textFieldBase.label, state.isDisabled && 'opacity-50', 'first-letter:uppercase');
}

export function textFieldDescriptionClass() {
  return cn(textFieldBase.description);
}

export function textFieldErrorClass() {
  return cn(textFieldBase.error);
}
