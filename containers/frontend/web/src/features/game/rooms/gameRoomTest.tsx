'use client';

import { useActionState, FormEvent, useState } from 'react';
import { 
    Form, 
    SubmitButton, 
    TextField, 
    TextAreaField, 
    Button
} from '@components';

import type { gameRoomState } from '@contracts/sockets/game/game.schema';

import {
  GameRoomSocketJoinAnyRoom,
  GameRoomSocketJoin,
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

const room_test_ui_style = "bg-black/30 backdrop-blur-sm p-10 rounded-xl outline h-[95vh] overflow-scroll";


export function GameRoomTest({
  gameRoomStateCtx,
  gameRoomsDebugInfo,
  gameRoomsErrorInfo
}: {gameRoomState, string, string}) {

  const teammates = gameRoomStateCtx.teammates.map(user => 
    <li key={user.userId} >{user.userName} (): {user.userId}</li>
  );


  return (
  <>
	  <div className={room_test_ui_style} >
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

      <h4>join room by id form.</h4>
      <Form onSubmit={makeGameRoomAction(GameRoomSocketJoin)}>
        <TextAreaField
          name="gameRoomId"
          labelKey="features.game.room.fields.gameRoomId"
        />
        <SubmitButton idleLabel="join room." />
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
  </>
  );
}



