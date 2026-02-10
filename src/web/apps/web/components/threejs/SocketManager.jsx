import { useEffect } from 'react';
import { io } from 'socket.io-client';

export const socket = io('http://localhost:5000', {
  autoConnect: false,
});

export const SocketManager = () => {
  useEffect(() => {
    function handleConnect() {
      console.log('Connected to Socket.IO server');
    }

    function handleDisconnect() {
      console.log('Disconnected from Socket.IO server');
    }

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // Connect to the server
    socket.connect();
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.disconnect();
    };
  }, []);

  return null;
};
