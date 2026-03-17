import type { ComponentPropsWithoutRef } from 'react';
import { type TextColor, type TextVariant, textStyles } from './text.styles';

type TextTag =
  | 'span'
  | 'p'
  | 'strong'
  | 'em'
  | 'small'
  | 'code'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'div';

type TextOwnProps<T extends TextTag> = {
  as?: T;
  variant?: TextVariant;
  color?: TextColor;
};

type TextProps<T extends TextTag> = TextOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof TextOwnProps<T>>;

export function Text<T extends TextTag = 'span'>(props: TextProps<T>) {
  const { as, variant = 'body', color = 'primary', ...restProps } = props;
  const Component = as || 'span';
  const className = [textStyles(variant, color), (restProps as { className?: string }).className]
    .filter(Boolean)
    .join(' ');
  return <Component {...(restProps as ComponentPropsWithoutRef<T>)} className={className} />;
}
