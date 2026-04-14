import { getTranslations } from 'next-intl/server';

import { FormTitle } from '@components';

import { VerifyEmailClient } from './verify-email.client';

export async function VerifyEmailFeature() {
  const t = await getTranslations('features.auth');

  return (
    <>
      <FormTitle title={t('verification.title')} />
      <VerifyEmailClient />
    </>
  );
}
