import type { ReactNode } from 'react';
import { type TextVariant, textStyles } from './text.styles';

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

export function Text({ as = 'span', variant = 'body', children, className }: TextProps) {
  const Component = as;

  return <Component className={textStyles(variant, className)}>{children}</Component>;
}
