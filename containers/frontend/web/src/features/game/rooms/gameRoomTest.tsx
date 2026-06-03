'use client';

import { useActionState, FormEvent } from 'react';
import { Form, SubmitButton, TextField} from '@components';

import {
  GameRoomSocketJoinAnyRoom,
} from "@/lib/sockets/game-room-socket.manager"


// helper function
export function makeGameRoomAction(action: (formData: FormData) => void) {
  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    action(formData);
  };
}


export function GameRoomTest() {

  return (
    <Form onSubmit={makeGameRoomAction(GameRoomSocketJoinAnyRoom)}>
      <SubmitButton idleLabel="join any room." />
    </Form>
  );
}

