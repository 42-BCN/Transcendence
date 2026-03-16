import { cn } from '@/lib/styles/cn';

const buttonBase = [
  // layout
  'border inline-flex items-center justify-center font-medium text-gray-900 gap-3 min-h-6 min-w-6',
  // behavior
  'transition outline-none',
];

const buttonVariants = {
  primary: 'border-gray-900 bg-white data-[hovered]:bg-slate-100',
  secondary: 'border-gray-400 data-[hovered]:bg-slate-100',
  ghost: 'border-transparent data-[hovered]:bg-slate-100',
  danger: 'border-red-600 data-[hovered]:bg-red-700',
} as const;

const buttonSizes = {
  sm: 'h-5 text-sm',
  md: 'h-6 px-3 text-sm',
  lg: 'h-7 px-4 text-base',
} as const;

const buttonW = {
  full: 'w-full',
  default: '',
} as const;

const buttonRacStates = [
  'data-[pressed]:translate-y-px',
  'data-[focus-visible]:ring-2 data-[focus-visible]:ring-black',
  'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
  'data-[pending]:opacity-70 data-[pending]:cursor-wait',
];

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;
export type ButtonW = keyof typeof buttonW;

type buttonStyleProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  w?: ButtonW;
  className?: string;
};

export function buttonStyles(args?: buttonStyleProps) {
  const { variant = 'primary', size = 'md', w = 'full', className } = args ?? {};
  return cn(
    buttonBase,
    buttonVariants[variant],
    buttonSizes[size],
    buttonW[w],
    buttonRacStates,
    className,
  );
}

export function iconStyles() {
  return cn('w-[16px] h-[16px]');
}
