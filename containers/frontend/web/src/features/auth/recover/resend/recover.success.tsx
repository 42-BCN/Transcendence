import { getTranslations } from 'next-intl/server';

import { InlineLinkPrompt, MessageBlock } from '@components';
import { RecoverResend } from './recover.resend';

export default async function RecoverSuccess() {
  const t = await getTranslations('features.auth');

  return (
    <>
      <MessageBlock
        title={t('recover.title')}
        messages={[t('recover.sent'), t('recover.checkInbox'), t('recover.checkSpam')]}
      />
      <RecoverResend />
      <InlineLinkPrompt
        text={t('recover.rememberedPassword')}
        linkLabel={t('recover.backToLogin')}
        href="/login"
      />
    </>
  );
}
