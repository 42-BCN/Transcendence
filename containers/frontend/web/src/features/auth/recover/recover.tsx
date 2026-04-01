'use client';

import { useEffect, useRef } from 'react';

import { Form } from '@components/composites/form';
import { TextField } from '@components/composites/text-field';
import { Button } from '@components/controls/button';
import { useTranslations } from 'next-intl';
import { recoverAction } from './recover.action';

import { createEmptyValues } from '@/lib/forms/defaults';
import { useForm } from '@/lib/forms/use-form';

import { RecoverReqSchema, type RecoverReq } from '@/contracts/api/auth/auth.recover.caro';
import { Text } from '@components/primitives/text';
import { Stack } from '@components/primitives/stack';

const fieldsBase = {
  identifier: {
    name: 'identifier',
    labelKey: 'auth.common.identifier.label',
    placeholderKey: 'auth.common.identifier.placeholder',
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
  const t = useTranslations('auth');

  const { identifierRef } = useRecoverFieldNavigation();

  return (
    <Stack justify="center">
      <Text as="h1" variant="heading-md">
        {t('recover.title')}
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

        <Button type="submit">{t('recover.submit')}</Button>
      </Form>
    </Stack>
  );
}
