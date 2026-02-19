'use client';

import type { ButtonProps as AriaButtonProps } from 'react-aria-components';
import { Button as AriaButton } from 'react-aria-components';

import { buttonClass } from './button.styles';
import type { ButtonSize as Size, ButtonVariant as Variant } from './button.styles';

export type ButtonProps = Omit<AriaButtonProps, 'className' | 'onClick' | 'style' | 'onKeyDown'> & {
  variant?: Variant;
  size?: Size;
};

export function Button({ variant = 'primary', size = 'md', ...props }: ButtonProps) {
  return <AriaButton {...props} className={buttonClass({ variant, size })} />;
}
