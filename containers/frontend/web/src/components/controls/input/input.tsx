'use client';

import { forwardRef } from 'react';
import type { InputProps as AriaInputProps } from 'react-aria-components';
import { Input as AriaInput } from 'react-aria-components';

import { Icon } from '../../primitives/icon';
import type { IconName } from '../../primitives/icon';
import { inputStyles, inputWrapperStyles, inputIconStyles } from './input.styles';
import type { InputSize as Size, InputVariant as Variant } from './input.styles';

export type InputProps = Omit<AriaInputProps, 'className' | 'size' | 'style' | 'onKeyDown'> & {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  iconPosition?: 'start' | 'end';
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { variant = 'default', size = 'md', icon, iconPosition = 'start', ...props },
  ref,
) {
  if (!icon) {
    return <AriaInput {...props} ref={ref} className={inputStyles({ variant, size })} />;
  }

  return (
    <span className={inputWrapperStyles()}>
      {iconPosition === 'start' ? (
        <Icon name={icon} className={inputIconStyles({ position: 'start' })} aria-hidden />
      ) : null}

      <AriaInput
        {...props}
        ref={ref}
        className={inputStyles({
          variant,
          size,
          iconPosition,
        })}
      />

      {iconPosition === 'end' ? (
        <Icon name={icon} className={inputIconStyles({ position: 'end' })} aria-hidden />
      ) : null}
    </span>
  );
});
