'use client';

import { useTranslations } from 'next-intl';

import { CountBadge, DynamicInternalLink, Icon, IconButton } from '@components';
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
  const unreadMessageCount = useSocialStore(
    (state) => state.friends.find((friend) => friend.id === userId)?.unreadMessageCount ?? 0,
  );
  const messageHref = `/messages/${username}` as const;

  return (
    <>
      {(type === 'online' || type === 'offline') && (
        <DynamicInternalLink
          as="icon"
          href={messageHref}
          label={t('message')}
          icon={
            <span className="relative inline-flex">
              <Icon name="messages" />
              <CountBadge count={unreadMessageCount} placement="overlay" className="-end-1.5" />
            </span>
          }
        />
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
