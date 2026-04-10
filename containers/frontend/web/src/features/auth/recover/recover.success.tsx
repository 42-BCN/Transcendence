import { getTranslations } from 'next-intl/server';

import { InternalLink, Stack } from '@components';
import { MessageBlock } from '@components/composites/text-block/text-block';
import { RecoverResend } from './recover.resend';

export default async function RecoverSuccess() {
  const t = await getTranslations('features.auth.recover');

  return (
    <Stack gap="md">
      <MessageBlock title={t('title')} messages={[t('sent'), t('checkInbox'), t('checkSpam')]} />
      <RecoverResend />
      <InternalLink href="/login">{t('backToLogin')}</InternalLink>
    </Stack>
  );
}
