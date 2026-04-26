'use client';

import { useTranslations } from 'next-intl';
import { UserItem } from '@/components/composites/user-item/user-item';
import { Stack } from '@/components/primitives/stack';
import { Text } from '@/components/primitives/text';
import { UserActions, type SocialUserItem } from './user-actions';

interface UsersListProps {
  friends: SocialUserItem[];
  type: 'request' | 'pending' | 'online' | 'offline' | 'search';
}

/**
 * Polymorphic component for rendering lists of users in the social feature.
 */
export function UsersList({ friends, type }: UsersListProps) {
  const t = useTranslations('features.social.emptyStates');

  if (friends.length === 0) {
    return (
      <Stack align="center" justify="center" className="py-3 px-3 text-center">
        <Text variant="caption" color="tertiary">
          {t(type)}
        </Text>
      </Stack>
    );
  }

  return friends.map((item) => (
    <UserItem key={item.id} username={item.username} avatarUrl={item.avatar ?? undefined}>
      <UserActions item={item} type={type} />
    </UserItem>
  ));
}
