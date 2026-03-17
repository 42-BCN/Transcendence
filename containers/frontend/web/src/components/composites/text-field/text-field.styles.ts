// components/forms/field/text-field.styles.ts
import { cn } from '@/lib/styles/cn';

const rootBase = 'grid gap-1.5';
const labelBase = 'font-caption';
const errorBase = 'pointer-events-none font-body-xs text-red-600';
const descriptionBase = 'pointer-events-none font-body-xs text-slate-600';

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
