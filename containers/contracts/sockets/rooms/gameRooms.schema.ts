import { z } from 'zod';



export type gameRoomState = {
	id: number;
	isGameRoomFull: boolean;
	teammates: {userId: string, userName: string, role?: string}[];
}



export type ClientToServerGameRoomsEvents = {
  'gameRoom:teammate:joinAny': () => void;
  'gameRoom:teammate:leave': () => void;
};

export type ServerToClientGameRoomsEvents = {
  'gameRoom:room:joined': (gameRoom: gameRoomState, newTeammateId: string) => void;
  'gameRoom:room:alreadyJoinedElsewere': () => void;
};

