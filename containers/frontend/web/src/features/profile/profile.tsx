import { getTranslations } from 'next-intl/server';
import { protectedMeProfileAction } from './profile.action';
import { InternalLink, Stack, Text } from '@components';

import { DeleteAccountButton } from './delete-account-button';

export async function Profile() {
  const t = await getTranslations('features.profile');
  const data = await protectedMeProfileAction();

  return !data.ok ? (
    <div>{t('fail')}</div>
  ) : (
    <Stack className="flex-1" gap="md">
      <div className="flex-1">
        <Text as="h3" variant="body-xs" className="text-text-secondary ">
          {t('bio')}
        </Text>
        <Text variant="body-sm" className="break-words">
          {data.data.bio || t('emptyBio')}
        </Text>
      </div>

      <Stack gap="sm">
        <InternalLink as="button" variant="cta" href="/me/edit">
          {t('actions.editProfile')}
        </InternalLink>

        <InternalLink as="button" variant="cta" href="/me/reset-password">
          {t('actions.changePassword')}
        </InternalLink>

        <DeleteAccountButton />
      </Stack>
    </Stack>
  );
}
