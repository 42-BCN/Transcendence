import { getTranslations } from 'next-intl/server';

import { Stack, Text } from '@components';

import { VerifyEmailClient } from './verify-email.client';

export async function VerifyEmailFeature() {
  const t = await getTranslations('features.auth');

  return (
    <Stack justify="center">
      <Text as="h1" variant="heading-md">
        {t('verification.title')}
      </Text>
      <VerifyEmailClient />
    </Stack>
  );
}
