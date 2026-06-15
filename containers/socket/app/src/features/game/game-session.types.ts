import type { clientGameState, serverGameState } from './types';

export type PlayerRole = 'assassin' | 'paladin' | 'mage' | 'alchemist';

export type GameSessionStatus = 'connected' | 'disconnected' | 'spectator';

export type GameSessionPlayer = {
  memberKey: string;
  role: PlayerRole | 'spectator';
  socketId: string;
  status: GameSessionStatus;
};

export type GameSession = {
  roomId: number;
  channel: string;
  state: serverGameState;
  players: Map<string, GameSessionPlayer>;
  readyPlayers: Set<PlayerRole>;
  availableRoles: PlayerRole[];
};
