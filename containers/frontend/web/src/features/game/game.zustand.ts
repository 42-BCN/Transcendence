import { create } from 'zustand';
import { gameSocket } from '@/lib/sockets/socket';

interface GameState {
  // State
  rollQuantity: number;

  // Actions
  setRollQuantity: (quantity: number) => void;
  rollDice: (quantity: number) => void;
  initSocketListeners: () => void;
  cleanupSocketListeners: () => void;
}

export const useGameStore = create<GameState>((set) => {
  // Socket event handlers
  const handleConnect = () => {
    console.log('Connected to game events socket server', gameSocket.id);
  };

  const handleDisconnect = () => {
    console.log('Disconnected from game events socket server');
  };

  const handleUpdateRolls = (quantity: number) => {
    console.log('Received game rolls update event', quantity);
    set({ rollQuantity: quantity });
  };

  return {
    // Initial state
    rollQuantity: 0,

    // State setters
    setRollQuantity: (quantity: number) => {
      set({ rollQuantity: quantity });
    },

    // Actions client emits
    rollDice: (quantity: number) => {
      gameSocket.emit('game:client:rolls', quantity);
    },

    initSocketListeners: () => {
      gameSocket.on('connect', handleConnect);
      gameSocket.on('disconnect', handleDisconnect);
      gameSocket.on('game:server:rolls', handleUpdateRolls);
      gameSocket.connect();
    },

    cleanupSocketListeners: () => {
      gameSocket.off('connect', handleConnect);
      gameSocket.off('disconnect', handleDisconnect);
      gameSocket.off('game:server:rolls', handleUpdateRolls);
      gameSocket.disconnect();
    },
  };
});
