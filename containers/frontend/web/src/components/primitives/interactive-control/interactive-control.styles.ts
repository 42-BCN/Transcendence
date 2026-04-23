import { cn } from '@/lib/styles/cn';

import type {
  InteractiveControlSize,
  InteractiveControlStyleProps,
  InteractiveControlVariant,
  InteractiveControlW,
} from './interactive-control.types';

const interactiveControlBase = [
  'flex items-center justify-center gap-3 rounded-lg border font-medium',
  'min-h-6 min-w-6 select-none text-text-primary',
  'transition-[background-color,border-color,color,transform,box-shadow,opacity] duration-150 ease-out',
  'outline-none',
  'transition-transform duration-200 ease-out hover:-translate-y-0.5 active:-translate-y-[0.25px]',
];

const interactiveControlVariants: Record<InteractiveControlVariant, string> = {
  primary: 'border-text-primary data-[hovered]:bg-bg-secondary',
  cta: 'fancy-btn text-white border-none ',
  secondary: 'border-border-primary data-[hovered]:bg-bg-secondary',
  ghost: 'border-transparent data-[hovered]:bg-bg-secondary/60',
  full: 'bg-success data-[hovered]:bg-green/80 border-none text-white',
};

const interactiveControlSizes: Record<InteractiveControlSize, string> = {
  sm: 'h-6 px-2 text-sm',
  md: 'h-7 px-3 text-sm',
  lg: 'h-8 px-4 text-base',
  icon: 'size-6 p-0',
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
  'inline-flex items-center gap-2 rounded-sm px-1 -mx-1 font-caption underline text-blue-500',
  'transition-[color,opacity,box-shadow] duration-150 ease-out outline-none',
  'hover:bg-bg-secondary/60 hover:text-text-primary hover:opacity-100',
  'data-[hovered]:bg-bg-secondary/60 data-[hovered]:text-text-primary data-[hovered]:opacity-100',
  'focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2',
  'data-[focus-visible]:ring-2 data-[focus-visible]:ring-black data-[focus-visible]:ring-offset-2',
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
];

const navLinkBase = [
  'font-caption opacity-80',
  'data-[current=true]:bg-white/10 data-[current=true]:border-border-primary data-[current=true]:font-semibold data-[current=true]:opacity-100',
  'aria-[current=page]:bg-white/10 aria-[current=page]:border-border-primary aria-[current=page]:font-semibold aria-[current=page]:opacity-100',
  'data-[hovered]:bg-white/5 data-[hovered]:opacity-100',
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
  return cn('h-[20px] w-[20px] flex items-center justify-center shrink-0');
}
