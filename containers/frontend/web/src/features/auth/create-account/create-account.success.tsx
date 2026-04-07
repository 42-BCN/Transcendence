import { getTranslations } from 'next-intl/server';
import { ResendVerification } from '@/features/auth/resend-verification';
import { InternalLink, Stack, Text } from '@components';

export default async function CreateAccountSuccessPage() {
  const t = await getTranslations('features.auth');

  return (
    <>
      <Text as="h1" variant="heading-md">
        {t('verification.title')}
      </Text>
      <Text as="p" variant="body-sm">
        {t('verification.sent')}
      </Text>
      <Text as="p" variant="body-sm">
        {t('verification.checkInbox')}
      </Text>
      <Text as="p" variant="body-sm">
        {t('verification.checkSpam')}
      </Text>

      <ResendVerification />
      <InternalLink href="/login">{t('verification.backToLogin')}</InternalLink>
    </>
  );
}
