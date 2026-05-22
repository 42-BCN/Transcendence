'use client';

import { useTranslations } from 'next-intl';
import { Stack, Text, ScrollArea, UserItem } from '@components';
import type { FriendPublic } from '@/contracts/api/friendships/friendships.contracts';

type MessagesListProps = {
  friends: FriendPublic[];
  selectedUsername?: string;
};

export function MessagesList({ friends, selectedUsername }: MessagesListProps) {
  const t = useTranslations('features.directMessages');

  return (
    <Stack gap="none" className="w-full">
      <Text as="h1" variant="heading-md" className="font-bold p-3">
        {t('listTitle')}
      </Text>
      <ScrollArea className="flex-1">
        <Stack gap="none">
          {friends.length === 0 ? (
            <Text color="secondary" variant="body-sm" className="p-3 text-center">
              {t('emptyState')}
            </Text>
          ) : (
            friends.map((friend) => (
              <UserItem
                key={friend.id}
                href={`/messages/${friend.username}`}
                className={`transition-colors no-underline ${
                  selectedUsername === friend.username ? 'bg-slate-100/5' : 'hover:bg-gray-100/10'
                }`}
                username={friend.username}
                avatarUrl={friend.avatar}
                subtitle={
                  friend.presence === 'online'
                    ? t('presence.online')
                    : friend.presence === 'away'
                      ? t('presence.away')
                      : t('presence.offline')
                }
              />
            ))
          )}
        </Stack>
      </ScrollArea>
    </Stack>
  );
}
