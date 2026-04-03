import { cn } from '@/lib/styles/cn';

const inputBase = [
  'font-body-sm',
  // layout
  'w-full border border-border-primary bg-bg-primary text-text-primary px-2 py-2',
  // behavior
  'outline-none transition',
];

const inputVariants = {
  default: 'border-border-primary',
  subtle: 'border-transparent bg-bg-secondary',
  danger: 'border-red-500',
} as const;

const inputSizes = {
  sm: 'h-5',
  md: 'h-6',
  lg: 'h-7 text-base',
} as const;

// RAC states grouped together
const inputRacStates = [
  'data-[focus-visible]:ring-2 data-[focus-visible]:ring-offset-2 data-[focus-visible]:ring-blue-500',
  'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed',
  'data-[invalid]:border-red-500',
  'data-[focused]:bg-bg-primary data-[focused]:border-text-primary',
  'data-[hovered]:border-text-primary',
];

export type InputVariant = keyof typeof inputVariants;
export type InputSize = keyof typeof inputSizes;
export function inputStyles(args?: { variant?: InputVariant; size?: InputSize }) {
  const { variant = 'default', size = 'md' } = args ?? {};
  return cn(inputBase, inputVariants[variant], inputSizes[size], inputRacStates);
}
