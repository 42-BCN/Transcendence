import { useEffect } from 'react';
import { chatSocket, robotsSocket, type Robot } from './socket';

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
  onChatMessage: (message: any) => void;
  onChatSystemMessage: (message: any) => void;
  onChatError: (message: any) => void;
};

// eslint-disable-next-line max-lines-per-function
export const ChatSocketManager = ({
  onChatMessage,
  onChatSystemMessage,
  onChatError,
}: ChatSocketManagerProps) => {
  // eslint-disable-next-line max-lines-per-function
  useEffect(() => {
    const handleConnect = () => {
      console.log('Connected to chat socket server', chatSocket.id);
    };

    const handleDisconnect = () => {
      console.log('Disconnected from chat socket server');
    };

    const handleChatMessage = (payload: any) => {
      console.log('Received chat message', payload);
      onChatMessage(payload);
    };

    const handleChatSystemMessage = (payload: any) => {
      console.log('Received chat system message', payload);
      onChatSystemMessage(payload);
    };

    const handleChatError = (payload: any) => {
      console.error('Received chat error message', payload);
      onChatError(payload);
    };

    chatSocket.on('connect', handleConnect);
    chatSocket.on('chat:message', handleChatMessage);
    chatSocket.on('chat:system', handleChatSystemMessage);
    chatSocket.on('chat:error', handleChatError);
    chatSocket.on('disconnect', handleDisconnect);

    chatSocket.connect();

    return () => {
      chatSocket.off('connect', handleConnect);
      chatSocket.off('chat:message', handleChatMessage);
      chatSocket.off('chat:system', handleChatSystemMessage);
      chatSocket.off('chat:error', handleChatError);
      chatSocket.off('disconnect', handleDisconnect);
      chatSocket.disconnect();
    };
  }, []);

  return null;
};
