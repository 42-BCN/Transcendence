'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { Dispatch, SetStateAction, ReactNode } from 'react';

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
import { RoomsStoreContext } from '@/features/rooms/rooms-provider';
import { REALTIME_IDENTITY_CHANGED_EVENT } from '@/lib/sockets/realtime-session-bridge';

type ChatContextValue = {
  messages: ChatHistoryType;
  roomId: number | null;
  participants: string[];
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
  // Use a ref so handlers always read the latest selfUsername without needing
  // to be recreated (which would cause ChatSocketManager to reconnect).
  const selfUsernameRef = useRef(selfUsername);
  selfUsernameRef.current = selfUsername;

  const handleChatMessage = useCallback(
    (message: ChatMessage) =>
      setMessages((prev) => [...prev, formatMessage(message, selfUsernameRef.current)]),
    [setMessages],
  );

  const handleChatSystemMessage = useCallback(
    (message: ChatMessageUnion) => setMessages((prev) => [...prev, message]),
    [setMessages],
  );

  const handleChatHistory = useCallback(
    (history: ChatHistoryType) => setMessages(formatHistory(history, selfUsernameRef.current)),
    [setMessages],
  );

  const handleChatIdentity = useCallback(
    (identity: ChatIdentity) => {
      selfUsernameRef.current = identity.username;
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
  const [previousSelfUsername, setPreviousSelfUsername] = useState<string | null>(null);
  const [value, setValue] = useState('');
  const roomsStore = useContext(RoomsStoreContext);

  if (!roomsStore) {
    throw new Error('ChatProvider must be used within RoomsProvider');
  }

  const roomId = roomsStore.roomState.id > 0 ? roomsStore.roomState.id : null;
  const participants = roomsStore.roomState.teammates.map((teammate) => teammate.userName);

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

  useEffect(() => {
    const handleIdentityChanged = () => {
      setMessages([]);
      setPreviousSelfUsername(selfUsername);
      setSelfUsername(null);
    };

    window.addEventListener(REALTIME_IDENTITY_CHANGED_EVENT, handleIdentityChanged);

    return () => {
      window.removeEventListener(REALTIME_IDENTITY_CHANGED_EVENT, handleIdentityChanged);
    };
  }, [selfUsername]);

  const {
    handleChatMessage,
    handleChatSystemMessage,
    handleChatHistory,
    handleChatIdentity,
    handleChatError,
    handleGameEvent,
  } = useChatMessages(setMessages, selfUsername, setSelfUsername);

  const handleChatIdentityWithMemberKey = useCallback(
    (identity: ChatIdentity) => {
      const nextMemberKey =
        typeof identity.userId === 'string' && identity.userId.length > 0
          ? `user:${identity.userId}`
          : identity.identityKey;

      handleChatIdentity(identity);
      roomsStore.replaceTeammateName({
        nextUserName: identity.username,
        previousUserName: previousSelfUsername ?? selfUsername,
        nextMemberKey,
      });
    },
    [handleChatIdentity, previousSelfUsername, roomsStore, selfUsername],
  );

  const contextValue = useMemo(
    () => ({
      messages,
      roomId,
      participants,
      value,
      setValue,
      sendMessage,
      sendGameEvent,
    }),
    [messages, participants, roomId, value, sendMessage, sendGameEvent],
  );

  return (
    <ChatContext.Provider value={contextValue}>
      <ChatSocketManager
        roomId={roomId}
        onChatMessage={handleChatMessage}
        onChatSystemMessage={handleChatSystemMessage}
        onChatHistory={handleChatHistory}
        onChatIdentity={handleChatIdentityWithMemberKey}
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
