'use client';

import type { FormHTMLAttributes } from 'react';
import { formStyles } from './form.styles';

type ServerAction = (formData: FormData) => void | Promise<void>;
type FormAction = string | ServerAction;

export type FormProps = Omit<FormHTMLAttributes<HTMLFormElement>, 'action' | 'method'> & {
  action?: FormAction | ServerAction | undefined;
  method?: 'GET' | 'POST';
};

export function Form({ action, method, ...props }: FormProps) {
  return <form {...props} action={action} method={method} className={formStyles()} />;
}
