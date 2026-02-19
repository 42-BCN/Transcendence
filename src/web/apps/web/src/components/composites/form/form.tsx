'use client';

import type { FormHTMLAttributes } from 'react';
import { formClass } from './form.styles';

type ServerAction = (formData: FormData) => void | Promise<void>;
type FormAction = string | ServerAction;

export type FormProps = Omit<
  FormHTMLAttributes<HTMLFormElement>,
  'action' | 'className' | 'method'
> & {
  className?: string;
  action?: FormAction;
  method?: 'GET' | 'POST';
};

export function Form({ className, action, method, ...props }: FormProps) {
  return <form {...props} action={action} method={method} className={formClass()} />;
}
