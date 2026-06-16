'use client';

import { useTranslations } from 'next-intl';
import { CountBadge, Stack, Text, ScrollArea, UserItem } from '@components';
import type { FriendPublic } from '@/contracts/api/friendships/friendships.contracts';
import { useGameInvitationsStore } from '@/features/game-invitations/store/game-invitations.provider';
import { selectActiveInvitationCount } from '@/features/game-invitations/store/game-invitations.selectors';
import { messagesListStyles } from './messages-list.styles';

type MessagesListProps = {
  friends: FriendPublic[];
  selectedUsername?: string;
};

const presenceSubtitleClassName = {
  away: 'text-orange-500',
  online: 'text-green-700',
  offline: 'text-gray-500',
} as const;

function getPresenceLabel(
  presence: FriendPublic['presence'],
  t: ReturnType<typeof useTranslations<'features.directMessages'>>,
) {
  if (presence === 'online') return t('presence.online');
  if (presence === 'away') return t('presence.away');
  return t('presence.offline');
}

export function MessagesList({ friends, selectedUsername }: MessagesListProps) {
  const t = useTranslations('features.directMessages');
  const activeGameInvitationCount = useGameInvitationsStore(selectActiveInvitationCount);

  return (
    <Stack gap="none" className={messagesListStyles.wrapper}>
      <div className="flex items-center gap-2 px-3 pt-3">
        <Text as="h1" variant="heading-md" className={messagesListStyles.title}>
          {t('listTitle')}
        </Text>
        <CountBadge count={activeGameInvitationCount} />
      </div>
      <ScrollArea className={messagesListStyles.scroll}>
        <Stack gap="none">
          {friends.length === 0 ? (
            <Text color="secondary" variant="body-sm" className={messagesListStyles.emptyState}>
              {t('emptyState')}
            </Text>
          ) : (
            friends.map((friend) => (
              <UserItem
                key={friend.id}
                href={{ pathname: '/messages/[userId]', params: { userId: friend.username } }}
                className={messagesListStyles.item(selectedUsername === friend.username)}
                username={friend.username}
                avatarUrl={friend.avatar}
                subtitleClassName={presenceSubtitleClassName[friend.presence]}
                subtitle={getPresenceLabel(friend.presence, t)}
              >
                <CountBadge count={friend.unreadMessageCount} />
              </UserItem>
            ))
          )}
        </Stack>
      </ScrollArea>
    </Stack>
  );
}
