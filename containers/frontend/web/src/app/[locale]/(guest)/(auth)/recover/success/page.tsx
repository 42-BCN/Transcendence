import { getTranslations } from 'next-intl/server';

import { InternalLink, Stack, Text } from '@components';

export default async function RecoverSuccessPage() {
  const t = await getTranslations('features.auth');

  return (
    <Stack>
      <Text as="h1" variant="heading-md">
        {t('recover.title')}
      </Text>
      <Stack>
        <Text as="p" variant="body-sm">
          {t('recover.sent')}
        </Text>
        <Text as="p" variant="body-sm">
          {t('recover.checkInbox')}
        </Text>
        <Text as="p" variant="body-sm">
          {t('recover.checkSpam')}
        </Text>
      </Stack>
      <InternalLink href="/login">{t('recover.backToLogin')}</InternalLink>
    </Stack>
  );
}
