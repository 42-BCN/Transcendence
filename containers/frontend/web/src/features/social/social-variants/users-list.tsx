'use client';

import { useTranslations } from 'next-intl';

import { Stack, Text, UserItem } from '@components';

import type {
  FriendPublic,
  FriendshipPublic,
} from '@/contracts/api/friendships/friendships.contracts';
import type { SearchUserResult } from '@/contracts/api/users/users.contracts';

import { useSocialStore } from '@/providers/social-provider';
import { SocialUserActions } from './social-user-actions';

export type SocialUserItem = FriendPublic | FriendshipPublic | SearchUserResult;

export type UsersListType = 'request' | 'pending' | 'online' | 'offline' | 'search';

interface UsersListProps {
  friends: SocialUserItem[];
  type: UsersListType;
  feedback?: boolean;
}

function getActionUserId(item: SocialUserItem): string {
  return 'userId' in item ? item.userId : item.id;
}

export function UsersList({ friends, type, feedback = true }: UsersListProps) {
  const t = useTranslations('features.social.emptyStates');
  const shouldShowFeedback = friends.length === 0 && feedback;

  return (
    <>
      {shouldShowFeedback && (
        <Stack align="center" justify="center" className="px-3 py-3 text-center">
          <Text variant="caption" color="tertiary">
            {t(type)}
          </Text>
        </Stack>
      )}

      {friends.map((item) => {
        const { id, username, avatar } = item;

        return (
          <UserItem username={username} avatarUrl={avatar ?? undefined} key={id}>
            <SocialUserActions type={type} userId={getActionUserId(item)} />
          </UserItem>
        );
      })}
    </>
  );
}

export function SearchResults() {
  const searchResults = useSocialStore((state) => state.searchResults);

  return (
    <>
      <UsersList friends={searchResults.online} type="online" feedback={false} />
      <UsersList friends={searchResults.offline} type="offline" feedback={false} />
      <UsersList friends={searchResults.requests} type="request" feedback={false} />
      <UsersList friends={searchResults.pending} type="pending" feedback={false} />
      <UsersList friends={searchResults.none} type="search" feedback={false} />
    </>
  );
}
