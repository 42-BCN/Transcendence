import { cn } from '@/lib/styles/cn';

const textAreaBase = [
  'text-body-sm',
  'w-full px-2 py-2 min-h-6 max-h-[160px]',
  'border rounded-md',
  'bg-white',
  'outline-none transition resize-none',
];

const textAreaRacStates = [
  'data-[focus-visible]:ring-2 data-[focus-visible]:ring-offset-2 data-[focus-visible]:ring-blue-500',
  'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed',
  'data-[invalid]:border-red-500',
  'data-[focused]:bg-white data-[focused]:border-black',
  'data-[hovered]:border-black',
];

export function textAreaStyles(className: string) {
  return cn(textAreaBase, textAreaRacStates, className);
}
