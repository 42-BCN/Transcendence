'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type {FormEvent, KeyboardEvent} from 'react';
import { useTranslations } from 'next-intl';


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
import { directMessagesSocket } from '@/lib/sockets/direct-messages-socket.client';
import { DirectMessagesSocketManager } from '@/lib/sockets/direct-messages-socket.manager';
import { useSocialStore } from '@/providers/social-provider';

type DirectMessageContextValue = {
  messages: DirectChatHistory;
  value: string;
  setValue: (value: string) => void;
  sendMessage: () => void;
};

const DirectMessageContext = createContext<DirectMessageContextValue | null>(null);

type DirectChatMessage = ChatMessageUnion & {
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
  return message.senderId === currentUserId ? { ...message, type: 'me' } : message;
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

  const { messages, value, setValue, sendMessage } = context;

  return (
    <Stack gap="none" className={chatStyles.wrapper}>
      <ChatHeader room={friendUsername} participants={[]} />
      <ChatMain messages={messages} initialUnreadMessageId={initialUnreadMessageId} />
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
  const setFriendUnreadMessageCount = useSocialStore((state) => state.setFriendUnreadMessageCount);
  const {
    messages,
    value,
    setValue,
    setMessages,
    handleDirectMessage,
    handleDirectHistory,
    handleDirectError,
  } = useDirectMessageState(currentUserId);

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

  const contextValue = useMemo(
    () => ({ messages, value, setValue, sendMessage }),
    [messages, value, setValue, sendMessage],
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
      <DirectMessagesContent
        friendUsername={friendUsername}
        initialUnreadMessageId={initialUnreadMessageId}
      />
    </DirectMessageContext.Provider>
  );
}
