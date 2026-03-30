import type { HTMLAttributes, ReactNode } from 'react';

import { stackStyles } from './stack.styles';

type StackBaseProps = {
  children?: ReactNode;
  className?: string;
  direction?: 'vertical' | 'horizontal';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between';
};

type DivStackProps = StackBaseProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof StackBaseProps> & {
    as?: 'div';
  };

type NavStackProps = StackBaseProps &
  Omit<HTMLAttributes<HTMLElement>, keyof StackBaseProps> & {
    as: 'nav';
  };

type SectionStackProps = StackBaseProps &
  Omit<HTMLAttributes<HTMLElement>, keyof StackBaseProps> & {
    as: 'section';
  };

type FooterStackProps = StackBaseProps &
  Omit<HTMLAttributes<HTMLElement>, keyof StackBaseProps> & {
    as: 'footer';
  };

type StackProps = DivStackProps | NavStackProps | SectionStackProps | FooterStackProps;

export function Stack(props: StackProps) {
  const {
    as = 'div',
    children,
    className,
    direction = 'vertical',
    gap = 'md',
    align = 'stretch',
    justify = 'start',
    ...rest
  } = props;

  const Component = as;

  return (
    <Component
      className={stackStyles({
        direction,
        gap,
        align,
        justify,
        className,
      })}
      {...rest}
    >
      {children}
    </Component>
  );
}
