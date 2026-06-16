'use client';

import { useContext, useEffect, useRef, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';

import { Button, CountBadge, Icon, IconButton, TooltipTrigger } from '@components';
import { useSocialStore } from '@/providers/social-provider';
import { RoomsStoreContext } from '@/features/rooms/rooms-provider';
import {
  fetchGameInvitationState,
  sendGameInvitation,
} from '@/features/game-invitations/game-invitations.client';
import { gameRoomSocket, ensureChatSessionIdentity } from '@/lib/sockets/socket';
import { GameInvitationsStoreContext } from '@/features/game-invitations/store/game-invitations.provider';

import { SocialFriendshipActions } from './social-friendship-actions';
import type { UsersListType } from './users-list';

interface SocialUserActionsProps {
  type: UsersListType;
  userId: string;
  username: string;
}

const GAME_INVITATION_ERROR_KEYS = new Set([
  'GAME_INVITATION_ROOM_REQUIRED',
  'GAME_INVITATION_ROOM_UNAVAILABLE',
  'GAME_INVITATION_DUPLICATE_PENDING',
  'GAME_INVITATION_RECENT_DUPLICATE',
  'GAME_INVITATION_PENDING_LIMIT',
  'GAME_INVITATION_RATE_LIMITED',
  'GAME_INVITATION_NOT_FRIEND',
  'GAME_INVITATION_ALREADY_IN_ROOM',
]);

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

function resolveInviteErrorKey(code: string): string {
  return GAME_INVITATION_ERROR_KEYS.has(code) ? code : 'default';
}

function MessageActionButton(args: {
  onNavigate: () => void;
  unreadMessageCount: number;
  label: string;
}) {
  return (
    <TooltipTrigger label={args.label} placement="top">
      <Button
        variant="secondary"
        size="icon"
        w="auto"
        aria-label={args.label}
        onPress={args.onNavigate}
        icon={
          <span className="relative flex h-5 w-5 items-center justify-center">
            <Icon name="messages" />
            <CountBadge count={args.unreadMessageCount} placement="overlay" />
          </span>
        }
      />
    </TooltipTrigger>
  );
}

function InviteToGameAction(args: {
  inviteLabel: string;
  inviteSentLabel: string;
  inviteError: string | null;
  inviteStatus: 'idle' | 'sent' | 'error';
  isSendingInvite: boolean;
  onInvite: () => void;
  onOpenMessage: () => void;
}) {
  return (
    <div className="relative shrink-0">
      <TooltipTrigger label={args.inviteLabel} placement="top">
        <IconButton
          label={args.inviteLabel}
          icon="gamepad"
          variant="primary"
          onPress={args.onInvite}
          isDisabled={args.isSendingInvite || args.inviteStatus === 'sent'}
        />
      </TooltipTrigger>
      {args.inviteStatus === 'sent' && (
        <button
          type="button"
          onClick={args.onOpenMessage}
          className="absolute right-0 top-full mt-1 z-10 whitespace-nowrap rounded-full border border-status-success/30 bg-status-success/10 px-3 py-1 text-[11px] font-medium leading-4 text-status-success transition hover:border-status-success/50 hover:bg-status-success/15"
        >
          {args.inviteSentLabel}
        </button>
      )}
      {args.inviteStatus === 'error' && args.inviteError && (
        <span className="absolute right-0 top-full mt-1 z-10 whitespace-nowrap rounded-full border border-red-400/30 bg-red-50/90 px-3 py-1 text-[11px] font-medium leading-4 text-red-700">
          {args.inviteError}
        </span>
      )}
    </div>
  );
}

export function SocialUserActions({ type, userId, username }: SocialUserActionsProps) {
  const t = useTranslations('features.social.actions');
  const router = useRouter();
  const roomsStore = useContext(RoomsStoreContext);
  const gameInvitationsStore = useContext(GameInvitationsStoreContext);
  const unreadMessageCount = useSocialStore(
    (state) => state.friends.find((friend) => friend.id === userId)?.unreadMessageCount ?? 0,
  );
  const [isSendingInvite, startSendingInvite] = useTransition();
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'sent' | 'error'>('idle');
  const [inviteError, setInviteError] = useState<string | null>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageHref = { pathname: '/messages/[userId]' as const, params: { userId: username } };
  const showMessageAction = type === 'online' || type === 'offline';
  const showInviteAction = type === 'online';
  const showFriendshipActions = type === 'request' || type === 'pending' || type === 'search';

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

  const refreshInvitationState = () => {
    void fetchGameInvitationState().then((response) => {
      if (response.ok) {
        gameInvitationsStore?.getState().setInvitationState(response.data);
      }
    });
  };

  const handleInvite = () => {
    startSendingInvite(() => {
      void ensureGameRoomSocketConnected()
        .then(() => sendGameInvitation(userId))
        .then((response) => {
          if (!response.ok) {
            showError(t(`inviteErrors.${resolveInviteErrorKey(response.error.code)}`));
            return;
          }

          setInviteStatus('sent');
          setInviteError(null);
          roomsStore?.setRoomState(response.data.room);
          refreshInvitationState();
        })
        .catch(() => {
          showError(t('inviteErrors.default'));
        });
    });
  };

  return (
    <>
      {showMessageAction && (
        <MessageActionButton
          onNavigate={() => router.push(messageHref)}
          unreadMessageCount={unreadMessageCount}
          label={t('message')}
        />
      )}

      {showInviteAction && (
        <InviteToGameAction
          inviteLabel={t('inviteToGame')}
          inviteSentLabel={t('inviteSent', { username })}
          inviteError={inviteError}
          inviteStatus={inviteStatus}
          isSendingInvite={isSendingInvite}
          onInvite={handleInvite}
          onOpenMessage={() => {
            setInviteStatus('idle');
            router.push(messageHref);
          }}
        />
      )}

      {showFriendshipActions && <SocialFriendshipActions userId={userId} username={username} />}
    </>
  );
}
