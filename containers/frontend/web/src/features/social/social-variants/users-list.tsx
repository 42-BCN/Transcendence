'use client';

import { useTranslations } from 'next-intl';

import { Stack, Text, UserItem } from '@components';

import { SocialUserActions } from './social-user-actions';
import type { SocialListItem } from './social-list-items';

export type UsersListType = 'request' | 'pending' | 'online' | 'offline' | 'search';

interface UsersListProps {
  items: SocialListItem[];
  type: UsersListType;
  feedback?: boolean;
}

export function UsersList({ items, type, feedback = true }: UsersListProps) {
  const t = useTranslations('features.social.emptyStates');
  const shouldShowFeedback = items.length === 0 && feedback;

  return (
    <Stack gap="none" className="w-full">
      {shouldShowFeedback && (
        <Stack align="center" justify="center" className="px-3 py-3 text-center">
          <Text variant="caption" color="tertiary">
            {t(type)}
          </Text>
        </Stack>
      )}

      {items.map((item) => {
        const { id, userId, username, avatar, subtitle } = item;

        return (
          <UserItem username={username} avatarUrl={avatar ?? undefined} subtitle={subtitle} key={id}>
            <SocialUserActions type={type} userId={userId} />
          </UserItem>
        );
      })}
    </Stack>
  );
}
