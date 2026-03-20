'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { chatSocket } from '@/lib/sockets/socket';
import { ChatSocketManager } from '@/lib/sockets/socket-manager';

export type Message = {
  id: string;
  username: string;
  content: {
    text: string;
  };
};

type ChatContextValue = {
  messages: Message[];
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [value, setValue] = useState('');

  const sendMessage = useCallback(() => {
    const text = value.trim();
    if (!text) return;

    chatSocket.emit('chat:send', { text });

    setMessages((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        username: 'capapes',
        content: { text },
      },
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
          setMessages((prev) => [...prev, message]);
        }}
        onChatSystemMessage={(message) => {
          console.log('System message:', message);
        }}
        onChatError={(message) => {
          console.error('Chat error:', message);
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
