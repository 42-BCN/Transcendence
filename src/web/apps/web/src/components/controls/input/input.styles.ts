import { cn } from '@/lib/styles/cn';

const inputBase = [
  // layout
  'w-full rounded border bg-white px-3 py-2 text-sm',
  // behavior
  'outline-none transition',
];

const inputVariants = {
  default: 'border-gray-300',
  subtle: 'border-transparent bg-gray-50',
  danger: 'border-red-500',
} as const;

const inputSizes = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-12 text-base',
} as const;

// RAC states grouped together
const inputRacStates = [
  'data-[focus-visible]:ring-2 data-[focus-visible]:ring-offset-2 data-[focus-visible]:ring-blue-500',
  'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed',
  'data-[invalid]:border-red-500',
  'data-[focused]:bg-white data-[focused]:border-gray-300',
];

export type InputVariant = keyof typeof inputVariants;
export type InputSize = keyof typeof inputSizes;
export function inputClass(args?: { variant?: InputVariant; size?: InputSize }) {
  const { variant = 'default', size = 'md' } = args ?? {};
  return cn(inputBase, inputVariants[variant], inputSizes[size], inputRacStates);
}
