'use client';

import { useEffect, useRef } from 'react';

import { Button, Form, TextField } from '@components';
import { useTranslations } from 'next-intl';
import { recoverAction } from './recover.action';

import { createEmptyValues } from '@/lib/forms/defaults';
import { useForm } from '@/lib/forms/use-form';

import { RecoverReqSchema, type RecoverReq } from '@/contracts/api/auth/auth.recover.caro';
import { Stack, Text } from '@components';

const fieldsBase = {
  identifier: {
    name: 'identifier',
    labelKey: 'features.auth.fields.identifier.label',
    placeholderKey: 'features.auth.fields.identifier.placeholder',
    isRequired: true,
  },
} as const;

const fieldNames: (keyof typeof fieldsBase)[] = ['identifier'];
const defaultValues = createEmptyValues<RecoverReq>(fieldNames);

const formApiReq = {
  schema: RecoverReqSchema,
  fieldNames,
  defaultValues,
} as const;

function useRecoverFieldNavigation() {
  const identifierRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    identifierRef.current?.focus();
  }, []);

  return {
    identifierRef,
  };
}

export function RecoverFeature() {
  const form = useForm<RecoverReq>(formApiReq);
  const t = useTranslations('features.auth');

  const { identifierRef } = useRecoverFieldNavigation();

  return (
    <Stack justify="center">
      <Text as="h1" variant="heading-md">
        {t('verification.recoverTitle')}
      </Text>

      <Form
        action={recoverAction}
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

        <Button type="submit">{t('actions.sendEmail')}</Button>
      </Form>
    </Stack>
  );
}
