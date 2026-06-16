import type { gameRoomState } from '@contracts/sockets/rooms/gameRooms.schema';

import { initState } from './utils';
import type { GameSession } from './game-session.types';
import type { serverGameState } from './types';

const DEFAULT_ROLES = ['assassin', 'paladin', 'mage', 'alchemist'] as const;

function createInitialServerState(): serverGameState {
  const init = initState();
  return {
    phase: 'PLAN',
    turn: 1,
    doom: 0,
    players: init.players,
    ghosts: {},
    clones: {},
    enemies: init.enemies,
    tiles: init.tiles,
    clients: {},
    history: [],
    mapBounds: init.mapBounds,
    forcedMoveOrigins: {},
    planningStatusOrigins: {},
  };
}

export class GameSessionManager {
  private sessions = new Map<number, GameSession>();

  getOrCreateSession(gameRoom: gameRoomState): GameSession {
    const existing = this.sessions.get(gameRoom.id);
    if (existing) {
      return existing;
    }

    const session: GameSession = {
      roomId: gameRoom.id,
      channel: `GameRoom-${gameRoom.id}`,
      state: createInitialServerState(),
      players: new Map(),
      readyPlayers: new Set(),
      availableRoles: [...DEFAULT_ROLES].reverse(),
    };

    this.sessions.set(gameRoom.id, session);
    return session;
  }

  getSession(roomId: number) {
    return this.sessions.get(roomId);
  }

  deleteSession(roomId: number) {
    this.sessions.delete(roomId);
  }

  hasSession(roomId: number) {
    return this.sessions.has(roomId);
  }
}

export const gameSessionManager = new GameSessionManager();
