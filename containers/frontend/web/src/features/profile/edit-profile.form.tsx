'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';

import { Avatar, Form, Stack, SubmitButton, Text, TextAreaField } from '@components';
import { useForm } from '@/hooks';
import { createSubmitHandler } from '@/lib/http/submitHandler';
import { AvatarEnum } from '@/contracts/api/users/users.validation';

import { editProfileAction } from './edit-profile.action';
import { BIO_MAX_LENGTH, createEditProfileForm } from './edit-profile.schema';

type EditProfileFormProps = {
  initialBio: string;
  initialAvatar: string | null;
};

export function EditProfileForm({ initialBio, initialAvatar }: EditProfileFormProps) {
  const t = useTranslations('features.profile');
  const form = useForm(createEditProfileForm(initialBio, initialAvatar));
  const [, formAction] = useActionState(editProfileAction, null);

  return (
    <Form
      onSubmit={createSubmitHandler(form, formAction)}
      className="min-w-0 w-full md:w-full flex-1"
    >
      <input type="hidden" name="avatar" value={form.values.avatar || ''} />

      <Stack gap="sm" className="flex-1" justify="between">
        <Stack gap="lg">
          <Stack gap="sm">
            <Text as="h2" variant="body-xs" className="text-text-secondary">
              {t('edit.chooseAvatar')}
            </Text>
            <div className="flex gap-4 overflow-x-auto px-4 py-4 -mx-4">
              {AvatarEnum.options.map((avatarPath) => (
                <button
                  key={avatarPath}
                  type="button"
                  onClick={() => form.setValue('avatar', avatarPath)}
                  aria-label={t('edit.avatarAlt', { name: avatarPath })}
                  className={`rounded-lg transition-all duration-200 shrink-0 ${
                    form.values.avatar === avatarPath
                      ? 'outline outline-2 outline-primary outline-offset-2 scale-110 opacity-100'
                      : 'hover:scale-105 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Avatar src={avatarPath} size="lg" />
                </button>
              ))}
            </div>
          </Stack>

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
        </Stack>

        <SubmitButton idleLabel={t('edit.submit')} />
      </Stack>
    </Form>
  );
}
