import { getTranslations } from 'next-intl/server';

import { Stack, Text } from '@components';

import { ResendVerificationForm } from './resend-verification.form';

export async function ResendVerificationFeature() {
  const t = await getTranslations('features.auth');

  return (
    <Stack justify="center">
      <Text as="h1" variant="heading-md">
        {t('verification.resendTitle')}
      </Text>
      <Text as="p" variant="body-sm">
        {t('verification.resendDescription')}
      </Text>
      <ResendVerificationForm />
    </Stack>
  );
}
