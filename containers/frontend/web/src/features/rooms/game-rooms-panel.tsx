/* eslint-disable local/no-literal-ui-strings */
'use client';

import { useContext } from 'react';
import { Stack, Text } from '@components';
import { RoomsStoreContext } from './rooms-provider';
import { GameRoomTest } from './gameRoomTest';

export function GameRoomsPanel() {
  const roomContext = useContext(RoomsStoreContext);

  if (!roomContext) {
    return (
      <Stack align="center" justify="center" className="px-3 py-3 text-center">
        <Text variant="caption" color="tertiary">
          Loading rooms...
        </Text>
      </Stack>
    );
  }

  return (
    <GameRoomTest
      gameRoomStateCtx={roomContext.roomState}
      gameRoomsErrorInfo=""
    />
  );
}
