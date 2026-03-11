import type { ReactNode } from 'react';

type TextVariant =
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

type TextTag =
  | 'span'
  | 'p'
  | 'strong'
  | 'em'
  | 'small'
  | 'label'
  | 'code'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'div';

type TextProps = {
  as?: TextTag;
  variant?: TextVariant;
  children?: ReactNode;
  className?: string;
};

const classes: Record<TextVariant, string> = {
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

export function Text({ as = 'span', variant = 'body', children, className }: TextProps) {
  const Component = as;
  const mergedClassName = [classes[variant], className].filter(Boolean).join(' ');

  return <Component className={mergedClassName}>{children}</Component>;
}
