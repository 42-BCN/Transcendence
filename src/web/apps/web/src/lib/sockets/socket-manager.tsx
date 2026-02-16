import { useEffect } from 'react';
import { socket } from './socket';

type Character = {
  id: string;
  position: [number, number, number];
  color: string;
};

type Props = {
  onCharacters: (chars: Character[]) => void;
};

export const SocketManager = ({ onCharacters }: Props) => {
  useEffect(() => {
    const handleConnect = () => {
      console.log('Connected to Socket.IO server', socket.id);
    };

    const handleCharacters = (data: Character[]) => {
      console.log('Updated characters:', data);
      onCharacters(data);
    };
    const handleDisconnect = () => {
      console.log('Disconnected from Socket.IO server');
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('characters', handleCharacters);

    socket.connect();

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('characters', handleCharacters);
      socket.disconnect();
    };
  }, []);

  return null;
};
