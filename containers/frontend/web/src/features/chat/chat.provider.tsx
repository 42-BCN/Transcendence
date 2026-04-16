'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
} from 'react';

import type {
  ChatGameEvent,
  ChatHistoryType,
  ChatIdentity,
  ChatMe,
  ChatMessage,
  ChatMessageUnion,
} from '@/contracts/sockets/chat/chat.schema';
import { chatSocket } from '@/lib/sockets/socket';
import { ChatSocketManager } from '@/lib/sockets/socket-manager';

type ChatContextValue = {
  messages: ChatHistoryType;
  value: string;
  setValue: (value: string) => void;
  sendMessage: () => void;
  sendGameEvent?: (event: string) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

type ChatProviderProps = {
  children: ReactNode;
};

const formatMessage = (message: ChatMessage, selfUsername: string | null): ChatMessageUnion =>
  selfUsername && message.username === selfUsername ? { ...message, type: 'me' } : message;

const formatHistory = (history: ChatHistoryType, selfUsername: string | null): ChatHistoryType =>
  history.map((message) =>
    message.type !== 'user' ? message : formatMessage(message, selfUsername),
  );

const gameEventMessage = (event: string): ChatGameEvent => ({
  id: `event-${Date.now()}`,
  createdAt: Date.now(),
  type: 'game-event',
  content: {
    text: event,
    payload: event, // Include the full payload for potential use in the UI
  },
});

const optimisticMessage = (text: string): ChatMe => ({
  id: `temp-${Date.now()}`,
  username: 'me',
  type: 'me',
  content: {
    text,
  },
  createdAt: Date.now(),
});

function useChatMessages(
  setMessages: Dispatch<SetStateAction<ChatHistoryType>>,
  selfUsername: string | null,
  setSelfUsername: Dispatch<SetStateAction<string | null>>,
) {
  const handleChatMessage = useCallback(
    (message: ChatMessage) =>
      setMessages((prev) => [...prev, formatMessage(message, selfUsername)]),
    [setMessages, selfUsername],
  );

  const handleChatSystemMessage = useCallback(
    (message: ChatMessageUnion) => setMessages((prev) => [...prev, message]),
    [setMessages],
  );

  const handleChatHistory = useCallback(
    (history: ChatHistoryType) => setMessages(formatHistory(history, selfUsername)),
    [setMessages, selfUsername],
  );

  const handleChatIdentity = useCallback(
    (identity: ChatIdentity) => {
      setSelfUsername(identity.username);
      setMessages((prev) => formatHistory(prev, identity.username));
    },
    [setMessages, setSelfUsername],
  );

  const handleChatError = useCallback(
    (message: ChatMessageUnion) => setMessages((prev) => [...prev, message]),
    [setMessages],
  );

  const handleGameEvent = useCallback(
    (event: ChatGameEvent) => setMessages((prev) => [...prev, event]),
    [setMessages],
  );

  return {
    handleChatMessage,
    handleChatSystemMessage,
    handleChatHistory,
    handleChatIdentity,
    handleChatError,
    handleGameEvent,
  };
}

// eslint-disable-next-line max-lines-per-function
export function ChatProvider({ children }: ChatProviderProps) {
  const [messages, setMessages] = useState<ChatHistoryType>([]);
  const [selfUsername, setSelfUsername] = useState<string | null>(null);
  const [value, setValue] = useState('');

  const sendMessage = useCallback(() => {
    const text = value.trim();
    if (!text) return;

    chatSocket.emit('chat:send', { text });
    setMessages((prev) => [...prev, optimisticMessage(text)]);
    setValue('');
  }, [value]);

  const sendGameEvent = useCallback((event: string) => {
    setMessages((prev) => [...prev, gameEventMessage(event)]);
  }, []);

  const {
    handleChatMessage,
    handleChatSystemMessage,
    handleChatHistory,
    handleChatIdentity,
    handleChatError,
    handleGameEvent,
  } = useChatMessages(setMessages, selfUsername, setSelfUsername);

  const contextValue = useMemo(
    () => ({
      messages,
      value,
      setValue,
      sendMessage,
      sendGameEvent,
    }),
    [messages, value, sendMessage, sendGameEvent],
  );

  return (
    <ChatContext.Provider value={contextValue}>
      <ChatSocketManager
        onChatMessage={handleChatMessage}
        onChatSystemMessage={handleChatSystemMessage}
        onChatHistory={handleChatHistory}
        onChatIdentity={handleChatIdentity}
        onChatError={handleChatError}
        onGameEvent={handleGameEvent}
      />
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }

  return context;
}
