import { cn } from '@/lib/styles/cn';

const inputBase = [
  'font-body-sm',
  'border rounded-lg',
  'w-full px-2 py-2',
  'bg-bg-primary text-text-primary placeholder:text-text-disabled autofill:bg-white autofill:text-black',
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

const inputIconPadding = {
  start: 'pl-5',
  end: 'pr-5',
  none: '',
} as const;

const inputRacStates = [
  'data-[focus-visible]:ring-2 data-[focus-visible]:ring-offset-2 data-[focus-visible]:ring-blue-500',
  'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed',
  'data-[invalid]:border-danger',
  'data-[focused]:bg-bg-primary data-[focused]:border-text-primary',
  'data-[hovered]:border-text-primary',
];

const inputWrapperBase = ['relative inline-flex w-full items-center'];

const inputIconBase = ['pointer-events-none absolute', 'text-text-disabled'];

const inputIconPositions = {
  start: 'left-2',
  end: 'right-2',
} as const;

export type InputVariant = keyof typeof inputVariants;
export type InputSize = keyof typeof inputSizes;
export type InputIconPosition = keyof typeof inputIconPositions;

export function inputStyles(args?: {
  variant?: InputVariant;
  size?: InputSize;
  iconPosition?: InputIconPosition;
}) {
  const { variant = 'default', size = 'md', iconPosition } = args ?? {};

  return cn(
    inputBase,
    inputVariants[variant],
    inputSizes[size],
    iconPosition ? inputIconPadding[iconPosition] : inputIconPadding.none,
    inputRacStates,
  );
}

export function inputWrapperStyles() {
  return cn(inputWrapperBase);
}

export function inputIconStyles(args: { position: InputIconPosition }) {
  return cn(inputIconBase, inputIconPositions[args.position]);
}
