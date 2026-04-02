'use client';

import { forwardRef, type Ref } from 'react';
import type { InputProps as AriaInputProps } from 'react-aria-components';
import { Input as AriaInput } from 'react-aria-components';

import { inputStyles } from './input.styles';
import type { InputSize as Size, InputVariant as Variant } from './input.styles';

export type InputProps = Omit<AriaInputProps, 'className' | 'size' | 'style' | 'onKeyDown'> & {
  variant?: Variant;
  size?: Size;
  ref?: Ref<HTMLInputElement>;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { variant = 'default', size = 'md', ...props },
  ref,
) {
  return <AriaInput {...props} ref={ref} className={() => inputStyles({ variant, size })} />;
});
