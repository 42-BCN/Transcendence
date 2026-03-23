import { cn } from '@/lib/styles/cn';

const root = 'grid gap-1.5';
const error = 'font-body-xs text-destructive';
const counter =
  'pointer-events-none font-caption col-start-1 row-start-1 self-end justify-self-end p-2';
const input = 'col-start-1 row-start-1';

export const textAreaFieldStyles = {
  root,
  input: (className: string | undefined) => cn(input, className),
  error,
  counter,
};
