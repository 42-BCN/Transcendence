import { getTranslations } from 'next-intl/server';
import { ResendVerification } from '@/features/auth/resend-verification';
import { InternalLink } from '@components/controls/link/link';
import { Text } from '@components/primitives/text';
import { Stack } from '@components/primitives/stack';

export default async function SignupSuccessPage() {
  const t = await getTranslations('features.auth');

  return (
    <Stack>
      <Text as="h1" variant="heading-md">
        {t('verification.title')}
      </Text>
      <Stack>
        <Text as="p" variant="body-sm">
          {t('verification.sent')}
        </Text>
        <Text as="p" variant="body-sm">
          {t('verification.checkInbox')}
        </Text>
        <Text as="p" variant="body-sm">
          {t('verification.checkSpam')}
        </Text>
      </Stack>
      <ResendVerification />
      <InternalLink href="/login">{t('verification.backToLogin')}</InternalLink>
    </Stack>
  );
}
