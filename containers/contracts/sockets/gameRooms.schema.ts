import { z } from 'zod';

export type ClientToServerGameRoomsEvents = {
  'gameRoom:teammate:joinAny': () => void;
  'gameRoom:teammate:join': (gameRoomId: number) => void;
  'gameRoom:teammate:leave': () => void;
};

export type ServerToClientGameRoomsEvents = {
};


