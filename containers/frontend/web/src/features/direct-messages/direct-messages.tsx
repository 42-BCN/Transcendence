'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';

import { Form, Stack, TextAreaField } from '@components';

import type {
  DirectMessage,
  DirectMessageError,
  DirectMessageHistory,
  DirectMessageRead,
  DirectMessageSend,
} from '@/contracts/sockets/direct-messages/direct-messages.schema';
import { directMessageSocketEvents } from '@/contracts/sockets/direct-messages/direct-messages.schema';
import type { ChatMessageUnion } from '@/contracts/sockets/chat/chat.schema';
import { ChatHeader } from '@/features/chat/chat.header';
import { ChatMain } from '@/features/chat/chat.main';
import { chatStyles } from '@/features/chat/chat.styles';
import {
  acceptGameInvitation,
  declineGameInvitation,
  fetchGameInvitationState,
} from '@/features/game-invitations/game-invitations.client';
import type { GameInvitationView } from '@/features/game-invitations/store/game-invitations.types';
import {
  GameInvitationsStoreContext,
  useGameInvitationsStore,
} from '@/features/game-invitations/store/game-invitations.provider';
import { RoomsStoreContext } from '@/features/rooms/rooms-provider';
import { directMessagesSocket } from '@/lib/sockets/direct-messages-socket.client';
import { DirectMessagesSocketManager } from '@/lib/sockets/direct-messages-socket.manager';
import { useSocialStore } from '@/providers/social-provider';

type DirectMessageContextValue = {
  messages: DirectChatHistory;
  value: string;
  setValue: (value: string) => void;
  sendMessage: () => void;
  currentUserId: string;
  invitationsByMessageId: Record<string, GameInvitationView>;
  hasLoadedInvitations: boolean;
  joiningInvitationId: string | null;
  joiningErrorInvitationId: string | null;
  joiningError: string | null;
  decliningInvitationId: string | null;
  decliningErrorInvitationId: string | null;
  decliningError: string | null;
  hasActiveGameRoom: boolean;
  acceptInvitation: (invitationId: string) => void;
  declineInvitation: (invitationId: string) => void;
};

const DirectMessageContext = createContext<DirectMessageContextValue | null>(null);

type DirectChatMessage = (ChatMessageUnion | DirectMessage | DirectMessageError) & {
  clientMessageId?: string;
  senderId?: string;
  readAt?: number | null;
};

type DirectChatHistory = DirectChatMessage[];

type DirectMessagesFeatureProps = {
  friendUserId: string;
  friendUsername: string;
  currentUserId: string;
  currentUsername: string;
};

function toChatMessage(message: DirectMessage, currentUserId: string): DirectChatMessage {
  if (message.type === 'user' && message.senderId === currentUserId) {
    return { ...message, type: 'me' };
  }

  return message;
}

function toChatHistory(history: DirectMessageHistory, currentUserId: string): DirectChatHistory {
  return history.map((message: DirectMessage) => toChatMessage(message, currentUserId));
}

function optimisticDirectMessage(args: {
  text: string;
  clientMessageId: string;
  currentUserId: string;
  currentUsername: string;
}): DirectChatMessage {
  return {
    id: `pending:${args.clientMessageId}`,
    createdAt: Date.now(),
    senderId: args.currentUserId,
    username: args.currentUsername,
    type: 'me',
    clientMessageId: args.clientMessageId,
    readAt: null,
    content: {
      text: args.text,
    },
  };
}

function mergeMessages(
  previous: DirectChatHistory,
  incoming: DirectChatHistory,
): DirectChatHistory {
  const next = [...previous];
  const indexById = new Map(next.map((message, index) => [message.id, index]));
  const pendingIndexByClientId = new Map(
    next.flatMap((message, index) =>
      typeof message.clientMessageId === 'string'
        ? [[message.clientMessageId, index] as const]
        : [],
    ),
  );

  for (const message of incoming) {
    const pendingIndex =
      typeof message.clientMessageId === 'string'
        ? pendingIndexByClientId.get(message.clientMessageId)
        : undefined;

    if (pendingIndex !== undefined) {
      next[pendingIndex] = message;
      indexById.set(message.id, pendingIndex);
      continue;
    }

    const existingIndex = indexById.get(message.id);

    if (existingIndex !== undefined) {
      next[existingIndex] = message;
      continue;
    }

    next.push(message);
    indexById.set(message.id, next.length - 1);
  }

  return [...next].sort((left, right) => left.createdAt - right.createdAt);
}

function useDirectMessageState(currentUserId: string) {
  const [messages, setMessages] = useState<DirectChatHistory>([]);
  const [value, setValue] = useState('');

  const handleDirectMessage = useCallback(
    (message: DirectMessage) =>
      setMessages((previous) => mergeMessages(previous, [toChatMessage(message, currentUserId)])),
    [currentUserId],
  );

  const handleDirectHistory = useCallback(
    (history: DirectMessageHistory) =>
      setMessages((previous) => mergeMessages(previous, toChatHistory(history, currentUserId))),
    [currentUserId],
  );

  const handleDirectError = useCallback((error: DirectMessageError) => {
    setMessages((previous) => [
      ...previous,
      {
        id: error.id,
        createdAt: error.createdAt,
        senderId: error.senderId,
        username: error.username,
        readAt: error.readAt,
        clientMessageId: error.clientMessageId,
        type: 'error',
        content: error.content,
      },
    ]);
  }, []);

  return {
    messages,
    value,
    setValue,
    setMessages,
    handleDirectMessage,
    handleDirectHistory,
    handleDirectError,
  };
}

function DirectMessagesContent({
  friendUsername,
  initialUnreadMessageId,
}: {
  friendUsername: string;
  initialUnreadMessageId: string | null;
}) {
  const t = useTranslations('features.chat');
  const context = useContext(DirectMessageContext);

  if (!context) {
    throw new Error('DirectMessagesContent must be used within a DirectMessagesFeature');
  }

  const {
    messages,
    value,
    setValue,
    sendMessage,
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
    acceptInvitation,
    declineInvitation,
  } = context;

  return (
    <Stack gap="none" className={chatStyles.wrapper}>
      <ChatHeader room={friendUsername} participants={[]} />
      <ChatMain
        messages={messages}
        initialUnreadMessageId={initialUnreadMessageId}
        currentUserId={currentUserId}
        invitationsByMessageId={invitationsByMessageId}
        hasLoadedInvitations={hasLoadedInvitations}
        joiningInvitationId={joiningInvitationId}
        joiningErrorInvitationId={joiningErrorInvitationId}
        joiningError={joiningError}
        decliningInvitationId={decliningInvitationId}
        decliningErrorInvitationId={decliningErrorInvitationId}
        decliningError={decliningError}
        hasActiveGameRoom={hasActiveGameRoom}
        onAcceptInvitation={acceptInvitation}
        onDeclineInvitation={declineInvitation}
      />
      <Form
        onSubmit={(event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          sendMessage();
        }}
        className={chatStyles.footer.wrapper}
      >
        <TextAreaField
          value={value}
          onChange={setValue}
          className={chatStyles.footer.input}
          aria-label={t('messageAriaLabel')}
          maxLength={300}
          onKeyDown={(event: KeyboardEvent<HTMLTextAreaElement>) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              sendMessage();
            }
          }}
        />
      </Form>
    </Stack>
  );
}

export function DirectMessagesFeature({
  friendUserId,
  friendUsername,
  currentUserId,
  currentUsername,
}: DirectMessagesFeatureProps) {
  const router = useRouter();
  const roomsStore = useContext(RoomsStoreContext);
  const gameInvitationsStore = useContext(GameInvitationsStoreContext);
  const setFriendUnreadMessageCount = useSocialStore((state) => state.setFriendUnreadMessageCount);
  const invitationsById = useGameInvitationsStore((state) => state.invitationsById);
  const hasLoadedInvitations = useGameInvitationsStore((state) => state.hasLoaded);
  const invitations = useMemo(
    () =>
      Object.values(invitationsById).filter(
        (invitation) => invitation.friendUserId === friendUserId,
      ),
    [friendUserId, invitationsById],
  );
  const {
    messages,
    value,
    setValue,
    setMessages,
    handleDirectMessage,
    handleDirectHistory,
    handleDirectError,
  } = useDirectMessageState(currentUserId);
  const [joiningInvitationId, setJoiningInvitationId] = useState<string | null>(null);
  const [joiningErrorInvitationId, setJoiningErrorInvitationId] = useState<string | null>(null);
  const [joiningError, setJoiningError] = useState<string | null>(null);
  const [decliningInvitationId, setDecliningInvitationId] = useState<string | null>(null);
  const [decliningErrorInvitationId, setDecliningErrorInvitationId] = useState<string | null>(null);
  const [decliningError, setDecliningError] = useState<string | null>(null);
  const invitationsByMessageId = useMemo(
    () =>
      Object.fromEntries(invitations.map((invitation) => [invitation.sourceMessageId, invitation])),
    [invitations],
  );

  const initialUnreadMessageId = useMemo(
    () =>
      messages.find((message) => message.senderId !== currentUserId && message.readAt === null)
        ?.id ?? null,
    [currentUserId, messages],
  );

  const handleDirectRead = useCallback(
    (payload: DirectMessageRead) => {
      setFriendUnreadMessageCount(friendUserId, payload.unreadCount);
    },
    [friendUserId, setFriendUnreadMessageCount],
  );

  const requestRead = useCallback(() => {
    directMessagesSocket.emit(directMessageSocketEvents.read);
  }, []);

  const handleHistory = useCallback(
    (history: DirectMessageHistory) => {
      handleDirectHistory(history);

      if (
        history.some((message) => message.senderId !== currentUserId && message.readAt === null)
      ) {
        requestRead();
      }
    },
    [currentUserId, handleDirectHistory, requestRead],
  );

  const handleMessage = useCallback(
    (message: DirectMessage) => {
      handleDirectMessage(message);

      if (message.senderId !== currentUserId && message.readAt === null) {
        requestRead();
      }
    },
    [currentUserId, handleDirectMessage, requestRead],
  );

  const sendMessage = useCallback(() => {
    const text = value.trim();
    if (!text) return;

    const clientMessageId = crypto.randomUUID();
    const payload: DirectMessageSend = { text, clientMessageId };

    setMessages((previous) =>
      mergeMessages(previous, [
        optimisticDirectMessage({
          text,
          clientMessageId,
          currentUserId,
          currentUsername,
        }),
      ]),
    );
    directMessagesSocket.emit(directMessageSocketEvents.send, payload);
    setValue('');
  }, [currentUserId, currentUsername, setMessages, setValue, value]);

  const handleAcceptInvitation = useCallback(
    (invitationId: string) => {
      if (joiningInvitationId || decliningInvitationId) {
        return;
      }

      setJoiningInvitationId(invitationId);
      setJoiningErrorInvitationId(null);
      setJoiningError(null);

      void acceptGameInvitation(invitationId)
        .then((response) => {
          if (!response.ok) {
            setJoiningErrorInvitationId(invitationId);
            const code = response.error.code;
            if (code === 'GAME_INVITATION_ALREADY_ACCEPTED') {
              setJoiningError('This invitation was already accepted.');
            } else if (code === 'GAME_INVITATION_EXPIRED') {
              setJoiningError('This invitation has expired.');
            } else if (code === 'GAME_INVITATION_NOT_JOINABLE' || code === 'GAME_INVITATION_ROOM_UNAVAILABLE') {
              setJoiningError('The game room is no longer available.');
            } else {
              setJoiningError('Could not join the game room.');
            }
            return;
          }

          setJoiningErrorInvitationId(null);
          roomsStore?.setRoomState(response.data.room);
          void fetchGameInvitationState().then((stateResponse) => {
            if (stateResponse.ok) {
              gameInvitationsStore?.getState().setInvitationState(stateResponse.data);
            }
          });
          router.push('/game');
        })
        .finally(() => {
          setJoiningInvitationId(null);
        });
    },
    [decliningInvitationId, gameInvitationsStore, joiningInvitationId, roomsStore, router],
  );

  const handleDeclineInvitation = useCallback(
    (invitationId: string) => {
      if (joiningInvitationId || decliningInvitationId) {
        return;
      }

      setDecliningInvitationId(invitationId);
      setDecliningErrorInvitationId(null);
      setDecliningError(null);

      void declineGameInvitation(invitationId)
        .then((response) => {
          if (!response.ok) {
            setDecliningErrorInvitationId(invitationId);
            const code = response.error.code;
            if (code === 'GAME_INVITATION_ALREADY_CANCELLED') {
              setDecliningError('This invitation was already declined.');
            } else if (code === 'GAME_INVITATION_ALREADY_ACCEPTED') {
              setDecliningError('This invitation was already accepted.');
            } else if (code === 'GAME_INVITATION_EXPIRED') {
              setDecliningError('This invitation has expired.');
            } else {
              setDecliningError('Could not decline the game invitation.');
            }
            return;
          }

          setDecliningErrorInvitationId(null);
          void fetchGameInvitationState().then((stateResponse) => {
            if (stateResponse.ok) {
              gameInvitationsStore?.getState().setInvitationState(stateResponse.data);
            }
          });
        })
        .finally(() => {
          setDecliningInvitationId(null);
        });
    },
    [decliningInvitationId, gameInvitationsStore, joiningInvitationId],
  );

  const contextValue = useMemo(
    () => ({
      messages,
      value,
      setValue,
      sendMessage,
      currentUserId,
      invitationsByMessageId,
      hasLoadedInvitations,
      joiningInvitationId,
      joiningErrorInvitationId,
      joiningError,
      decliningInvitationId,
      decliningErrorInvitationId,
      decliningError,
      hasActiveGameRoom: (roomsStore?.roomState.id ?? 0) > 0,
      acceptInvitation: handleAcceptInvitation,
      declineInvitation: handleDeclineInvitation,
    }),
    [
      currentUserId,
      decliningError,
      decliningInvitationId,
      handleDeclineInvitation,
      handleAcceptInvitation,
      hasLoadedInvitations,
      invitationsByMessageId,
      joiningInvitationId,
      joiningErrorInvitationId,
      joiningError,
      messages,
      decliningErrorInvitationId,
      roomsStore?.roomState.id,
      sendMessage,
      setValue,
      value,
    ],
  );

  return (
    <DirectMessageContext.Provider value={contextValue}>
      <DirectMessagesSocketManager
        friendUserId={friendUserId}
        onDirectMessage={handleMessage}
        onDirectHistory={handleHistory}
        onDirectRead={handleDirectRead}
        onDirectError={handleDirectError}
      />
      <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden">
        <DirectMessagesContent
          friendUsername={friendUsername}
          initialUnreadMessageId={initialUnreadMessageId}
        />
      </div>
    </DirectMessageContext.Provider>
  );
}
