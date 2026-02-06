'use client';

// // pending add error feedback!
// import type { FormHTMLAttributes } from 'react';
// import type { FormProps as AriaFormProps } from 'react-aria-components';
// import { Form as AriaForm } from 'react-aria-components';

// import { formClass } from './form.styles';

// type ServerAction = (formData: FormData) => void | Promise<void>;
// type FormAction = string | ServerAction;
// type NativeFormAttrs = Pick<
//   FormHTMLAttributes<HTMLFormElement>,
//   'noValidate' | 'autoComplete' | 'name' | 'method' | 'encType' | 'target'
// >;

// export type FormProps = Omit<AriaFormProps, 'action' | 'className'> &
//   NativeFormAttrs & {
//     className?: string;
//     validationBehavior?: 'native' | 'aria';
//     action?: FormAction;
//   };

// export function Form({ className, action, ...props }: FormProps) {
//   return <AriaForm {...props} className={formClass({ className })} action={action} />;
// }

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
  return <form {...props} action={action} method={method} className={formClass({ className })} />;
}
