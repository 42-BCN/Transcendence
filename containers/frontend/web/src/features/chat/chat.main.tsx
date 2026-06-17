import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

import { Button, MessageBubble, ScrollArea, Stack, Text } from '@components';
import { chatStyles } from './chat.styles';
import type { ChatMessageUnion } from '@/contracts/sockets/chat/chat.schema';
import type { GameInvitationView } from '@/features/game-invitations/store/game-invitations.types';
import type {
  DirectMessage,
  DirectMessageError,
} from '@/contracts/sockets/direct-messages/direct-messages.schema';

type ChatMainMessage = (ChatMessageUnion | DirectMessage | DirectMessageError) & {
  readAt?: number | null;
  senderId?: string;
};

type InvitationCardState = {
  isInvitee: boolean;
  isAccepted: boolean;
  isCancelled: boolean;
  isExpired: boolean;
  isJoining: boolean;
  isDeclining: boolean;
  isUnavailable: boolean;
};

function getInvitationCardState(args: {
  message: Extract<ChatMainMessage, { type: 'game_invitation' }>;
  currentUserId?: string | null;
  invitation?: GameInvitationView;
  hasLoadedInvitations?: boolean;
  joiningInvitationId?: string | null;
  decliningInvitationId?: string | null;
}): InvitationCardState {
  const {
    message,
    currentUserId,
    invitation,
    hasLoadedInvitations,
    joiningInvitationId,
    decliningInvitationId,
  } = args;
  const status = invitation?.status;
  const isExpired = new Date(message.content.expiresAt).getTime() <= Date.now();
  const isAccepted = status === 'accepted' || typeof message.content.acceptedAt === 'string';
  const isCancelled = status === 'cancelled' || typeof message.content.cancelledAt === 'string';

  return {
    isInvitee: currentUserId === message.content.invitedUserId,
    isAccepted,
    isCancelled,
    isExpired,
    isJoining: joiningInvitationId === message.id,
    isDeclining: decliningInvitationId === message.id,
    isUnavailable:
      Boolean(hasLoadedInvitations) &&
      !isExpired &&
      !isAccepted &&
      !isCancelled &&
      status === 'unavailable',
  };
}

function getInvitationLabel(args: {
  state: InvitationCardState;
  inviterUsername: string;
  hasActiveGameRoom?: boolean;
}): string {
  const { state, inviterUsername, hasActiveGameRoom } = args;

  if (state.isAccepted) return 'Game invitation accepted';
  if (state.isCancelled) return 'Game invitation declined';
  if (state.isExpired) return 'Game invitation expired';
  if (!state.isInvitee) return 'Game invitation sent';
  if (hasActiveGameRoom) return 'You have already joined a game room.';
  if (state.isUnavailable) return 'Game room is no longer available';

  return `${inviterUsername} invited you to a game`;
}

function shouldShowAcceptAction(args: {
  state: InvitationCardState;
  hasActiveGameRoom?: boolean;
  onAcceptInvitation?: (invitationId: string) => void;
}): boolean {
  const { state, hasActiveGameRoom, onAcceptInvitation } = args;

  return (
    state.isInvitee &&
    !state.isAccepted &&
    !state.isCancelled &&
    !state.isExpired &&
    !hasActiveGameRoom &&
    !state.isUnavailable &&
    typeof onAcceptInvitation === 'function'
  );
}

function getMessageBubbleVariant(
  message: ChatMainMessage,
  currentUserId?: string | null,
): 'user' | 'me' | 'system' | 'error' | 'game-event' {
  if (message.type === 'game_invitation') {
    return message.senderId === currentUserId ? 'me' : 'user';
  }

  return message.type;
}

function renderInvitationActions(args: {
  invitationId: string;
  isJoining: boolean;
  isDeclining: boolean;
  joiningError?: string | null;
  decliningError?: string | null;
  onAcceptInvitation?: (invitationId: string) => void;
  onDeclineInvitation?: (invitationId: string) => void;
}): ReactNode {
  const {
    invitationId,
    isJoining,
    isDeclining,
    joiningError,
    decliningError,
    onAcceptInvitation,
    onDeclineInvitation,
  } = args;

  return (
    <Stack gap="xs" align="start">
      <Stack direction="horizontal" gap="xs">
        <Button
          variant="secondary"
          w="auto"
          onPress={() => onDeclineInvitation?.(invitationId)}
          isDisabled={isJoining || isDeclining}
        >
          {isDeclining ? 'Declining...' : 'Decline'}
        </Button>
        <Button
          variant="primary"
          w="auto"
          onPress={() => onAcceptInvitation?.(invitationId)}
          isDisabled={isJoining || isDeclining}
        >
          {isJoining ? 'Joining...' : 'Join game'}
        </Button>
      </Stack>
      {joiningError && (
        <Text variant="caption" color="danger">
          {joiningError}
        </Text>
      )}
      {decliningError && (
        <Text variant="caption" color="danger">
          {decliningError}
        </Text>
      )}
    </Stack>
  );
}

function renderInvitationCard(args: {
  message: Extract<ChatMainMessage, { type: 'game_invitation' }>;
  currentUserId?: string | null;
  invitation?: GameInvitationView;
  hasLoadedInvitations?: boolean;
  joiningInvitationId?: string | null;
  joiningErrorInvitationId?: string | null;
  joiningError?: string | null;
  decliningInvitationId?: string | null;
  decliningErrorInvitationId?: string | null;
  decliningError?: string | null;
  hasActiveGameRoom?: boolean;
  onAcceptInvitation?: (invitationId: string) => void;
  onDeclineInvitation?: (invitationId: string) => void;
}) {
  const {
    message,
    currentUserId: _currentUserId,
    invitation: _invitation,
    hasLoadedInvitations: _hasLoadedInvitations,
    joiningInvitationId,
    joiningErrorInvitationId,
    joiningError,
    decliningInvitationId: _decliningInvitationId,
    decliningErrorInvitationId,
    decliningError,
    hasActiveGameRoom,
    onAcceptInvitation,
    onDeclineInvitation,
  } = args;
  const state = getInvitationCardState(args);
  const label = getInvitationLabel({
    state,
    inviterUsername: message.content.inviterUsername,
    hasActiveGameRoom,
  });
  const action = shouldShowAcceptAction({ state, hasActiveGameRoom, onAcceptInvitation })
    ? renderInvitationActions({
        invitationId: message.id,
        isJoining: state.isJoining,
        isDeclining: state.isDeclining,
        joiningError:
          joiningError && joiningErrorInvitationId === message.id ? joiningError : null,
        decliningError:
          decliningError && decliningErrorInvitationId === message.id ? decliningError : null,
        onAcceptInvitation,
        onDeclineInvitation,
      })
    : null;

  return (
    <Stack gap="sm" align="start">
      <Text as="p" variant="body-xs" className="whitespace-pre-wrap">
        {label}
      </Text>
      {action}
    </Stack>
  );
}

function getMetaMessageText(
  message: Extract<ChatMainMessage, { type: 'system' | 'error' }>,
  t: ReturnType<typeof useTranslations<'features.chat'>>,
): string {
  if (message.type === 'system') {
    if (message.content.text === 'USER_JOINED') {
      return t('system.userJoined', { username: message.username ?? '' });
    }

    return t('system.userLeft', { username: message.username ?? '' });
  }

  if (message.content.text === 'INVALID_CHAT_MESSAGE') {
    return t('errors.INVALID_CHAT_MESSAGE');
  }

  return message.content.text;
}

export function ChatMain({
  messages,
  initialUnreadMessageId,
  currentUserId,
  invitationsByMessageId,
  hasLoadedInvitations,
  joiningInvitationId,
  joiningErrorInvitationId,
  joiningError,
  decliningInvitationId,
  decliningErrorInvitationId,
  decliningError,
  hasActiveGameRoom,
  onAcceptInvitation,
  onDeclineInvitation,
}: {
  messages: ChatMainMessage[];
  initialUnreadMessageId?: string | null;
  currentUserId?: string | null;
  invitationsByMessageId?: Record<string, GameInvitationView>;
  hasLoadedInvitations?: boolean;
  joiningInvitationId?: string | null;
  joiningErrorInvitationId?: string | null;
  joiningError?: string | null;
  decliningInvitationId?: string | null;
  decliningErrorInvitationId?: string | null;
  decliningError?: string | null;
  hasActiveGameRoom?: boolean;
  onAcceptInvitation?: (invitationId: string) => void;
  onDeclineInvitation?: (invitationId: string) => void;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const didScrollToUnreadRef = useRef(false);
  const t = useTranslations('features.chat');

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    if (initialUnreadMessageId && !didScrollToUnreadRef.current) {
      const target = document.getElementById(`message-${initialUnreadMessageId}`);

      if (target) {
        const top =
          target.getBoundingClientRect().top -
          container.getBoundingClientRect().top +
          container.scrollTop;
        container.scrollTo({ top, behavior: 'smooth' });
        didScrollToUnreadRef.current = true;
        return;
      }
    }

    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, [initialUnreadMessageId, messages]);
  return (
    <ScrollArea ref={scrollContainerRef}>
      <Stack className={chatStyles.main.wrapper}>
        {messages.map((message) => {
          const { id, username, content, type } = message;
          const variant = getMessageBubbleVariant(message, currentUserId);
          const messageClassName =
            type === 'system' || type === 'error' ? chatStyles.main.metaRow : undefined;
          const textVariant = type === 'system' || type === 'error' ? 'caption' : 'body-xs';
          const textClassName =
            type === 'system' || type === 'error'
              ? chatStyles.main.metaText
              : 'whitespace-pre-wrap';

          return (
            <div key={id} id={`message-${id}`} className={messageClassName}>
              <MessageBubble variant={variant}>
                {type === 'user' && (
                  <Text as="h3" variant="caption">
                    {username}
                  </Text>
                )}
                {type === 'game_invitation' ? (
                  renderInvitationCard({
                    message,
                    currentUserId,
                    invitation: invitationsByMessageId?.[message.id],
                    hasLoadedInvitations,
                    joiningInvitationId,
                    joiningErrorInvitationId,
                    joiningError,
                    decliningInvitationId,
                    decliningErrorInvitationId,
                    decliningError,
                    hasActiveGameRoom,
                    onAcceptInvitation,
                    onDeclineInvitation,
                  })
                ) : (
                  <Text
                    as="p"
                    variant={textVariant}
                    className={textClassName}
                  >
                    {type === 'system' || type === 'error'
                      ? getMetaMessageText(message, t)
                      : content.text}
                  </Text>
                )}
              </MessageBubble>
            </div>
          );
        })}
      </Stack>
    </ScrollArea>
  );
}
