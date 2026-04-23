import { useTranslations } from 'next-intl';
import { UserItem } from '@/components/composites/user-item/user-item';
import { Stack } from '@/components/primitives/stack';
import { Text } from '@/components/primitives/text';
import type {
  FriendPublic,
  FriendshipPublic,
} from '@/contracts/api/friendships/friendships.contracts';

import { OnlineButtons } from './online-buttons';
import { OfflineButtons } from './offline-buttons';
import { AcceptActionButton } from './accept-action-button';
import { RejectActionButton } from './reject-action-button';

interface UsersListProps {
  friends: (FriendPublic | FriendshipPublic)[];
  type: 'request' | 'pending' | 'online' | 'offline';
}

export function UsersList({ friends, type }: UsersListProps) {
  const t = useTranslations('features.social.emptyStates');

  if (friends?.length === 0) {
    return (
      <Stack align="center" justify="center" className="py-3 px-3 text-center">
        <Text variant="caption" color="tertiary">
          {t(type)}
        </Text>
      </Stack>
    );
  }

  return friends?.map((item) => {
    const { id, username, avatar } = item;
    console.log('[UsersList] item:', item);
    return (
      <UserItem username={username} avatarUrl={avatar ?? undefined} key={id}>
        {type === 'request' && (
          <>
            <RejectActionButton friendshipId={id} type="pendingReceived" />
            <AcceptActionButton friendshipId={id} />
          </>
        )}
        {type === 'pending' && <RejectActionButton friendshipId={id} type="pendingSent" />}
        {type === 'online' && <OnlineButtons username={username} friendshipId={id} />}
        {type === 'offline' && <OfflineButtons friendshipId={id} />}
      </UserItem>
    );
  });
}
