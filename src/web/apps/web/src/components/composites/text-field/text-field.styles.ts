// components/forms/field/text-field.styles.ts
import { cn } from '@/lib/styles/cn';

const rootBase = 'grid gap-1.5';
const labelBase = 'text-sm font-medium';
const descriptionBase = 'text-xs text-gray-600';
const errorBase = 'text-xs text-red-600';

const textFieldBase = {
  root: rootBase,
  label: labelBase,
  description: descriptionBase,
  error: errorBase,
};

const textFieldRACStates = ['data-[pressed]:opacity-50 first-letter:uppercase'];

export function textFieldRootClass() {
  return cn(textFieldBase.root);
}

export function textFieldLabelClass() {
  return cn(textFieldBase.label, textFieldRACStates);
}

export function textFieldDescriptionClass() {
  return cn(textFieldBase.description);
}

export function textFieldErrorClass() {
  return cn(textFieldBase.error);
}
