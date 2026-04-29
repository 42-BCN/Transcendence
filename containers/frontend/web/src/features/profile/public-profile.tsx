import { getTranslations } from 'next-intl/server';
import { Text } from '@components';
import { getPublicProfileAction } from './profile.action';

interface PublicProfileProps {
  userId: string;
}

export async function PublicProfile({ userId }: PublicProfileProps) {
  const t = await getTranslations('features.profile');
  const data = await getPublicProfileAction(userId);

  if (!data?.ok) {
    return <div>{t('fail')}</div>;
  }

  return (
    <div className="flex-1">
      <Text as="h3" variant="body-xs" className="text-text-secondary">
        {t('bio')}
      </Text>
      <Text variant="body-sm">{data.data.bio || 'no-bio'}</Text>
      {/* Aquí añadiremos los botones de acción en la siguiente fase */}
    </div>
  );
}
