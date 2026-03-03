'use client';

import type { ButtonProps as AriaButtonProps } from 'react-aria-components';
import { Button as AriaButton } from 'react-aria-components';

import { buttonStyles, iconStyles } from './button.styles';
import type { ButtonSize as Size, ButtonVariant as Variant, ButtonW as W } from './button.styles';
import type { JSX, ReactNode } from 'react';

export type ButtonProps = Omit<AriaButtonProps, 'className' | 'onClick' | 'style' | 'onKeyDown'> & {
  variant?: Variant;
  size?: Size;
  w?: W;
  icon?: JSX.Element;
  children?: ReactNode;
};

export function Button({
  variant = 'primary',
  size = 'md',
  w = 'full',
  children,
  icon,
  ...props
}: ButtonProps) {
  return (
    <AriaButton {...props} className={buttonStyles({ variant, size, w })}>
      {icon && <span className={iconStyles()}>{icon}</span>}
      {children}
    </AriaButton>
  );
}
