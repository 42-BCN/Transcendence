import { useEffect } from 'react';
import { robotsSocket, type Robot } from './socket';

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
