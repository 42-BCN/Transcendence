'use client';

import { useTranslations } from 'next-intl';

import { InternalLink, Icon, IconButton } from '@components';

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
        <InternalLink
          as="icon"
          href={messageHref as any}
          label={t('message')}
          icon={<Icon name="messages" />}
        />
      )}

      {type === 'online' && <IconButton label={t('game')} icon="gamepad" variant="primary" />}

      {(type === 'request' || type === 'pending' || type === 'search') && (
        <SocialFriendshipActions userId={userId} />
      )}
    </>
  );
}
