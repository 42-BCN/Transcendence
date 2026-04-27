import { cn } from '@/lib/styles/cn';

const inputBase = [
  'font-body-sm',
  'border rounded-lg',
  'w-full px-2 py-2 ',
  'bg-bg-primary text-text-primary autofill:bg-white autofill:text-black',
  'outline-none transition',
];

const inputVariants = {
  default: 'border-border-primary',
  subtle: 'border-transparent bg-bg-secondary',
  danger: 'border-danger',
} as const;

const inputSizes = {
  sm: 'h-6',
  md: 'h-7',
  lg: 'h-8 text-base',
} as const;

// RAC states grouped together
const inputRacStates = [
  'data-[focus-visible]:ring-2 data-[focus-visible]:ring-offset-2 data-[focus-visible]:ring-blue-500',
  'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed',
  'data-[invalid]:border-danger',
  'data-[focused]:bg-bg-primary data-[focused]:border-text-primary',
  'data-[hovered]:border-text-primary',
];

export type InputVariant = keyof typeof inputVariants;
export type InputSize = keyof typeof inputSizes;
export function inputStyles(args?: { variant?: InputVariant; size?: InputSize }) {
  const { variant = 'default', size = 'md' } = args ?? {};
  return cn(inputBase, inputVariants[variant], inputSizes[size], inputRacStates);
}
