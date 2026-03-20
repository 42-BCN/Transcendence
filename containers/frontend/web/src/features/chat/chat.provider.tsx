'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { chatSocket } from '@/lib/sockets/socket';
import { ChatSocketManager } from '@/lib/sockets/socket-manager';
import type { ChatMessageUnion } from '@/contracts/sockets/chat/chat.schema';

type ChatContextValue = {
  messages: ChatMessageUnion[];
  value: string;
  setValue: (value: string) => void;
  sendMessage: () => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

type ChatProviderProps = {
  children: ReactNode;
};

// eslint-disable-next-line max-lines-per-function
export function ChatProvider({ children }: ChatProviderProps) {
  const [messages, setMessages] = useState<ChatMessageUnion[]>([]);
  const [value, setValue] = useState('');

  const sendMessage = useCallback(() => {
    const text = value.trim();
    if (!text) return;

    chatSocket.emit('chat:send', { text });

    setMessages((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        username: 'me',
        type: 'me',
        content: { text },
      } as ChatMessageUnion,
    ]);

    setValue('');
  }, [value]);

  const contextValue = useMemo(
    () => ({
      messages,
      value,
      setValue,
      sendMessage,
    }),
    [messages, value, sendMessage],
  );

  return (
    <ChatContext.Provider value={contextValue}>
      <ChatSocketManager
        onChatMessage={(message) => {
          message.type = message.username === 'me' ? 'me' : 'user';
          setMessages((prev) => [...prev, message]);
        }}
        onChatSystemMessage={(message) => {
          setMessages((prev) => [...prev, message]);
        }}
        onChatHistory={(history) => {
          const formattedHistory = history.map((message) => ({
            ...message,
            type: message?.username === 'me' ? 'me' : message.type,
          })) as ChatMessageUnion[];
          setMessages(formattedHistory);
        }}
        onChatError={(message) => {
          setMessages((prev) => [...prev, message]);
        }}
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
