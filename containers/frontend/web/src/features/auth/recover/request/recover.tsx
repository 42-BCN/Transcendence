import { getTranslations } from 'next-intl/server';
import { InlineLinkPrompt, FormTitle } from '@components';
import RecoverForm from './recover.form';

export async function RecoverFeature() {
  const t = await getTranslations('features.auth');

  return (
    <>
      <FormTitle title={t('verification.recoverTitle')} />
      <RecoverForm />
      <InlineLinkPrompt
        text={t('recover.rememberedPassword')}
        linkLabel={t('recover.backToLogin')}
        href="/login"
      />
    </>
  );
}
