import { z } from 'zod';


export type PlayerState = {
  userId: string;
  userName: string;
};


export type gameRoomState = {
	id: number;
	isGameRoomFull: boolean;
	status: 'open' | 'locked';
	teammates: PlayerState[];
};

export type ClientToServerGameRoomsEvents = {
  'gameRoom:teammate:join': (roomId: number) => void;
  'gameRoom:teammate:joinAny': () => void;
  'gameRoom:teammate:leave': () => void;
  'gameRoom:teammate:printDebug': () => void;
};

export type ServerToClientGameRoomsEvents = {
  'gameRoom:room:update': (gameRoom: gameRoomState) => void;
  'gameRoom:debug:msg': (text: string) => void;
  'gameRoom:error:msg': (text: string) => void;
  'gameRoom:room:joined': (username: string) => void;
  'gameRoom:room:left': (username: string) => void;
};
