import { getLocale, getTranslations } from 'next-intl/server';

import { ResendVerification } from '@/features/auth/resend-verification';
import { InternalLink, Stack } from '@components';
import { MessageBlock } from '@components/composites/text-block/text-block';
// import { redirect } from '@/i18n/navigation';
// import { cookies } from 'next/headers';

export default async function RecoverSuccess() {
  const t = await getTranslations('features.auth.recover');
  // const locale = await getLocale();
  // const cookieStore = await cookies();

  // const flag = cookieStore.get('signup_success');

  // if (!flag) redirect({ href: '/create-account', locale });
  // cookieStore.delete('signup_success');

  return (
    <Stack gap="md">
      <MessageBlock title={t('title')} messages={[t('sent'), t('checkInbox'), t('checkSpam')]} />
      <ResendVerification />
      <InternalLink href="/login">{t('backToLogin')}</InternalLink>
    </Stack>
  );
}
