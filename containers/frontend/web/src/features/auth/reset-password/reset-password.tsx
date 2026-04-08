import { getTranslations } from 'next-intl/server';

import { Stack, Text } from '@components';

import { ResetPasswordForm } from './reset-password.form';

export async function ResetPasswordFeature() {
  const t = await getTranslations('features.auth');

  return (
    <Stack justify="center">
      <Text as="h1" variant="heading-md">
        {t('reset.title')}
      </Text>
      <Text as="p" variant="body-sm">
        {t('reset.description')}
      </Text>
      <ResetPasswordForm />
    </Stack>
  );
}
