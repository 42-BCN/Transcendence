'use client';

import {
  Checkbox as AriaCheckbox,
  type CheckboxProps as AriaCheckboxProps,
} from 'react-aria-components';
import { checkboxStyles } from './checkbox.styles';
import type { ReactNode } from 'react';

export type CheckboxProps = AriaCheckboxProps & {
  children?: ReactNode;
};

export function Checkbox({ children, className, ...props }: CheckboxProps) {
  return (
    <AriaCheckbox {...props} className={(values) => checkboxStyles.root(className as any, values)}>
      {({ isSelected, isIndeterminate, isInvalid }) => (
        <>
          <div className={checkboxStyles.box({ isInvalid })}>
            <svg
              viewBox="0 0 18 18"
              aria-hidden="true"
              className={checkboxStyles.icon({ isSelected: isSelected || isIndeterminate })}
            >
              {isIndeterminate ? <IndeterminateIcon /> : <CheckedIcon />}
            </svg>
          </div>
          {children && <span className={checkboxStyles.label()}>{children}</span>}
        </>
      )}
    </AriaCheckbox>
  );
}

function IndeterminateIcon() {
  return <rect x="4" y="8" width="10" height="2" fill="currentColor" />;
}

function CheckedIcon() {
  return (
    <polyline
      points="3 9 7 13 15 5"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}
