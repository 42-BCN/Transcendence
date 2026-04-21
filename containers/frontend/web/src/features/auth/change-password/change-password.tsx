import { getTranslations } from 'next-intl/server';

import { Text } from '@components';

import { ChangePasswordForm } from './change-password.form';

export async function ChangePasswordFeature() {
  const t = await getTranslations('features.auth');

  return (
    <>
      <Text as="h1" variant="heading-sm">
        {t('changePassword.title')}
      </Text>
      <Text as="p" variant="body-sm">
        {t('changePassword.description')}
      </Text>
      <ChangePasswordForm />
    </>
  );
}
