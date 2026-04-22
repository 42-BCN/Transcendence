import { useTranslations } from 'next-intl';
import { UserItem } from '@/components/composites/user-item/user-item';
import { Stack } from '@/components/primitives/stack';
import { Text } from '@/components/primitives/text';
import type {
  FriendPublic,
  FriendshipPublic,
} from '@/contracts/api/friendships/friendships.contracts';

import { PendingButton } from './pending-buttons';
import { RequestButtons } from './request-buttons';
import { OnlineButtons } from './online-buttons';
import { OfflineButtons } from './offline-buttons';

interface UsersListProps {
  friends: (FriendPublic | FriendshipPublic)[];
  type: 'request' | 'pending' | 'online' | 'offline';
}

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

  return friends.map((item) => {
    // Determine which data to show based on type
    const isFriendship = 'requester' in item;
    const user = isFriendship
      ? type === 'request'
        ? item.requester
        : item.addressee
      : (item as FriendPublic);

    const id = isFriendship ? item.id : user.id;

    return (
      <UserItem username={user.username} avatarUrl={user.avatar ?? undefined} key={id}>
        {type === 'request' && <RequestButtons friendshipId={id} />}
        {type === 'pending' && <PendingButton friendshipId={id} />}
        {type === 'online' && <OnlineButtons username={user.username} friendshipId={id} />}
        {type === 'offline' && <OfflineButtons friendshipId={id} />}
      </UserItem>
    );
  });
}
