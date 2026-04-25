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
import type { SocialErrorCode } from '../social-dashboard';

interface UsersListProps {
  friends: (FriendPublic | FriendshipPublic)[];
  type: 'request' | 'pending' | 'online' | 'offline';
  error?: SocialErrorCode;
}

export function UsersList({ friends, type, error }: UsersListProps) {
  const t = useTranslations('features.social.emptyStates');
  const tErrors = useTranslations('errors');

  if (error) {
    return (
      <Stack align="center" justify="center" className="py-3 px-3 text-center">
        <Text variant="caption" color="danger">
          {tErrors(error)}
        </Text>
      </Stack>
    );
  }

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
    const { id, username, avatar } = item;
    return (
      <UserItem username={username} avatarUrl={avatar ?? undefined} key={id}>
        {type === 'request' && (
          <>
            <RejectActionButton friendshipId={id} type="pendingReceived" />
            <AcceptActionButton friendshipId={id} />
          </>
        )}
        {type === 'pending' && <RejectActionButton friendshipId={id} type="pendingSent" />}
        {type === 'online' && <OnlineButtons username={username} userId={id} />}
        {type === 'offline' && <OfflineButtons userId={id} />}
      </UserItem>
    );
  });
}
