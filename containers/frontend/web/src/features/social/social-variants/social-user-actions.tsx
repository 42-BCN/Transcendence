'use client';

import { useContext, useEffect, useRef, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';

import { Button, CountBadge, Icon, IconButton, TooltipTrigger } from '@components';
import { useSocialStore } from '@/providers/social-provider';
import { RoomsStoreContext } from '@/features/rooms/rooms-provider';
import { sendGameInvitation } from '@/features/game-invitations/game-invitations.client';
import { gameRoomSocket, ensureChatSessionIdentity } from '@/lib/sockets/socket';

import { SocialFriendshipActions } from './social-friendship-actions';
import type { UsersListType } from './users-list';

interface SocialUserActionsProps {
  type: UsersListType;
  userId: string;
  username: string;
}

async function ensureGameRoomSocketConnected(): Promise<void> {
  if (gameRoomSocket.connected) return;

  await ensureChatSessionIdentity();

  await new Promise<void>((resolve) => {
    const timeout = setTimeout(resolve, 3000);

    if (gameRoomSocket.connected) {
      clearTimeout(timeout);
      resolve();
      return;
    }

    const handleConnect = () => {
      clearTimeout(timeout);
      gameRoomSocket.off('connect', handleConnect);
      resolve();
    };

    gameRoomSocket.on('connect', handleConnect);
    gameRoomSocket.connect();
  });
}

export function SocialUserActions({ type, userId, username }: SocialUserActionsProps) {
  const t = useTranslations('features.social.actions');
  const router = useRouter();
  const roomsStore = useContext(RoomsStoreContext);
  const unreadMessageCount = useSocialStore(
    (state) => state.friends.find((friend) => friend.id === userId)?.unreadMessageCount ?? 0,
  );
  const addSentGameInvitation = useSocialStore((state) => state.addSentGameInvitation);
  const setActiveGameInvitationSummary = useSocialStore((state) => state.setActiveGameInvitationSummary);
  const [isSendingInvite, startSendingInvite] = useTransition();
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  const [inviteError, setInviteError] = useState<string | null>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageHref = { pathname: '/messages/[userId]' as const, params: { userId: username } };

  useEffect(() => {
    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, []);

  const showError = (message: string) => {
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    setInviteError(message);
    setInviteStatus('error');
    errorTimerRef.current = setTimeout(() => {
      setInviteStatus('idle');
      setInviteError(null);
    }, 2000);
  };

  const resolveErrorKey = (code: string): string => {
    const known = [
      'GAME_INVITATION_ROOM_REQUIRED',
      'GAME_INVITATION_ROOM_UNAVAILABLE',
      'GAME_INVITATION_DUPLICATE_PENDING',
      'GAME_INVITATION_RECENT_DUPLICATE',
      'GAME_INVITATION_PENDING_LIMIT',
      'GAME_INVITATION_RATE_LIMITED',
      'GAME_INVITATION_NOT_FRIEND',
      'GAME_INVITATION_ALREADY_IN_ROOM',
    ];
    return known.includes(code) ? code : 'default';
  };

  const handleInvite = () => {
    startSendingInvite(() => {
      void ensureGameRoomSocketConnected()
        .then(() => sendGameInvitation(userId))
        .then((response) => {
          if (!response.ok) {
            showError(t(`inviteErrors.${resolveErrorKey(response.error.code)}`));
            return;
          }

          setInviteStatus('sent');
          setInviteError(null);
          roomsStore?.setRoomState(response.data.room);
          setActiveGameInvitationSummary(response.data.summary);
          addSentGameInvitation(userId, response.data.message.content.invitationId, username);
        })
        .catch(() => {
          showError(t('inviteErrors.default'));
        });
    });
  };

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
        <div className="relative shrink-0">
          <TooltipTrigger label={t('inviteToGame')} placement="top">
            <IconButton
              label={t('inviteToGame')}
              icon="gamepad"
              variant="primary"
              onPress={handleInvite}
              isDisabled={isSendingInvite || inviteStatus === 'sent'}
            />
          </TooltipTrigger>
          {inviteStatus === 'sent' && (
            <button
              type="button"
              onClick={() => {
                setInviteStatus('idle');
                router.push(messageHref);
              }}
              className="absolute right-0 top-full mt-1 z-10 whitespace-nowrap rounded-full border border-status-success/30 bg-status-success/10 px-3 py-1 text-[11px] font-medium leading-4 text-status-success transition hover:border-status-success/50 hover:bg-status-success/15"
            >
              {t('inviteSent', { username })}
            </button>
          )}
          {inviteStatus === 'error' && inviteError && (
            <span className="absolute right-0 top-full mt-1 z-10 whitespace-nowrap rounded-full border border-red-400/30 bg-red-50/90 px-3 py-1 text-[11px] font-medium leading-4 text-red-700">
              {inviteError}
            </span>
          )}
        </div>
      )}

      {(type === 'request' || type === 'pending' || type === 'search') && (
        <SocialFriendshipActions userId={userId} username={username} />
      )}
    </>
  );
}
