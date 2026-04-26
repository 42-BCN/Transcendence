'use client';

import type {
  FriendPublic,
  FriendshipPublic,
} from '@/contracts/api/friendships/friendships.contracts';
import type { SearchUserResult } from '@/contracts/api/users/users.contracts';
import { useSocialStore } from '../store/use-social-store';

import { OnlineButtons } from './online-buttons';
import { OfflineButtons } from './offline-buttons';
import { AcceptActionButton } from './accept-action-button';
import { RejectActionButton } from './reject-action-button';
import { InviteActionButton } from './invite-action-button';

/**
 * Union type for any user item displayed in the social feature.
 */
export type SocialUserItem = FriendPublic | FriendshipPublic | SearchUserResult;

interface UserActionsProps {
  item: SocialUserItem;
  type: 'request' | 'pending' | 'online' | 'offline' | 'search';
}

/**
 * Internal component to handle search-specific actions.
 */
function SearchActions({
  item,
  currentUserId,
  friends,
}: {
  item: SearchUserResult;
  currentUserId: string | null;
  friends: FriendPublic[];
}) {
  const { id, friendshipStatus: status, friendshipId, senderId, username } = item;
  const isSender = currentUserId !== null && senderId === currentUserId;

  return (
    <>
      {status === 'none' && <InviteActionButton userId={id} />}

      {status === 'pending' && isSender && friendshipId && (
        <RejectActionButton friendshipId={friendshipId} type="pendingSent" />
      )}

      {status === 'pending' && !isSender && friendshipId && (
        <>
          <RejectActionButton friendshipId={friendshipId} type="pendingReceived" />
          <AcceptActionButton friendshipId={friendshipId} />
        </>
      )}

      {status === 'accepted' && (
        <>
          {friends.find((f) => f.id === id)?.isOnline ? (
            <OnlineButtons username={username} userId={id} />
          ) : (
            <OfflineButtons userId={id} />
          )}
        </>
      )}
    </>
  );
}

/**
 * Internal component to handle fixed-tab actions (Friends/Requests).
 */
function TabActions({ item, type }: { item: SocialUserItem; type: UserActionsProps['type'] }) {
  const { id } = item;

  if (type === 'request') {
    return (
      <>
        <RejectActionButton friendshipId={id} type="pendingReceived" />
        <AcceptActionButton friendshipId={id} />
      </>
    );
  }

  if (type === 'pending') {
    return <RejectActionButton friendshipId={id} type="pendingSent" />;
  }

  if (type === 'online' && 'username' in item) {
    return <OnlineButtons username={item.username} userId={id} />;
  }

  if (type === 'offline') {
    return <OfflineButtons userId={id} />;
  }

  return null;
}

/**
 * Main component to render the correct action buttons for a user row.
 */
export function UserActions({ item, type }: UserActionsProps) {
  const currentUserId = useSocialStore((state) => state.currentUserId);
  const friends = useSocialStore((state) => state.friends);

  if (type === 'search' && 'friendshipStatus' in item) {
    return (
      <SearchActions
        item={item as SearchUserResult}
        currentUserId={currentUserId}
        friends={friends}
      />
    );
  }

  return <TabActions item={item} type={type} />;
}
