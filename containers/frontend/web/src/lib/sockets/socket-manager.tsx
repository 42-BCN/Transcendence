import { useEffect, useRef } from 'react';

import { chatSocket, ensureChatSessionIdentity, robotsSocket, type Robot } from './socket';
import type {
  ChatError,
  ChatGameEvent,
  ChatHistoryType,
  ChatIdentity,
  ChatMessage,
  ChatSystemMessage,
} from '@/contracts/sockets/chat/chat.schema';

type RobotsSocketManagerProps = {
  onRobots: (robots: Robot[]) => void;
};

export const RobotsSocketManager = ({ onRobots }: RobotsSocketManagerProps) => {
  useEffect(() => {
    const handleConnect = () => {
      console.log('Connected to robots socket server', robotsSocket.id);
    };

    const handleRobots = (robots: Robot[]) => {
      onRobots(robots);
    };

    const handleDisconnect = () => {
      console.log('Disconnected from robots socket server');
    };

    const listeners = [
      ['connect', handleConnect],
      ['disconnect', handleDisconnect],
      ['robots', handleRobots],
    ] as const;

    listeners.forEach(([event, handler]) => {
      robotsSocket.on(event, handler);
    });

    robotsSocket.connect();

    return () => {
      listeners.forEach(([event, handler]) => {
        robotsSocket.off(event, handler);
      });

      robotsSocket.disconnect();
    };
  }, [onRobots]);

  return null;
};

type ChatSocketManagerProps = {
  roomId: number | null;
  onChatMessage: (message: ChatMessage) => void;
  onChatSystemMessage: (message: ChatSystemMessage) => void;
  onChatError: (message: ChatError) => void;
  onChatHistory: (history: ChatHistoryType) => void;
  onChatIdentity: (identity: ChatIdentity) => void;
  onGameEvent: (event: ChatGameEvent) => void;
};

export const ChatSocketManager = ({
  roomId,
  onChatMessage,
  onChatSystemMessage,
  onChatError,
  onChatHistory,
  onChatIdentity,
  onGameEvent,
}: ChatSocketManagerProps) => {
  const onChatMessageRef = useRef(onChatMessage);
  const onChatSystemMessageRef = useRef(onChatSystemMessage);
  const onChatErrorRef = useRef(onChatError);
  const onChatHistoryRef = useRef(onChatHistory);
  const onChatIdentityRef = useRef(onChatIdentity);
  const onGameEventRef = useRef(onGameEvent);

  onChatMessageRef.current = onChatMessage;
  onChatSystemMessageRef.current = onChatSystemMessage;
  onChatErrorRef.current = onChatError;
  onChatHistoryRef.current = onChatHistory;
  onChatIdentityRef.current = onChatIdentity;
  onGameEventRef.current = onGameEvent;

  useEffect(() => {
    const handleConnect = () =>
      console.log('Connected to chat socket server', chatSocket.id, 'roomId=', roomId);
    const handleConnectError = (error: Error) => {
      console.error('Chat socket connect error', error);
    };
    const handleDisconnect = () =>
      console.log('Disconnected from chat socket server', 'roomId=', roomId);
    const handleChatMessage = (payload: ChatMessage) => onChatMessageRef.current(payload);
    const handleChatSystemMessage = (payload: ChatSystemMessage) =>
      onChatSystemMessageRef.current(payload);
    const handleChatError = (payload: ChatError) => onChatErrorRef.current(payload);
    const handleChatHistory = (payload: ChatHistoryType) => onChatHistoryRef.current(payload);
    const handleChatIdentity = (payload: ChatIdentity) => onChatIdentityRef.current(payload);
    const handleGameEvent = (payload: ChatGameEvent) => onGameEventRef.current(payload);

    const reservedListeners = [
      ['connect', handleConnect],
      ['connect_error', handleConnectError],
      ['disconnect', handleDisconnect],
    ] as const;

    const chatListeners = [
      ['chat:identity', handleChatIdentity],
      ['chat:message', handleChatMessage],
      ['chat:system', handleChatSystemMessage],
      ['chat:error', handleChatError],
      ['chat:history', handleChatHistory],
      ['chat:game-event', handleGameEvent],
    ] as const;

    reservedListeners.forEach(([event, handler]) => chatSocket.on(event, handler));
    chatListeners.forEach(([event, handler]) => chatSocket.on(event, handler));

    let isMounted = true;

    if (roomId !== null) {
      void ensureChatSessionIdentity()
        .then(() => {
          if (isMounted) {
            chatSocket.connect();
          }
        })
        .catch((error) => {
          console.error('Failed to initialize chat session identity', error);
        });
    } else {
      chatSocket.disconnect();
    }

    return () => {
      isMounted = false;
      reservedListeners.forEach(([event, handler]) => chatSocket.off(event, handler));
      chatListeners.forEach(([event, handler]) => chatSocket.off(event, handler));
      chatSocket.disconnect();
    };
  }, [roomId]); // only roomId — handler changes must NOT reconnect the socket

  return null;
};
