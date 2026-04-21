'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';

import { ApiFeedback, Form, Stack, SubmitButton, TextField } from '@components';
import { useAutoFocus } from '@/hooks/useAutoFocus';
import { useForm } from '@/hooks/use-form/use-form';
import { createSubmitHandler } from '@/lib/http/submitHandler';

import { changePasswordAction } from './change-password.action';
import { fieldsBase, formApiReq, type ChangePasswordFormReq } from './change-password.schema';

export function ChangePasswordForm() {
  const t = useTranslations('features.auth');
  const form = useForm<ChangePasswordFormReq>(formApiReq);
  const [state, formAction] = useActionState(changePasswordAction, null);
  const currentPasswordRef = useAutoFocus<HTMLInputElement>();

  return (
    <Form onSubmit={createSubmitHandler(form, formAction)}>
      <TextField
        value={form.values.currentPassword}
        errorKey={form.errors.currentPassword && `validation.${form.errors.currentPassword}`}
        onChange={(v: string) => form.setValue('currentPassword', v)}
        onBlur={() => form.setTouch('currentPassword')}
        inputRef={currentPasswordRef}
        {...fieldsBase.currentPassword}
      />

      <TextField
        value={form.values.newPassword}
        errorKey={form.errors.newPassword && `validation.${form.errors.newPassword}`}
        onChange={(v: string) => form.setValue('newPassword', v)}
        onBlur={() => form.setTouch('newPassword')}
        {...fieldsBase.newPassword}
      />

      <Stack gap="sm">
        <SubmitButton idleLabel={t('changePassword.submit')} />
        <ApiFeedback result={state ?? null} successMessage={t('changePassword.success')} />
      </Stack>
    </Form>
  );
}
