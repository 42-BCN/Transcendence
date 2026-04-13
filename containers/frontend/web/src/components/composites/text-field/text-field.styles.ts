// components/forms/field/text-field.styles.ts
import { cn } from '@/lib/styles/cn';

const rootBase = 'grid gap-2';
const labelBase = 'font-body-sm text-emphasis';
const errorBase = 'pointer-events-none font-body-xs text-red-600';
const descriptionBase = 'pointer-events-none font-body-xs text-disabled';

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
