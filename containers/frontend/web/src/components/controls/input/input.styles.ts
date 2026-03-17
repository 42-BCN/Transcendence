import { cn } from '@/lib/styles/cn';

const inputBase = [
  'font-body-sm',
  // layout
  'w-full border bg-white px-2 py-2',
  // behavior
  'outline-none transition',
];

const inputVariants = {
  default: 'border-gray-300',
  subtle: 'border-transparent bg-gray-50',
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
  'data-[focused]:bg-white data-[focused]:border-black',
  'data-[hovered]:border-black',
];

export type InputVariant = keyof typeof inputVariants;
export type InputSize = keyof typeof inputSizes;
export function inputStyles(args?: { variant?: InputVariant; size?: InputSize }) {
  const { variant = 'default', size = 'md' } = args ?? {};
  return cn(inputBase, inputVariants[variant], inputSizes[size], inputRacStates);
}
