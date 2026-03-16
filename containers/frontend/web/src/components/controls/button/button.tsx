'use client';

import type { ButtonProps as AriaButtonProps } from 'react-aria-components';
import { Button as AriaButton } from 'react-aria-components';

import { buttonStyles, iconStyles } from './button.styles';
import type { ButtonSize as Size, ButtonVariant as Variant, ButtonW as W } from './button.styles';
import type { ReactNode } from 'react';

export type ButtonProps = Omit<AriaButtonProps, 'className' | 'onClick' | 'style' | 'onKeyDown'> & {
  variant?: Variant;
  size?: Size;
  w?: W;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export function Button({
  variant = 'primary',
  size = 'md',
  w = 'full',
  children,
  icon,
  className,
  ...props
}: ButtonProps) {
  return (
    <AriaButton {...props} className={buttonStyles({ variant, size, w, className })}>
      {icon && <span className={iconStyles()}>{icon}</span>}
      {children}
    </AriaButton>
  );
}
