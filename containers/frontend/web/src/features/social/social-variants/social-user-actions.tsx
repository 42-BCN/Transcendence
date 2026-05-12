'use client';

import { useTranslations } from 'next-intl';

import { DynamicInternalLink, Icon, IconButton } from '@components';

import { SocialFriendshipActions } from './social-friendship-actions';
import type { UsersListType } from './users-list';

interface SocialUserActionsProps {
  type: UsersListType;
  userId: string;
}

export function SocialUserActions({ type, userId }: SocialUserActionsProps) {
  const t = useTranslations('features.social.actions');
  const messageHref = `/messages/${userId}` as const;

  return (
    <>
      {(type === 'online' || type === 'offline') && (
        <DynamicInternalLink
          as="icon"
          href={messageHref}
          label={t('message')}
          icon={<Icon name="messages" />}
        />
      )}

      {type === 'online' && (
        <IconButton label={t('inviteToGame')} icon="gamepad" variant="primary" />
      )}

      {(type === 'request' || type === 'pending' || type === 'search') && (
        <SocialFriendshipActions userId={userId} />
      )}
    </>
  );
}
