'use client';

import { Form } from '@components/composites/form';
import { TextField } from '@components/composites/text-field';
import { Button } from '@components/controls/button';
import { useTranslations } from 'next-intl';
import { recoverAction } from './recover.action';

import { createEmptyValues } from '@/lib/forms/defaults';
import { useForm } from '@/lib/forms/use-form';

import { RecoverReqSchema, type RecoverReq } from '@/contracts/auth/auth.recover.caro';

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

export function RecoverFeature() {
  const form = useForm<RecoverReq>(formApiReq);
  const t = useTranslations('auth');
  return (
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
        {...fieldsBase.identifier}
      />

      <Button type="submit">{t('recover.submit')}</Button>
    </Form>
  );
}
