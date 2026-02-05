'use client';

// pending add error feedback!
import type { FormProps as AriaFormProps } from 'react-aria-components';
import { Form as AriaForm } from 'react-aria-components';

import { formClass } from './form.styles';

export type FormProps = Omit<AriaFormProps, 'className'> & {
  className?: string;
};

export function Form({ className, ...props }: FormProps) {
  return <AriaForm {...props} className={formClass({ className })} />;
}
