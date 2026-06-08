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

  if (friends.length === 0) {
    return feedback ? (
      <Stack align="center" justify="center" className="px-3 py-3 text-center">
        <Text variant="caption" color="tertiary">
          {t(type)}
        </Text>
      </Stack>
    ) : null;
  }

  return friends.map((item) => {
    const { id, username, avatar } = item;
    const presence =
      (type === 'online' || type === 'offline') && 'presence' in item
        ? item.presence
        : undefined;

    return (
      <UserItem username={username} avatarUrl={avatar ?? undefined} presence={presence} key={id}>
        {type === 'request' && <RequestActions friendshipId={item.id} />}
        {type === 'pending' && <PendingActions friendshipId={id} />}
        {type === 'online' && <OnlineButtons username={username} userId={id} />}
        {type === 'offline' && <OfflineButtons userId={id} />}
        {type === 'search' && <InviteActionButton userId={id} />}
      </UserItem>
    );
  });
}

export function SearchResults() {
  const searchResults = useSocialStore((state) => state.searchResults);

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
            <SocialUserActions type={type} userId={userId} username={username} />
          </UserItem>
        );
      })}
    </Stack>
  );
}
