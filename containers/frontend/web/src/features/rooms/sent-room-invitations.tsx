'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Text, Avatar } from '@components';
import { useGameInvitationsStore } from '@/features/game-invitations/store/game-invitations.provider';

const AVATAR_COUNT = 4;
function guestAvatarSrc(username: string): string {
  const index = [...username].reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COUNT;
  return `/avatars/avatar-${index + 1}.png`;
}

type RoomInvitationsProps = {
  roomId: number;
  teammateUsernames: Set<string>;
};

export function SentRoomInvitations({ roomId, teammateUsernames }: RoomInvitationsProps) {
  const t = useTranslations('pages.home.room');
  const invitationsById = useGameInvitationsStore((state) => state.invitationsById);

  const sentInvitations = useMemo(
    () =>
      Object.values(invitationsById).filter(
        (inv) => inv.direction === 'sent' && inv.roomId === roomId,
      ),
    [invitationsById, roomId],
  );
  const receivedInvitations = useMemo(
    () =>
      Object.values(invitationsById).filter(
        (inv) => inv.direction === 'received' && inv.roomId === roomId,
      ),
    [invitationsById, roomId],
  );

  const filteredSent = useMemo(
    () =>
      sentInvitations.filter(
        (inv) => !teammateUsernames.has(inv.friendUsername) && inv.status === 'pending',
      ),
    [sentInvitations, teammateUsernames],
  );
  const filteredReceived = useMemo(
    () =>
      receivedInvitations.filter(
        (inv) => !teammateUsernames.has(inv.friendUsername) && inv.status === 'pending',
      ),
    [receivedInvitations, teammateUsernames],
  );

  const hasSent = filteredSent.length > 0;
  const hasReceived = filteredReceived.length > 0;

  if (!hasSent && !hasReceived) return null;

  return (
    <div className="flex flex-col gap-4">
      {hasSent && (
        <section className="min-w-0 px-4 py-3 md:px-6" aria-labelledby="sent-invitations-heading">
          <Text as="h2" variant="caption" color="secondary" id="sent-invitations-heading">
            {t('invitationsHeading')}
          </Text>
          <div className="min-w-0 overflow-x-auto overflow-y-hidden">
            <div className="flex w-max min-w-full gap-4 py-1">
              {filteredSent.map((inv) => (
                <div
                  key={inv.id}
                  className="flex w-20 min-w-20 shrink-0 flex-col items-center gap-1 opacity-50"
                >
                  <Avatar size="lg" src={guestAvatarSrc(inv.friendUsername)} alt={inv.friendUsername} />
                  <Text
                    variant="body-xs"
                    color="secondary"
                    className="block w-full min-w-0 truncate text-center"
                    title={inv.friendUsername}
                  >
                    {inv.friendUsername}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {hasReceived && (
        <section
          className="min-w-0 px-4 py-3 md:px-6"
          aria-labelledby="received-invitations-heading"
        >
          <Text as="h2" variant="caption" color="secondary" id="received-invitations-heading">
            {t('receivedInvitationsHeading')}
          </Text>
          <div className="min-w-0 overflow-x-auto overflow-y-hidden">
            <div className="flex w-max min-w-full gap-4 py-1">
              {filteredReceived.map((inv) => (
                <div
                  key={inv.id}
                  className="flex w-20 min-w-20 shrink-0 flex-col items-center gap-1 opacity-50"
                >
                  <Avatar size="lg" src={guestAvatarSrc(inv.friendUsername)} alt={inv.friendUsername} />
                  <Text
                    variant="body-xs"
                    color="secondary"
                    className="block w-full min-w-0 truncate text-center"
                    title={inv.friendUsername}
                  >
                    {inv.friendUsername}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
