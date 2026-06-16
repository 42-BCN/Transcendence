'use client';

import type { FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Stack, Text, Form, SubmitButton, ScrollArea, Avatar } from '@components';

import type { gameRoomState, PlayerState } from '@/contracts/sockets/rooms/gameRooms.schema';

import {
  GameRoomSocketJoinAnyRoom,
  GameRoomSocketLeaveRoom,
} from '@/lib/sockets/game-room-socket.manager';

import { SentRoomInvitations } from './sent-room-invitations';

export function makeGameRoomAction(action: (formData: FormData) => void) {
  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    action(formData);
  };
}

type GameRoomTestProps = {
  gameRoomStateCtx: gameRoomState;
  gameRoomsErrorInfo: string;
};

export function GameRoomTest({
  gameRoomStateCtx,
  gameRoomsErrorInfo,
}: GameRoomTestProps) {
  const t = useTranslations('pages.home');
  const isInRoom = gameRoomStateCtx.id !== 0;

  return (
    <Stack gap="none" className="h-full min-h-0">
      {isInRoom ? (
        <>
          <div className="px-4 pt-6 pb-4 md:px-6 md:pt-8">
            <Stack gap="xs">
              <Text as="p" variant="caption" color="tertiary">
                {t('room.label', { id: gameRoomStateCtx.id })}
              </Text>
              <Text as="h1" variant="heading-xl">
                {gameRoomStateCtx.isGameRoomFull ? t('room.statusFull') : t('room.statusWaiting')}
              </Text>
            </Stack>
          </div>

          <ScrollArea className="px-4 md:px-6">
            <Stack gap="lg" className="pb-6">
              {gameRoomStateCtx.teammates.length > 0 && (
                <Stack gap="sm" as="section" aria-labelledby="players-heading">
                  <Text as="h2" variant="caption" color="secondary" id="players-heading">
                    {t('room.playersHeading')}
                  </Text>
                  <div className="flex flex-wrap gap-4">
                    {gameRoomStateCtx.teammates.map((user: PlayerState) => (
                      <div key={user.userId} className="flex flex-col items-center gap-1">
                        <Avatar size="lg" alt={user.userName} />
                        <Text variant="body-xs" color="secondary">{user.userName}</Text>
                      </div>
                    ))}
                  </div>
                </Stack>
              )}

              <SentRoomInvitations
                roomId={gameRoomStateCtx.id}
                teammateUsernames={new Set(gameRoomStateCtx.teammates.map((u: PlayerState) => u.userName))}
              />
            </Stack>
          </ScrollArea>

          <div className="px-4 pb-6 pt-2 md:px-6">
            {gameRoomsErrorInfo && (
              <Text variant="caption" color="danger" className="mb-2">
                {gameRoomsErrorInfo}
              </Text>
            )}
            <Form onSubmit={makeGameRoomAction(GameRoomSocketLeaveRoom)}>
              <SubmitButton idleLabel={t('actions.leave')} />
            </Form>
          </div>
        </>
      ) : (
        <>
          <div className="px-4 pt-6 pb-4 md:px-6 md:pt-8">
            <Stack gap="xs">
              <Text as="h1" variant="heading-xl">
                {t('title')}
              </Text>
              <Text as="p" variant="body" color="secondary">
                {t('subtitle')}
              </Text>
            </Stack>
          </div>

          <div className="px-4 pb-6 pt-2 md:px-6">
            {gameRoomsErrorInfo && (
              <Text variant="caption" color="danger" className="mb-2">
                {gameRoomsErrorInfo}
              </Text>
            )}
            <Form onSubmit={makeGameRoomAction(GameRoomSocketJoinAnyRoom)}>
              <SubmitButton idleLabel={t('actions.join')} />
            </Form>
          </div>
        </>
      )}
    </Stack>
  );
}
