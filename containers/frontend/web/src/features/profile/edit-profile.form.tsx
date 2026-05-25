'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';

import { Form, Stack, SubmitButton, Text, TextAreaField } from '@components';
import { useForm } from '@/hooks';
import { createSubmitHandler } from '@/lib/http/submitHandler';

import { editProfileAction } from './edit-profile.action';
import { BIO_MAX_LENGTH, createEditProfileForm } from './edit-profile.schema';

type EditProfileFormProps = {
  initialBio: string;
};

export function EditProfileForm({ initialBio }: EditProfileFormProps) {
  const t = useTranslations('features.profile');
  const form = useForm(createEditProfileForm(initialBio));
  const [, formAction] = useActionState(editProfileAction, null);

  return (
    <Form
      onSubmit={createSubmitHandler(form, formAction)}
      className="min-w-0 w-full md:w-full flex-1"
    >
      <Stack gap="sm" className="flex-1" justify="between">
        <Stack gap="sm">
          <Text as="h2" variant="body-xs" className="text-text-secondary">
            {t('bio')}
          </Text>

          <TextAreaField
            name="bio"
            value={form.values.bio}
            onChange={(value) => form.setValue('bio', value)}
            onBlur={() => form.setTouch('bio')}
            aria-label={t('bio')}
            errorKey={form.errors.bio && `validation.${form.errors.bio}`}
            maxLength={BIO_MAX_LENGTH}
            textAreaProps={{
              placeholder: t('edit.placeholder'),
              rows: 5,
            }}
          />
        </Stack>

        <SubmitButton idleLabel={t('edit.submit')} />
      </Stack>
    </Form>
  );
}
