import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

import { Button, MessageBubble, ScrollArea, Stack, Text } from '@components';
import { chatStyles } from './chat.styles';
import type { ChatMessageUnion } from '@/contracts/sockets/chat/chat.schema';
import type {
  DirectMessage,
  DirectMessageError,
} from '@/contracts/sockets/direct-messages/direct-messages.schema';

type ChatMainMessage = (ChatMessageUnion | DirectMessage | DirectMessageError) & {
  readAt?: number | null;
  senderId?: string;
};

function renderInvitationCard(args: {
  message: Extract<ChatMainMessage, { type: 'game_invitation' }>;
  currentUserId?: string | null;
  activeInvitationIds?: string[];
  hasLoadedInvitationSummary?: boolean;
  joiningInvitationId?: string | null;
  joiningError?: string | null;
  hasActiveGameRoom?: boolean;
  onAcceptInvitation?: (invitationId: string) => void;
}) {
  const {
    message,
    currentUserId,
    activeInvitationIds = [],
    hasLoadedInvitationSummary,
    joiningInvitationId,
    joiningError,
    hasActiveGameRoom,
    onAcceptInvitation,
  } = args;
  const isInvitee = currentUserId === message.content.invitedUserId;
  const isExpired = new Date(message.content.expiresAt).getTime() <= Date.now();
  const isAccepted = typeof message.content.acceptedAt === 'string';
  const isActive = activeInvitationIds.includes(message.id);
  const isJoining = joiningInvitationId === message.id;
  const isUnavailable = !!hasLoadedInvitationSummary && !isExpired && !isAccepted && !isActive;

  let label = `${message.content.inviterUsername} invited you to a game`;
  let action: ReactNode = null;

  if (!isInvitee) {
    label = 'Game invitation sent';
  } else if (isAccepted) {
    label = 'Game invitation accepted';
  } else if (isExpired) {
    label = 'Game invitation expired';
  } else if (hasActiveGameRoom) {
    label = 'You have already joined a game room.';
  } else if (isUnavailable) {
    label = 'Game room is no longer available';
  } else if (isInvitee && onAcceptInvitation) {
    const errorForThis = joiningError && joiningInvitationId === message.id ? joiningError : null;
    action = (
      <Stack gap="xs" align="start">
        <Button
          variant="primary"
          w="auto"
          onPress={() => onAcceptInvitation(message.id)}
          isDisabled={isJoining}
        >
          {isJoining ? 'Joining...' : 'Join game'}
        </Button>
        {errorForThis && (
          <Text variant="caption" color="danger">
            {errorForThis}
          </Text>
        )}
      </Stack>
    );
  }

  return (
    <Stack gap="sm" align="start">
      <Text as="p" variant="body-xs" className="whitespace-pre-wrap">
        {label}
      </Text>
      {action}
    </Stack>
  );
}

export function ChatMain({
  messages,
  initialUnreadMessageId,
  currentUserId,
  activeInvitationIds,
  hasLoadedInvitationSummary,
  joiningInvitationId,
  joiningError,
  hasActiveGameRoom,
  onAcceptInvitation,
}: {
  messages: ChatMainMessage[];
  initialUnreadMessageId?: string | null;
  currentUserId?: string | null;
  activeInvitationIds?: string[];
  hasLoadedInvitationSummary?: boolean;
  joiningInvitationId?: string | null;
  joiningError?: string | null;
  hasActiveGameRoom?: boolean;
  onAcceptInvitation?: (invitationId: string) => void;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const didScrollToUnreadRef = useRef(false);

  useEffect(() => {
    if (initialUnreadMessageId && !didScrollToUnreadRef.current) {
      const target = document.getElementById(`message-${initialUnreadMessageId}`);

      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        didScrollToUnreadRef.current = true;
        return;
      }
    }

    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [initialUnreadMessageId, messages]);
  return (
    <ScrollArea>
      <Stack className={chatStyles.main.wrapper}>
        {messages.map((message) => {
          const { id, username, content, type, senderId } = message;
          const variant =
            type === 'game_invitation'
              ? senderId === currentUserId
                ? 'me'
                : 'user'
              : type;

          return (
            <div
              key={id}
              id={`message-${id}`}
              className={type === 'system' || type === 'error' ? chatStyles.main.metaRow : undefined}
            >
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
                    activeInvitationIds,
                    hasLoadedInvitationSummary,
                    joiningInvitationId,
                    joiningError,
                    hasActiveGameRoom,
                    onAcceptInvitation,
                  })
                ) : (
                  <Text
                    as="p"
                    variant={type === 'system' || type === 'error' ? 'caption' : 'body-xs'}
                    className={
                      type === 'system' || type === 'error'
                        ? chatStyles.main.metaText
                        : 'whitespace-pre-wrap'
                    }
                  >
                    {content.text}
                  </Text>
                )}
              </MessageBubble>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </Stack>
    </ScrollArea>
  );
}
