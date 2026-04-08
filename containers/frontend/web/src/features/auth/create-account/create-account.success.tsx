import { cookies } from 'next/headers';
import { getLocale, getTranslations } from 'next-intl/server';

import { redirect } from '@/i18n/navigation';
import { ResendVerification } from '@/features/auth/resend-verification';
import { InternalLink, Stack, Text } from '@components';
import { MessageBlock } from '@components/composites/text-block/text-block';

const SIGNUP_SUCCESS_COOKIE = 'signup_success';
const PENDING_VERIFICATION_EMAIL_COOKIE = 'pending_verification_email';

export default async function CreateAccountSuccess() {
  const t = await getTranslations('features.auth');
  const locale = await getLocale();
  const cookieStore = await cookies();

  const hasGuard = cookieStore.get(SIGNUP_SUCCESS_COOKIE)?.value === '1';
  const pendingEmail = cookieStore.get(PENDING_VERIFICATION_EMAIL_COOKIE)?.value;

  if (!hasGuard || !pendingEmail) {
    redirect({ href: '/create-account', locale });
  }

  return (
    <Stack gap="md">
      <MessageBlock
        title={t('verification.title')}
        messages={[
          t('verification.sent'),
          t('verification.checkInbox'),
          t('verification.checkSpam'),
        ]}
      />

      <ResendVerification />

      <Stack direction="horizontal" justify="center" align="baseline" gap="sm">
        <Text as="span" variant="caption">
          {t('verification.isConfirmed')}
        </Text>
        <InternalLink href="/login">{t('verification.backToLogin')}</InternalLink>
      </Stack>
    </Stack>
  );
}
