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

// TODO These formatting functions can be removed once the backend can
// identify the authenticated user and emit the correct renderable type.

const formatMessage = (message: ChatMessage): ChatMessageUnion =>
  message.username !== 'me' ? message : { ...message, type: 'me' };

const formatHistory = (history: ChatHistoryType): ChatHistoryType =>
  history.map((message) => (message.type !== 'user' ? message : formatMessage(message)));

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

function useChatMessages(setMessages: Dispatch<SetStateAction<ChatHistoryType>>) {
  const handleChatMessage = useCallback(
    (message: ChatMessage) => setMessages((prev) => [...prev, formatMessage(message)]),
    [setMessages],
  );

  const handleChatSystemMessage = useCallback(
    (message: ChatMessageUnion) => setMessages((prev) => [...prev, message]),
    [setMessages],
  );

  const handleChatHistory = useCallback(
    (history: ChatHistoryType) => setMessages(formatHistory(history)),
    [setMessages],
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
    handleChatError,
    handleGameEvent,
  };
}

// eslint-disable-next-line max-lines-per-function
export function ChatProvider({ children }: ChatProviderProps) {
  const [messages, setMessages] = useState<ChatHistoryType>([]);
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
    handleChatError,
    handleGameEvent,
  } = useChatMessages(setMessages);

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
