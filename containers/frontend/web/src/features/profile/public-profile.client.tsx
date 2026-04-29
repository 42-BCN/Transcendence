'use client';
import { useTranslations } from 'next-intl';

import { Text } from '@components';
import { useSocialStore } from '../social/store/social-store.provider';

interface PublicProfileClientProps {
  bio: string | null;
  username: string;
}

export function PublicProfileClient({ username, bio }: PublicProfileClientProps) {
  const t = useTranslations('features.profile');
  const friends = useSocialStore((s) => s.friends);
  console.log(friends);
  console.log(username);
  return (
    <div className="flex-1">
      <Text as="h3" variant="body-xs" className="text-text-secondary">
        {t('bio')}
      </Text>
      <Text variant="body-sm">{bio || 'no-bio'}</Text>
      {/* Aquí añadiremos los botones de acción en la siguiente fase */}
    </div>
  );
}
