// components/forms/field/text-field.styles.ts
import { cn } from '@/lib/styles/cn';

const rootBase = 'grid gap-1.5';
const labelBase = 'text-body';
const descriptionBase = 'text-body-xs';
const errorBase = 'text-body-xs';

const textFieldBase = {
  root: rootBase,
  label: labelBase,
  description: descriptionBase,
  error: errorBase,
};

const textFieldRACStates = ['data-[pressed]:opacity-50 first-letter:uppercase'];

export const textFieldStyles = {
  root: () => cn(textFieldBase.root),
  label: () => cn(textFieldBase.label, textFieldRACStates),
  description: () => cn(textFieldBase.description),
  error: () => cn(textFieldBase.error),
};
