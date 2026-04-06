import { cn } from '@/lib/styles/cn';

import type {
  InteractiveControlSize,
  InteractiveControlStyleProps,
  InteractiveControlVariant,
  InteractiveControlW,
} from './interactive-control.types';

const interactiveControlBase = [
  'inline-flex items-center justify-center gap-3 rounded-md border font-medium',
  'min-h-6 min-w-6 select-none text-text-primary',
  'transition-[background-color,border-color,color,transform,box-shadow,opacity] duration-150 ease-out',
  'outline-none',
];

const interactiveControlVariants: Record<InteractiveControlVariant, string> = {
  primary: 'border-text-primary bg-bg-primary data-[hovered]:bg-bg-secondary',
  secondary: 'border-border-primary data-[hovered]:bg-bg-secondary',
  ghost: 'border-transparent data-[hovered]:bg-bg-secondary/60',
};

const interactiveControlSizes: Record<InteractiveControlSize, string> = {
  sm: 'h-5 px-2 text-sm',
  md: 'h-6 px-3 text-sm',
  lg: 'h-7 px-4 text-base',
};

const interactiveControlWidths: Record<InteractiveControlW, string> = {
  auto: 'w-auto',
  full: 'w-full',
};

const interactiveControlStates = [
  'data-[pressed]:translate-y-px',
  'data-[focus-visible]:ring-2 data-[focus-visible]:ring-black data-[focus-visible]:ring-offset-2',
  'data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
  'data-[pending]:cursor-wait data-[pending]:opacity-70',
];

const textLinkBase = [
  'inline-flex items-center gap-2 font-caption underline text-blue-500',
  'transition-[color,opacity,box-shadow] duration-150 ease-out outline-none',
  'data-[hovered]:opacity-90',
  'data-[focus-visible]:ring-2 data-[focus-visible]:ring-black data-[focus-visible]:ring-offset-2',
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
];

const navLinkBase = [
  'font-caption opacity-80',
  'data-[current]:font-semibold data-[current]:opacity-100',
  'data-[hovered]:opacity-100',
];

export function interactiveControlStyles(args?: InteractiveControlStyleProps) {
  const { variant = 'primary', size = 'md', w = 'full', className } = args ?? {};

  return cn(
    interactiveControlBase,
    interactiveControlVariants[variant],
    interactiveControlSizes[size],
    interactiveControlWidths[w],
    interactiveControlStates,
    className,
  );
}

export function interactiveTextLinkStyles(className?: string) {
  return cn(textLinkBase, className);
}

export function interactiveNavLinkStyles(args?: Omit<InteractiveControlStyleProps, 'variant'>) {
  const { size = 'md', w = 'auto', className } = args ?? {};

  return cn(
    interactiveControlBase,
    interactiveControlVariants.ghost,
    interactiveControlSizes[size],
    interactiveControlWidths[w],
    interactiveControlStates,
    navLinkBase,
    className,
  );
}

export function interactiveIconSlotStyles() {
  return cn('h-[16px] w-[16px] shrink-0');
}
