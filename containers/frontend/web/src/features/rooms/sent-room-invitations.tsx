'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Stack, Text, UserItem } from '@components';
import type {
  ReceivedRoomInvitation,
  SentRoomInvitation,
} from '@/contracts/api/game-invitations/game-invitations.contracts';
import {
  fetchReceivedRoomInvitations,
  fetchSentRoomInvitations,
} from '@/features/game-invitations/game-invitations.client';
import {
  gameInvitationSocketEvents,
} from '@/contracts/sockets/friendships/friendships.schema';
import { friendsSocket } from '@/lib/sockets/friends-socket.client';

type RoomInvitationsProps = {
  roomId: number;
  teammateUsernames: Set<string>;
};

export function SentRoomInvitations({ roomId, teammateUsernames }: RoomInvitationsProps) {
  const t = useTranslations('pages.home.room');
  const [sent, setSent] = useState<SentRoomInvitation[]>([]);
  const [received, setReceived] = useState<ReceivedRoomInvitation[]>([]);

  const refresh = useCallback(() => {
    void fetchSentRoomInvitations(roomId).then((res) => {
      if (res.ok) setSent(res.data.invitations);
    });
    void fetchReceivedRoomInvitations(roomId).then((res) => {
      if (res.ok) setReceived(res.data.invitations);
    });
  }, [roomId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    friendsSocket.on(gameInvitationSocketEvents.updated, refresh);
    friendsSocket.on(gameInvitationSocketEvents.received, refresh);
    return () => {
      friendsSocket.off(gameInvitationSocketEvents.updated, refresh);
      friendsSocket.off(gameInvitationSocketEvents.received, refresh);
    };
  }, [refresh]);

  const filteredSent = sent.filter(
    (inv) => !teammateUsernames.has(inv.invitedUsername) && !inv.acceptedAt,
  );
  const filteredReceived = received.filter(
    (inv) => !teammateUsernames.has(inv.senderUsername) && !inv.acceptedAt,
  );

  const hasSent = filteredSent.length > 0;
  const hasReceived = filteredReceived.length > 0;

  if (!hasSent && !hasReceived) return null;

  return (
    <Stack gap="md">
      {hasSent && (
        <Stack gap="sm" as="section" aria-labelledby="sent-invitations-heading">
          <Text as="h3" variant="caption" color="secondary" id="sent-invitations-heading">
            {t('invitationsHeading')}
          </Text>
          <Stack gap="none">
            {filteredSent.map((inv) => (
              <UserItem
                key={inv.id}
                username={inv.invitedUsername}
                subtitle={inv.acceptedAt ? t('invitationAccepted') : t('invitationPending')}
              />
            ))}
          </Stack>
        </Stack>
      )}

      {hasReceived && (
        <Stack gap="sm" as="section" aria-labelledby="received-invitations-heading">
          <Text as="h3" variant="caption" color="secondary" id="received-invitations-heading">
            {t('receivedInvitationsHeading')}
          </Text>
          <Stack gap="none">
            {filteredReceived.map((inv) => (
              <UserItem
                key={inv.id}
                username={inv.senderUsername}
                subtitle={inv.acceptedAt ? t('invitationAccepted') : t('invitationPending')}
              />
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
