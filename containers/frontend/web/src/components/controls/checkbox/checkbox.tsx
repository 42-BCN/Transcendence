'use client';

import {
  Checkbox as AriaCheckbox,
  type CheckboxProps as AriaCheckboxProps,
} from 'react-aria-components';
import { checkboxStyles } from './checkbox.styles';
import { cn } from '@/lib/styles/cn';
import type { ReactNode } from 'react';

export type CheckboxProps = AriaCheckboxProps & {
  children?: ReactNode;
};

export function Checkbox({ children, className, ...props }: CheckboxProps) {
  return (
    <AriaCheckbox
      {...props}
      className={(values) =>
        cn(checkboxStyles.root(), typeof className === 'function' ? className(values) : className)
      }
    >
      {({ isSelected, isIndeterminate, isInvalid }) => (
        <>
          <div className={checkboxStyles.box({ isInvalid })}>
            <svg
              viewBox="0 0 18 18"
              aria-hidden="true"
              className={checkboxStyles.icon({ isSelected: isSelected || isIndeterminate })}
            >
              {isIndeterminate ? (
                <rect x="4" y="8" width="10" height="2" fill="currentColor" />
              ) : (
                <polyline
                  points="3 9 7 13 15 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </div>
          {children && <span className={checkboxStyles.label()}>{children}</span>}
        </>
      )}
    </AriaCheckbox>
  );
}
