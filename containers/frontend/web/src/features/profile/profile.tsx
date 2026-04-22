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
      <div className="flex-1">
        <Text as="h3" variant="body-xs" className="text-text-secondary ">
          {t('bio')}
        </Text>
        <Text variant="body-sm">{data.data.bio || 'no-bio'}</Text>
      </div>
      <InternalLink as="button" variant="cta" href="/me/edit">
        Edit profile
      </InternalLink>
      <InternalLink as="button" href="/me/reset-password">
        Change Password
      </InternalLink>
    </>
  );
}
