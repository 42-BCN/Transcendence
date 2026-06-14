'use client';
import { useRef, useEffect, useState } from 'react';

import { Button } from '@components/controls/button';

import { gameRoomSocket } from '@/lib/sockets/socket';
import { 
  initGameRoomSocketHandelers, 
  deinitGameRoomSocketHandelers 
} from '@/lib/sockets/game-room-socket.manager';
import { GameRoomTest } from './gameRoomTest';
import type { gameRoomState } from '@contracts/sockets/rooms/gameRooms.schema';



const test_ui_style = "fixed top-1/2 left-1/2 z-50";

export function Rooms() {
  const [gameRoomsDebugInfo, setGameRoomsDebugInfo] = useState("not connected to socket.");
  const [gameRoomsErrorInfo, setGameRoomsErrorInfo] = useState("not connected to socket.");
  const [gameRoomStateCtx, setGameRoomStateCtx] = useState<gameRoomState>({
    id: 0, 
    isGameRoomFull: false, 
    teammates: [],
  });
  const [testUiVisibility, setTestUiVisibility] = useState(true);

  useEffect(() => {
    initGameRoomSocketHandelers(
	    setGameRoomStateCtx,
	    setGameRoomsDebugInfo,
	    setGameRoomsErrorInfo
    );
    return () => {};
  }, []);


  return (
    <>
      <Button
        className="fixed bottom-0 right-0 text-nowrap w-auto z-50"
        onPress={() => {setTestUiVisibility(! testUiVisibility)}}
        variant="primary"
      >
        togle test rooms ui visibility
      </Button>
      <div 
        className={test_ui_style + ( testUiVisibility === true ? "": " hidden") } 
        style={{transform: `translate(-50%, -50%)`}}
      >
        <GameRoomTest 
          gameRoomStateCtx={gameRoomStateCtx} 
          gameRoomsDebugInfo={gameRoomsDebugInfo}
          gameRoomsErrorInfo={gameRoomsErrorInfo}
        />
      </div>
    </>
  );
}


