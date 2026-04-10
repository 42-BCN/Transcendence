import { getTranslations } from 'next-intl/server';
import { Stack, Text } from '@components';
import RecoverForm from './recover.form';

export async function RecoverFeature() {
  const t = await getTranslations('features.auth');

  return (
    <Stack justify="center">
      <Text as="h1" variant="heading-md">
        {t('verification.recoverTitle')}
      </Text>
      <RecoverForm />
    </Stack>
  );
}
