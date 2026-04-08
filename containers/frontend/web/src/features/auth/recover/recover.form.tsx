'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';

import { Button, Form, TextField, ApiFeedback, Stack } from '@components';
import { useForm } from '@/hooks/use-form/use-form';
import { useAutoFocus } from '@/hooks/useAutoFocus';
import type { RecoverReq } from '@/contracts/api/auth/auth.validation';

import { recoverAction } from './recover.action';
import { fieldsBase, formApiReq } from './recover.schema';

export default function RecoverForm() {
  const form = useForm<RecoverReq>(formApiReq);
  const t = useTranslations('features.auth');
  const [state, formAction] = useActionState(recoverAction, null);
  const identifierRef = useAutoFocus<HTMLInputElement>();
  return (
    <>
      <Form
        action={formAction}
        onSubmit={(e) => {
          const res = form.validateBeforeSubmit();
          if (!res.ok) e.preventDefault();
        }}
      >
        <TextField
          value={form.values.identifier}
          errorKey={form.errors.identifier && `validation.${form.errors.identifier}`}
          onChange={(v) => form.setValue('identifier', v)}
          onBlur={() => form.setTouch('identifier')}
          inputRef={identifierRef}
          {...fieldsBase.identifier}
        />
        <Stack gap="sm">
          <Button type="submit">{t('actions.sendEmail')}</Button>
          <ApiFeedback result={state ?? null} successMessage={t('messages.success')} />
        </Stack>
      </Form>
    </>
  );
}
