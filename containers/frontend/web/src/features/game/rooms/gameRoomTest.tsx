'use client';

import { useActionState, FormEvent } from 'react';
import { Form, SubmitButton, TextField} from '@components';

import type { gameRoomState } from '@contracts/sockets/game/game.schema';

import {
  GameRoomSocketJoinAnyRoom,
  GameRoomSocketLeaveRoom,
} from "@/lib/sockets/game-room-socket.manager"


// helper function
export function makeGameRoomAction(action: (formData: FormData) => void) {
  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    action(formData);
  };
}

export function GameRoomTest(gameRoomStateCtx: gameRoomState) {

  console.log("[ DEBUG TEST IMPORTANT !!! ] ", gameRoomStateCtx);
  return (
	<>
    <Form onSubmit={makeGameRoomAction(GameRoomSocketJoinAnyRoom)}>
      <SubmitButton idleLabel="join any room." />
    </Form>
    <Form onSubmit={makeGameRoomAction(GameRoomSocketLeaveRoom)}>
      <SubmitButton idleLabel="leave current game room." />
    </Form>
	</>
  );
}



