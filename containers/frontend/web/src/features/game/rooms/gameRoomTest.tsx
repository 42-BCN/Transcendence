'use client';

import { useActionState, FormEvent } from 'react';
import { Form, SubmitButton, TextField} from '@components';

import type { gameRoomState } from '@contracts/sockets/game/game.schema';

import {
  GameRoomSocketJoinAnyRoom,
  GameRoomSocketLeaveRoom,
  GameRoomSocketPrintDebug,
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
    <h4>join any room form.</h4>
    <Form onSubmit={makeGameRoomAction(GameRoomSocketJoinAnyRoom)}>
      <SubmitButton idleLabel="join any room." />
    </Form>
    <hr/>
    <h4>leave current room form.</h4>
    <Form onSubmit={makeGameRoomAction(GameRoomSocketLeaveRoom)}>
      <SubmitButton idleLabel="leave current game room." />
    </Form>
    <hr/>
    <h4>print debug info backend.</h4>
    <Form onSubmit={makeGameRoomAction(GameRoomSocketPrintDebug)}>
      <SubmitButton idleLabel="print debug info." />
    </Form>
    <hr/>
	</>
  );
}



