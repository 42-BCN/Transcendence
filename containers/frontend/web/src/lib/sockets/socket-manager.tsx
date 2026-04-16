import { useEffect } from 'react';

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
  onChatMessage: (message: ChatMessage) => void;
  onChatSystemMessage: (message: ChatSystemMessage) => void;
  onChatError: (message: ChatError) => void;
  onChatHistory: (history: ChatHistoryType) => void;
  onChatIdentity: (identity: ChatIdentity) => void;
  onGameEvent: (event: ChatGameEvent) => void;
};

export const ChatSocketManager = ({
  onChatMessage,
  onChatSystemMessage,
  onChatError,
  onChatHistory,
  onChatIdentity,
  onGameEvent,
}: ChatSocketManagerProps) => {
  useEffect(() => {
    const handleConnect = () => console.log('Connected to chat socket server', chatSocket.id);
    const handleDisconnect = () => console.log('Disconnected from chat socket server');
    const handleChatMessage = (payload: ChatMessage) => onChatMessage(payload);
    const handleChatSystemMessage = (payload: ChatSystemMessage) => onChatSystemMessage(payload);
    const handleChatError = (payload: ChatError) => onChatError(payload);
    const handleChatHistory = (payload: ChatHistoryType) => onChatHistory(payload);
    const handleChatIdentity = (payload: ChatIdentity) => onChatIdentity(payload);
    const handleGameEvent = (payload: ChatGameEvent) => onGameEvent(payload);

    const reservedListeners = [
      ['connect', handleConnect],
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

    void ensureChatSessionIdentity()
      .catch((error) => {
        console.error('Failed to initialize chat session identity', error);
      })
      .finally(() => {
        if (isMounted) {
          chatSocket.connect();
        }
      });

    return () => {
      isMounted = false;
      reservedListeners.forEach(([event, handler]) => chatSocket.off(event, handler));
      chatListeners.forEach(([event, handler]) => chatSocket.off(event, handler));
      chatSocket.disconnect();
    };
  }, [onChatMessage, onChatSystemMessage, onChatError, onChatHistory, onChatIdentity, onGameEvent]);

  return null;
};
