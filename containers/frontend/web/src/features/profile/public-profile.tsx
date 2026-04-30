import { getTranslations } from 'next-intl/server';

import { getPublicProfileAction } from './profile.action';
import { PublicProfileClient } from './public-profile.client';

interface PublicProfileProps {
  username: string;
}

export async function PublicProfile({ username }: PublicProfileProps) {
  const t = await getTranslations('features.profile');
  const data = await getPublicProfileAction(username);

  if (!data?.ok) {
    return <div>{t('fail')}</div>;
  }

  return (
    <PublicProfileClient
      userId={data.data.id}
      username={username}
      bio={data.data.bio}
    />
  );
}
