import { useEffect } from 'react';
import { chatSocket, robotsSocket, type Robot } from './socket';
import type {
  ChatError,
  ChatMe,
  ChatMessage,
  ChatMessageUnion,
  ChatSystemMessage,
} from '@/contracts/sockets/chat/chat.schema';

type Props = {
  onRobots: (robots: Robot[]) => void;
};

export const RobotsSocketManager = ({ onRobots }: Props) => {
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

    robotsSocket.on('connect', handleConnect);
    robotsSocket.on('disconnect', handleDisconnect);
    robotsSocket.on('robots', handleRobots);

    robotsSocket.connect();

    return () => {
      robotsSocket.off('connect', handleConnect);
      robotsSocket.off('disconnect', handleDisconnect);
      robotsSocket.off('robots', handleRobots);
      robotsSocket.disconnect();
    };
  }, [onRobots]);

  return null;
};

type ChatSocketManagerProps = {
  onChatMessage: (message: ChatMessage | ChatMe) => void;
  onChatSystemMessage: (message: ChatSystemMessage) => void;
  onChatError: (message: ChatError) => void;
  onChatHistory: (history: ChatMessageUnion[]) => void;
};

export const ChatSocketManager = ({
  onChatMessage,
  onChatSystemMessage,
  onChatError,
  onChatHistory,
}: ChatSocketManagerProps) => {
  useEffect(() => {
    const handleConnect = () => console.log('Connected to chat socket server', chatSocket.id);
    const handleDisconnect = () => console.log('Disconnected from chat socket server');
    const handleChatMessage = (payload: ChatMessage | ChatMe) => onChatMessage(payload);
    const handleChatSystemMessage = (payload: ChatSystemMessage) => onChatSystemMessage(payload);
    const handleChatError = (payload: ChatError) => onChatError(payload);
    const handleChatHistory = (payload: ChatMessageUnion[]) => onChatHistory(payload);

    chatSocket.on('connect', handleConnect);
    chatSocket.on('chat:message', handleChatMessage);
    chatSocket.on('chat:system', handleChatSystemMessage);
    chatSocket.on('chat:error', handleChatError);
    chatSocket.on('disconnect', handleDisconnect);
    chatSocket.on('chat:history', handleChatHistory);

    chatSocket.connect();

    return () => {
      chatSocket.off('connect', handleConnect);
      chatSocket.off('chat:message', handleChatMessage);
      chatSocket.off('chat:system', handleChatSystemMessage);
      chatSocket.off('chat:error', handleChatError);
      chatSocket.off('disconnect', handleDisconnect);
      chatSocket.off('chat:history', handleChatHistory);
      chatSocket.disconnect();
    };
  }, []);

  return null;
};
