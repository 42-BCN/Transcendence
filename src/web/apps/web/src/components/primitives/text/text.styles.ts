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
  caption: 'text-caption',
  'body-xs': 'text-body-xs',
  'body-sm': 'text-body-sm',
  body: 'text-body',
  'body-lg': 'text-body-lg',
  'heading-sm': 'text-heading-sm',
  'heading-md': 'text-heading-md',
  'heading-lg': 'text-heading-lg',
  'heading-xl': 'text-heading-xl',
  code: 'text-code',
};

export function textStyles(variant: TextVariant = 'body') {
  return cn(variantClasses[variant]);
}
