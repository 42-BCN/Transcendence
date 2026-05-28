import { getTranslations } from 'next-intl/server';

import { Stack, Text } from '@components';

import { protectedMeProfileAction } from './profile.action';
import { EditProfileForm } from './edit-profile.form';

export async function EditProfileFeature() {
  const t = await getTranslations('features.profile');
  const data = await protectedMeProfileAction();

  if (!data.ok) {
    return <div>{t('fail')}</div>;
  }

  return (
    <Stack className="flex-1" gap="sm">
      <Text as="h1" variant="body-lg" className="font-bold">
        {t('edit.title')}
      </Text>

      <EditProfileForm initialBio={data.data.bio} initialAvatar={data.data.avatar} />
    </Stack>
  );
}
