import { cn } from '@/lib/styles/cn';

export type TextVariant =
  | 'divider'
  | 'caption'
  | 'body-xs'
  | 'body-sm'
  | 'body'
  | 'body-lg'
  | 'heading-sm'
  | 'heading-md'
  | 'heading-lg'
  | 'heading-xl'
  | 'code';

const dividerStyles =
  'flex items-center gap-4 before:h-px before:flex-1 before:bg-border-primary after:h-px after:flex-1 after:bg-border-primary';

const variantClasses: Record<TextVariant, string> = {
  divider: `font-caption ${dividerStyles} `,
  caption: 'font-caption',
  'body-xs': 'font-body-xs',
  'body-sm': 'font-body-sm',
  body: 'font-body',
  'body-lg': 'font-body-lg',
  'heading-sm': 'font-heading-sm',
  'heading-md': 'font-heading-md',
  'heading-lg': 'font-heading-lg',
  'heading-xl': 'font-heading-xl',
  code: 'font-code',
};

const colorVariant = {
  primary: 'text-text-primary',
  secondary: 'text-text-secondary',
  tertiary: 'text-text-tertiary',
  disabled: 'text-text-disabled',
  inverse: 'text-text-inverse',
  info: 'text-blue-400',
  danger: 'text-red-700',
  success: 'text-green-700',
  muted: 'text-slate-600',
};

export type TextColor = keyof typeof colorVariant;

export function textStyles(variant: TextVariant = 'body', color: TextColor = 'primary') {
  return cn(variantClasses[variant], colorVariant[color]);
}
