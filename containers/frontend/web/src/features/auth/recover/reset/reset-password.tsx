import { getTranslations } from 'next-intl/server';

import { InlineLinkPrompt, MessageBlock } from '@components';

import { ResetPasswordForm } from './reset-password.form';

export async function ResetPasswordFeature() {
  const t = await getTranslations('features.auth');

  return (
    <>
      <MessageBlock title={t('reset.title')} messages={[t('reset.description')]} />
      <ResetPasswordForm />
      {/* TODO: put a before text */}
      <InlineLinkPrompt
        text={t('recover.rememberedPassword')}
        linkLabel={t('recover.backToLogin')}
        href="/login"
      />
    </>
  );
}
