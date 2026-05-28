'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';

import { Form, InternalLink, SubmitButton, TextField, ApiFeedback, Stack } from '@components';
import { fieldsBase, formApiReq } from './joinRoom.schema';
import { useForm } from '@/hooks/use-form/use-form';
import { type LoginReq } from '@/contracts/api/auth/auth.validation'; // TODO: change it to comply to my thing
//	depends on nothing.

import { loginAction } from './joinRoom.action'; // TODO: change it to comply to my thing
//	depends on 
import { useAutoFocus } from '@/hooks/useAutoFocus';
import { createSubmitHandler } from '@/lib/http/submitHandler'; // TODO: change it to comply to my thing

export function JoinGameRoomForm() {
  const t = useTranslations('features.auth');
  const form = useForm<GameRoomJoin>(formApiReq);
  const [state, formAction] = useActionState(loginAction, null);
  const identifierRef = useAutoFocus<HTMLInputElement>();

  return (
    <Form onSubmit={createSubmitHandler(form, formAction)}>
      <TextField
        value={form.values.gameRoomId}
        errorKey={form.errors.identifier && `validation.${form.errors.identifier}`}
        onChange={(v) => form.setValue('identifier', v)}
        onBlur={() => form.setTouch('identifier')}
        inputRef={identifierRef}
        {...fieldsBase.identifier}
      />

      <InternalLink href="/recover" className="block text-center">
        {t('login.forgotPassword')}
      </InternalLink>
      <Stack gap="sm">
        <SubmitButton idleLabel={t('login.submit')} />
        <ApiFeedback result={state ?? null} successMessage={t('messages.success')} />
      </Stack>
    </Form>
  );
}
