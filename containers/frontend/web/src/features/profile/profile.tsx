import { getTranslations } from 'next-intl/server';
import { protectedMeProfileAction } from './profile.action';
import { Button, InternalLink, Text } from '@components';

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
        <Text variant="body-sm">{data.data.bio || t('emptyBio')}</Text>
      </div>
      <InternalLink as="button" variant="cta" href="/me/edit">
        {t('editProfile')}
      </InternalLink>
      <InternalLink as="button" variant="cta" href="/me/reset-password">
        {t('changePassword')}
      </InternalLink>
      <Button className="border-slate-500 text-slate-500">{t('deleteAccount')}</Button>
    </>
  );
}
