// 'use client';
//
// import { gameSocket } from '@/lib/sockets/socket';
// import { useGame } from './store';
// import {
//   createContext, useContext, useEffect, useMemo, useState,
//   type Dispatch, type ReactNode, type SetStateAction
// } from 'react';
//
// // ============================================================================
// // Hooks (integrated to store.ts)
// // ============================================================================
//
// // export function useGameSocketManager() {
// //   const initSocketListeners = useGame((state) => state.initSocketListeners);
// //   const cleanupSocketListeners = useGame((state) => state.cleanupSocketListeners);
// //
// //   useEffect(() => {
// //     initSocketListeners();
// //
// //     return () => {
// //       cleanupSocketListeners();
// //     };
// //   }, [initSocketListeners, cleanupSocketListeners]);
// // }
//
// // ============================================================================
// // Types
// // ============================================================================
//
// type GameContextValue = {
//   rollQuantity: number;
//   assignedCharacter: string;
// };
//
// type GameProviderProps = {
//   children: ReactNode;
// };
//
// // ============================================================================
// // Context
// // ============================================================================
//
// const GameContext = createContext<GameContextValue | null>(null);
//
// // ============================================================================
// // Socket Manager Component
// // ============================================================================
//
// interface GameEventsSocketManagerProps {
//   setRollQuantity: Dispatch<SetStateAction<number>>;
// }
//
// function GameEventsSocketManager({ setRollQuantity }: GameEventsSocketManagerProps) {
//   useEffect(() => {
//     // Event handlers
//     const handleConnect = () => {
//       console.log('Connected to game socket server', gameSocket.id);
//     };
//
//     const handleDisconnect = () => {
//       console.log('Disconnected from game events socket server');
//     };
//
//     const handleUpdateRolls = (quantity: number) => {
//       console.log('Received game rolls update event:', quantity);
//       setRollQuantity(quantity);
//     };
//
//     const handleMoveRange = (range: number) => {
//       console.log('Received game move range update event:', range);
//       setRollQuantity(range);
//     };
//
//     // Setup listeners
//     gameSocket.on('connect', handleConnect);
//     gameSocket.on('disconnect', handleDisconnect);
//     gameSocket.on('game:server:rolls', handleUpdateRolls);
//     gameSocket.on('game:server:displayMoveRange', handleMoveRange);
//
//     // Connect socket
//     gameSocket.connect();
//
//     // Cleanup on unmount
//     return () => {
//       gameSocket.off('connect', handleConnect);
//       gameSocket.off('disconnect', handleDisconnect);
//       gameSocket.off('game:server:rolls', handleUpdateRolls);
//       gameSocket.disconnect();
//     };
//   }, [setRollQuantity]);
//
//   return null;
// }
//
// // ============================================================================
// // Provider Component
// // ============================================================================
//
// export function GameProvider({ children }: GameProviderProps) {
//   const [rollQuantity, setRollQuantity] = useState<number>(0);
//
//   const rollDice = (quantity: number) => {
//     gameSocket.emit('game:client:rolls', quantity);
//   };
//
//   const contextValue = useMemo<GameContextValue>(
//     () => ({
//       rollQuantity,
//     }),
//     [rollQuantity],
//   );
//
//   return (
//     <GameContext.Provider value={contextValue}>
//       <GameEventsSocketManager setRollQuantity={setRollQuantity} />
//       {children}
//     </GameContext.Provider>
//   );
// }
//
// // ============================================================================
// // Hook
// // ============================================================================
//
// export function useGameProvider() {
//   const context = useContext(GameContext);
//
//   if (!context) {
//     throw new Error('useGameProvider must be used within a GameProvider');
//   }
//
//   return context;
// }
