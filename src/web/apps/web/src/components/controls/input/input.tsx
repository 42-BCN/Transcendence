'use client';

import type { InputProps as AriaInputProps } from 'react-aria-components';
import { Input as AriaInput } from 'react-aria-components';

import { inputStyles } from './input.styles';
import type { InputSize as Size, InputVariant as Variant } from './input.styles';

export type InputProps = Omit<AriaInputProps, 'className' | 'size' | 'style' | 'onKeyDown'> & {
  variant?: Variant;
  size?: Size;
};

export function Input({ variant = 'default', size = 'md', ...props }: InputProps) {
  return <AriaInput {...props} className={() => inputStyles({ variant, size })} />;
}
