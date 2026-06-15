'use client';

import type { FormEvent } from 'react';
import {
  Form,
  SubmitButton,
  TextField,
} from '@components';

import type { gameRoomState, PlayerState } from '@/contracts/sockets/rooms/gameRooms.schema';

import {
  GameRoomSocketJoinAnyRoom,
  GameRoomSocketJoin,
  GameRoomSocketLeaveRoom,
  GameRoomSocketPrintDebug,
} from '@/lib/sockets/game-room-socket.manager';


// helper function
export function makeGameRoomAction(action: (formData: FormData) => void) {
  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    action(formData);
  };
}

const room_test_ui_style = 'bg-black/60 backdrop-blur-sm p-10 rounded-xl outline h-[95vh] overflow-scroll';

type GameRoomTestProps = {
  gameRoomStateCtx: gameRoomState;
  gameRoomsDebugInfo: string;
  gameRoomsErrorInfo: string;
};

export function GameRoomTest({
  gameRoomStateCtx,
  gameRoomsDebugInfo,
  gameRoomsErrorInfo,
}: GameRoomTestProps) {

  const teammates = gameRoomStateCtx.teammates.map((user: PlayerState) => (
    <li key={user.userId}>{user.userName} (): {user.userId}</li>
  )
  );

  const inviteUrl = gameRoomStateCtx.id !== 0
    ? `${window.location.origin}${window.location.pathname}?roomId=${gameRoomStateCtx.id}`
    : '';


  return (
    <>
      <div className={room_test_ui_style}>
      <h5 className="text-xl">raw data:</h5>
      <p>{JSON.stringify(gameRoomStateCtx)}</p>
      <p>{gameRoomsDebugInfo}</p>
      <p>{gameRoomsErrorInfo}</p>
      <hr className="m-4"/>
      <h5 className="text-xl" >room info</h5>
      <p>gameRoomId: {gameRoomStateCtx.id !== 0 ? gameRoomStateCtx.id : "not on any game room."}</p>
      <hr className="m-1 w-[4rem]"/>
      <p>teammates: {gameRoomStateCtx.id !== 0 ? "" : "not on any game room."}</p>
      <div>
        <ul>{teammates}</ul>
      </div>
      
      <hr className="m-1 w-[4rem]"/>
      
      <p>invite link: </p>
      <a href={inviteUrl}> {inviteUrl} </a>



      <hr className="m-4"/>

      <h4>join any room form.</h4>
      <Form onSubmit={makeGameRoomAction(GameRoomSocketJoinAnyRoom)}>
        <SubmitButton idleLabel="join any room." />
      </Form>

      <hr className="m-2 w-[4rem]"/>

      <h4>join room by id form.</h4>
      <Form onSubmit={makeGameRoomAction(GameRoomSocketJoin)}>
        <TextField
          name="gameRoomId"
          labelKey="features.game.room.fields.gameRoomId"
        />
        <SubmitButton idleLabel="join room." />
      </Form>

      <hr className="m-2 w-[4rem]"/>
      
      <h4>leave current room form.</h4>
      <Form onSubmit={makeGameRoomAction(GameRoomSocketLeaveRoom)}>
        <SubmitButton idleLabel="leave current game room." />
      </Form>

      <hr className="m-2 w-[4rem]"/>

      <h4>print debug info backend.</h4>
      <Form onSubmit={makeGameRoomAction(GameRoomSocketPrintDebug)}>
        <SubmitButton idleLabel="print debug info." />
      </Form>

      <hr className="m-2 w-[4rem]"/>

      </div>
    </>
  );
}
