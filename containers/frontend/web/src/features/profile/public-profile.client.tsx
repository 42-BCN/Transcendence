'use client';

import { useTranslations } from 'next-intl';

import { Stack, Text } from '@components';
import { ProfileFriendshipActions } from './profile-friendship-actions';
import { profileStyles } from './profile.styles';

import { useFriendshipActions } from '../social/friendship-actions/use-friendship-actions';

interface PublicProfileClientProps {
  userId: string;
  bio: string | null;
}

export function PublicProfileClient({ userId, bio }: PublicProfileClientProps) {
  const t = useTranslations('features.profile');
  const actions = useFriendshipActions(userId);

  return (
    <Stack className={profileStyles.container} gap="md">
      <div className={profileStyles.bioSection}>
        <Text as="h3" variant="body-xs" className={profileStyles.bioLabel}>
          {t('bio')}
        </Text>

        <Text variant={profileStyles.bioText}>{bio || t('emptyBio')}</Text>
      </div>

      <ProfileFriendshipActions actions={actions} />
    </Stack>
  );
}
