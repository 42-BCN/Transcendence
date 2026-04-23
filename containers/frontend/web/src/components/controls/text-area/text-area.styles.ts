import { cn } from '@/lib/styles/cn';

const textAreaBase = [
  'font-body',
  'w-full px-2 py-2 min-h-6 max-h-[160px]',
  'border border-border-primary rounded-md',
  'bg-bg-primary text-text-primary',
  'outline-none transition resize-none',
];

const textAreaRacStates = [
  'data-[focus-visible]:ring-2 data-[focus-visible]:ring-offset-2 data-[focus-visible]:ring-blue-500',
  'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed',
  'data-[invalid]:border-red-500',
  'data-[focused]:bg-bg-primary data-[focused]:border-text-primary',
  'data-[hovered]:border-text-primary',
];

export function textAreaStyles(className?: string) {
  return cn(textAreaBase, textAreaRacStates, className);
}
