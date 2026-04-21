import { getTranslations } from 'next-intl/server';
import { protectedMeProfileAction } from './profile.action';
import { InternalLink, Text } from '@components';

export async function Profile() {
  const t = await getTranslations('features.profile');
  const data = await protectedMeProfileAction();

  return !data.ok ? (
    <div>{t('fail')}</div>
  ) : (
    <>
      <Text as="h3" variant="body-sm">
        {t('bio')}
      </Text>
      <Text>{data.data.bio}</Text>
      <Text as="h3" variant="body-sm">
        {t('provider')}
      </Text>
      <Text>{data.data.provider}</Text>
      <InternalLink as="button" href="/me/edit">
        Edit profile
      </InternalLink>
      <InternalLink as="button" href="/me/reset-password">
        Change Password
      </InternalLink>
    </>
  );
}
