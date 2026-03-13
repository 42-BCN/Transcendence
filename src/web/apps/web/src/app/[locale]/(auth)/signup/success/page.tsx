import { getTranslations } from 'next-intl/server';
import { ResendVerification } from '@/features/auth/resend-verification';
import { InternalLink } from '@components/controls/link/link';
import { Text } from '@components/primitives/text';
import { Stack } from '@components/primitives/stack/stack';

export default async function SignupSuccessPage() {
  const t = await getTranslations('auth');

  return (
    <Stack>
      <Text as="h1" variant="heading-md">
        {t('createAccount.success.title')}
      </Text>
      <Stack gap="sm">
        <Text as="p" variant="body-sm">
          {t('createAccount.success.sent')}
        </Text>
        <Text as="p" variant="body-sm">
          {t('createAccount.success.check')}
        </Text>
        <Text as="p" variant="body-sm">
          {t('createAccount.success.checkSpam')}
        </Text>
      </Stack>
      <ResendVerification />
      <InternalLink href="/login">{t('createAccount.success.backToLogin')}</InternalLink>
    </Stack>
  );
}
