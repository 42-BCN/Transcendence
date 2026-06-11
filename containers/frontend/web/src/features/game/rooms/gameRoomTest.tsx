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

export function GameRoomTest({
  gameRoomStateCtx,
  gameRoomsDebugInfo,
  gameRoomsErrorInfo
}: {gameRoomState, string, string}) {

  const teammates = gameRoomStateCtx.teammates.map(user => 
    <li key={user.userId} >{user.userName} (): {user.userId}</li>
  );

  return (
	<div className="bg-black/30 backdrop-blur-sm p-10 rounded-xl outline h-[50rem] overflow-scroll" >
    <h5 className="text-xl">raw data:</h5>
    <p>{JSON.stringify(gameRoomStateCtx)}</p>
    <p>{gameRoomsDebugInfo}</p>
    <p>{gameRoomsErrorInfo}</p>
    <hr className="m-4"/>
    <h5 className="text-xl" >room info</h5>
    <p>gameRoomId: {gameRoomStateCtx.id !== 0 ? gameRoomStateCtx.id : "not on any game room."}</p>
    <p>teammates: {gameRoomStateCtx.id !== 0 ? "" : "not on any game room."}</p>
    <div>
      <ul>{teammates}</ul>
    </div>
    



    <hr className="m-4"/>
    <h4>join any room form.</h4>
    <Form onSubmit={makeGameRoomAction(GameRoomSocketJoinAnyRoom)}>
      <SubmitButton idleLabel="join any room." />
    </Form>
    <hr className="m-4"/>
    <h4>leave current room form.</h4>
    <Form onSubmit={makeGameRoomAction(GameRoomSocketLeaveRoom)}>
      <SubmitButton idleLabel="leave current game room." />
    </Form>
    <hr className="m-4"/>
    <h4>print debug info backend.</h4>
    <Form onSubmit={makeGameRoomAction(GameRoomSocketPrintDebug)}>
      <SubmitButton idleLabel="print debug info." />
    </Form>
    <hr className="m-4"/>

	</div>
  );
}



