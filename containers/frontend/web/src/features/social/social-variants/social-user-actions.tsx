'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';

import { Button, CountBadge, Icon, IconButton, TooltipTrigger } from '@components';
import { useSocialStore } from '@/providers/social-provider';

import { SocialFriendshipActions } from './social-friendship-actions';
import type { UsersListType } from './users-list';

interface SocialUserActionsProps {
  type: UsersListType;
  userId: string;
  username: string;
}

export function SocialUserActions({ type, userId, username }: SocialUserActionsProps) {
  const t = useTranslations('features.social.actions');
  const router = useRouter();
  const unreadMessageCount = useSocialStore(
    (state) => state.friends.find((friend) => friend.id === userId)?.unreadMessageCount ?? 0,
  );
  const messageHref = `/messages/${username}` as const;

  return (
    <>
      {(type === 'online' || type === 'offline') && (
        <TooltipTrigger label={t('message')} placement="top">
          <Button
            variant="secondary"
            size="icon"
            w="auto"
            aria-label={t('message')}
            onPress={() => router.push(messageHref)}
            icon={
              <span className="relative flex h-5 w-5 items-center justify-center">
                <Icon name="messages" />
                <CountBadge count={unreadMessageCount} placement="overlay" />
              </span>
            }
          />
        </TooltipTrigger>
      )}

      {type === 'online' && (
        <IconButton label={t('inviteToGame')} icon="gamepad" variant="primary" />
      )}

      {(type === 'request' || type === 'pending' || type === 'search') && (
        <SocialFriendshipActions userId={userId} username={username} />
      )}
    </>
  );
}
