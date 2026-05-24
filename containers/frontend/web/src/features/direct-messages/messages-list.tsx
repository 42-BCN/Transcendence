'use client';

import { useTranslations } from 'next-intl';
import { CountBadge, Stack, Text, ScrollArea, UserItem } from '@components';
import type { FriendPublic } from '@/contracts/api/friendships/friendships.contracts';
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

export function MessagesList({ friends, selectedUsername }: MessagesListProps) {
  const t = useTranslations('features.directMessages');

  return (
    <Stack gap="none" className={messagesListStyles.wrapper}>
      <Text as="h1" variant="heading-md" className={messagesListStyles.title}>
        {t('listTitle')}
      </Text>
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
                href={`/messages/${friend.username}`}
                className={messagesListStyles.item(selectedUsername === friend.username)}
                username={friend.username}
                avatarUrl={friend.avatar}
                subtitleClassName={presenceSubtitleClassName[friend.presence]}
                subtitle={
                  friend.presence === 'online'
                    ? t('presence.online')
                    : friend.presence === 'away'
                      ? t('presence.away')
                      : t('presence.offline')
                }
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
