'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Stack, Text, Avatar } from '@components';
import { useGameInvitationsStore } from '@/features/game-invitations/store/game-invitations.provider';

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
    <Stack gap="md">
      {hasSent && (
        <Stack gap="sm" as="section" aria-labelledby="sent-invitations-heading">
          <Text as="h2" variant="caption" color="secondary" id="sent-invitations-heading">
            {t('invitationsHeading')}
          </Text>
          <div className="flex flex-wrap gap-4">
            {filteredSent.map((inv) => (
              <div key={inv.id} className="flex w-9 min-w-0 flex-col items-center gap-1 opacity-50">
                <Avatar size="lg" alt={inv.friendUsername} />
                <Text variant="body-xs" color="secondary" className="w-full truncate text-center" title={inv.friendUsername}>{inv.friendUsername}</Text>
              </div>
            ))}
          </div>
        </Stack>
      )}

      {hasReceived && (
        <Stack gap="sm" as="section" aria-labelledby="received-invitations-heading">
          <Text as="h2" variant="caption" color="secondary" id="received-invitations-heading">
            {t('receivedInvitationsHeading')}
          </Text>
          <div className="flex flex-wrap gap-4">
            {filteredReceived.map((inv) => (
              <div key={inv.id} className="flex w-9 min-w-0 flex-col items-center gap-1 opacity-50">
                <Avatar size="lg" alt={inv.friendUsername} />
                <Text variant="body-xs" color="secondary" className="w-full truncate text-center" title={inv.friendUsername}>{inv.friendUsername}</Text>
              </div>
            ))}
          </div>
        </Stack>
      )}
    </Stack>
  );
}
