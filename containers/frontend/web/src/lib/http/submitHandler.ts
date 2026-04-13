import { startTransition, FormEvent } from 'react';

type ValidateResult<T> = { ok: true; data: T } | { ok: false };

type FormApi<T> = {
  validateBeforeSubmit: () => ValidateResult<T>;
};

export function createSubmitHandler<T>(form: FormApi<T>, action: (formData: FormData) => void) {
  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = form.validateBeforeSubmit();
    if (!res.ok) return;

    const formData = new FormData(e.currentTarget);

    startTransition(() => {
      action(formData);
    });
  };
}
