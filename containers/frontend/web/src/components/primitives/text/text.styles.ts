import { cn } from '@/lib/styles/cn';

export type TextVariant =
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

const variantClasses: Record<TextVariant, string> = {
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
  primary: 'text-black',
  info: 'text-blue-400',
  danger: 'text-red-700',
  success: 'text-green-700',
  muted: 'text-slate-600',
};

export type TextColor = keyof typeof colorVariant;

export function textStyles(variant: TextVariant = 'body', color: TextColor = 'primary') {
  return cn(variantClasses[variant], colorVariant[color]);
}
