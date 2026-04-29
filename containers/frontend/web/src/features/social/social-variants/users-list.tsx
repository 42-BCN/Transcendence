'use client';

import { useTranslations } from 'next-intl';

import { Stack, Text, UserItem } from '@components';

import type {
  FriendPublic,
  FriendshipPublic,
} from '@/contracts/api/friendships/friendships.contracts';
import type { SearchUserResult } from '@/contracts/api/users/users.contracts';

import { useSocialStore } from '../store/social-store.provider';
import { OnlineButtons } from './online-buttons';
import { OfflineButtons } from './offline-buttons';
import { InviteActionButton } from './invite-action-button';
import { AcceptActionButton } from './accept-action-button';
import { RejectActionButton } from './reject-action-button';

export type SocialUserItem = FriendPublic | FriendshipPublic | SearchUserResult;

export type UsersListType = 'request' | 'pending' | 'online' | 'offline' | 'search';

interface UsersListProps {
  friends: SocialUserItem[];
  type: UsersListType;
  feedback?: boolean;
}

export function RequestActions({ friendshipId }: { friendshipId: string }) {
  return (
    <>
      <RejectActionButton friendshipId={friendshipId} type="pendingReceived" />
      <AcceptActionButton friendshipId={friendshipId} />
    </>
  );
}

export function PendingActions({ friendshipId }: { friendshipId: string }) {
  return <RejectActionButton friendshipId={friendshipId} type="pendingSent" />;
}

export function UsersList({ friends, type, feedback = true }: UsersListProps) {
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
    const userId = 'userId' in item ? item.userId : id;

    return (
      <UserItem id={userId} username={username} avatarUrl={avatar ?? undefined} key={id}>
        {type === 'request' && <RequestActions friendshipId={id} />}
        {type === 'pending' && <PendingActions friendshipId={id} />}
        {type === 'online' && <OnlineButtons username={username} userId={userId} />}
        {type === 'offline' && <OfflineButtons userId={userId} />}
        {type === 'search' && <InviteActionButton userId={userId} />}
      </UserItem>
    );
  });
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
