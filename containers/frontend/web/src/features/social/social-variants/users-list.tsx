import { type UserItemProps, UserItem } from '@components';

import { PendingButton } from './pending-buttons';
import { RequestButtons } from './request-buttons';
import { OnlineButtons } from './online-buttons';
import { OfflineButtons } from './offline-buttons';

export function UsersList({
  friends,
  type,
}: {
  friends: UserItemProps[];
  type: 'request' | 'pending' | 'online' | 'offline';
}) {
  return friends.map(({ username, subtitle, avatarUrl, className }) => (
    <UserItem
      username={username}
      // subtitle={subtitle}
      avatarUrl={avatarUrl}
      className={className}
      key={username}
    >
      {type === 'request' && <RequestButtons username={username} />}
      {type === 'pending' && <PendingButton username={username} />}
      {type === 'online' && <OnlineButtons username={username} />}
      {type === 'offline' && <OfflineButtons username={username} />}
    </UserItem>
  ));
}
