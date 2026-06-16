'use client';

import type { FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Stack, Text, Form, SubmitButton, Avatar } from '@components';

import type { gameRoomState, PlayerState } from '@/contracts/sockets/rooms/gameRooms.schema';

import {
  GameRoomSocketJoinAnyRoom,
  GameRoomSocketLeaveRoom,
} from '@/lib/sockets/game-room-socket.manager';

import { SentRoomInvitations } from './sent-room-invitations';

const AVATAR_COUNT = 4;
function guestAvatarSrc(username: string): string {
  const index = [...username].reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COUNT;
  return `/avatars/avatar-${index + 1}.png`;
}

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

export function GameRoomTest({ gameRoomStateCtx, gameRoomsErrorInfo }: GameRoomTestProps) {
  const t = useTranslations('pages.home');
  const isInRoom = gameRoomStateCtx.id !== 0;
  const teammateUsernames = new Set(gameRoomStateCtx.teammates.map((u: PlayerState) => u.userName));

  return (
    <Stack gap="none" className="h-full min-h-0">
      {isInRoom ? (
        <>
          <Stack gap="xs" className="px-4 pb-4 pt-14 md:px-6 md:pt-8">
            <Text as="p" variant="caption" color="tertiary">
              {t('room.label', { id: gameRoomStateCtx.id })}
            </Text>
            <Text as="h1" variant="heading-xl">
              {gameRoomStateCtx.isGameRoomFull ? t('room.statusFull') : t('room.statusWaiting')}
            </Text>
          </Stack>

          {gameRoomStateCtx.teammates.length > 0 && (
            <section className="min-w-0 px-4 py-3 md:px-6" aria-labelledby="players-heading">
              <Text as="h2" variant="caption" color="secondary" id="players-heading">
                {t('room.playersHeading')}
              </Text>
              <div className="min-w-0 overflow-x-auto overflow-y-hidden">
                <div className="flex w-max min-w-full gap-4 py-1">
                  {gameRoomStateCtx.teammates.map((user: PlayerState) => (
                    <div
                      key={user.userId}
                      className="flex w-20 min-w-20 shrink-0 flex-col items-center gap-1"
                    >
                      <Avatar size="lg" src={guestAvatarSrc(user.userName)} alt={user.userName} />
                      <Text
                        variant="body-xs"
                        color="secondary"
                        className="block w-full min-w-0 truncate text-center"
                        title={user.userName}
                      >
                        {user.userName}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          <SentRoomInvitations roomId={gameRoomStateCtx.id} teammateUsernames={teammateUsernames} />

          <Stack gap="xs" className="px-4 pb-6 pt-2 md:px-6">
            {gameRoomsErrorInfo && (
              <Text variant="caption" color="danger">
                {gameRoomsErrorInfo}
              </Text>
            )}
            <Form onSubmit={makeGameRoomAction(GameRoomSocketLeaveRoom)}>
              <SubmitButton idleLabel={t('actions.leave')} />
            </Form>
          </Stack>
        </>
      ) : (
        <>
          <Stack gap="xs" className="px-4 pb-4 pt-14 md:px-6 md:pt-8">
            <Text as="h1" variant="heading-xl">
              {t('title')}
            </Text>
            <Text as="p" variant="body" color="secondary">
              {t('subtitle')}
            </Text>
          </Stack>

          <Stack gap="xs" className="px-4 pb-6 pt-2 md:px-6">
            {gameRoomsErrorInfo && (
              <Text variant="caption" color="danger">
                {gameRoomsErrorInfo}
              </Text>
            )}
            <Form onSubmit={makeGameRoomAction(GameRoomSocketJoinAnyRoom)}>
              <SubmitButton idleLabel={t('actions.join')} />
            </Form>
          </Stack>
        </>
      )}
    </Stack>
  );
}
