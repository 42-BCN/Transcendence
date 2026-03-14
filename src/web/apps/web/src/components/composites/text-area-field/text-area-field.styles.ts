import { cn } from '@/lib/styles/cn';

const root = 'grid gap-1.5 relative';
const label = 'text-sm font-medium';
const description = 'text-xs text-gray-600';
const error = 'text-xs text-red-600';
const counter = 'pointer-events-none absolute bottom-2 right-3 text-caption ';

const textAreaFieldRACStates = ['data-[pressed]:opacity-50 first-letter:uppercase'];

export const textAreaFieldStyles = {
  root: () => cn(root),
  label: () => cn(label, textAreaFieldRACStates),
  description: () => cn(description),
  error: () => cn(error),
  counter: () => cn(counter),
};
