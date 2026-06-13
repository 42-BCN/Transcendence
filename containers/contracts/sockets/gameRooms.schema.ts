import { z } from 'zod';
import type { gameRoomState } from 'game/game.schema';

export type ClientToServerGameRoomsEvents = {
  'gameRoom:teammate:joinAny': () => void;
  'gameRoom:teammate:leave': () => void;
};

export type ServerToClientGameRoomsEvents = {
  'gameRoom:room:joined': (gameRoom: gameRoomState, newTeammateId: string) => void;
  'gameRoom:room:alreadyJoinedElsewere': () => void;
};


