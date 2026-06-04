import { getTranslations } from 'next-intl/server';

import { Stack, Text } from '@components';

import type { UpdateMeProfileReq } from '@/contracts/api/users/users.validation';
import { AvatarEnum } from '@/contracts/api/users/users.validation';

import { protectedMeProfileAction } from './profile.action';
import { EditProfileForm } from './edit-profile.form';

export async function EditProfileFeature() {
  const t = await getTranslations('features.profile');
  const data = await protectedMeProfileAction();

  if (!data.ok) {
    return <div>{t('fail')}</div>;
  }

  const parsedAvatar = AvatarEnum.safeParse(data.data.avatar);
  const initialAvatar = parsedAvatar.success ? parsedAvatar.data : null;

  return (
    <Stack className="flex-1" gap="sm">
      <Text as="h1" variant="body-lg" className="font-bold">
        {t('edit.title')}
      </Text>

      <EditProfileForm
        initialBio={data.data.bio}
        initialAvatar={initialAvatar}
      />
    </Stack>
  );
}
