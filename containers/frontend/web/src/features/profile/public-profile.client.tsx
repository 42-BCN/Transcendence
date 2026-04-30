'use client';
import { useTranslations } from 'next-intl';

import { Text, Stack } from '@components';
import { useSocialStore } from '../social/store/social-store.provider';
import { InviteActionButton } from '../social/social-variants/invite-action-button';
import { AcceptActionButton } from '../social/social-variants/accept-action-button';
import { RejectActionButton } from '../social/social-variants/reject-action-button';
import { OnlineButtons } from '../social/social-variants/online-buttons';
import { OfflineButtons } from '../social/social-variants/offline-buttons';
import { UnfriendActionButton } from '../social/social-variants/unfriend-action-button';

interface PublicProfileClientProps {
  userId: string;
  bio: string | null;
  username: string;
}

export function PublicProfileClient({ userId, username, bio }: PublicProfileClientProps) {
  const t = useTranslations('features.profile');
  const friends = useSocialStore((s) => s.friends);
  const pendingReceived = useSocialStore((s) => s.pendingReceived);
  const pendingSent = useSocialStore((s) => s.pendingSent);

  // Relationship logic
  const friend = friends.find((f) => f.id === userId);
  const requestReceived = pendingReceived.find((r) => r.userId === userId);
  const requestSent = pendingSent.find((r) => r.userId === userId);

  return (
    <Stack className="flex-1" gap="md">
      {/* Action Area */}
      <Stack gap="sm">
        {friend && (
          <Stack gap="sm">
            <Text variant="body-xs" className="text-text-secondary">
              Amistad
            </Text>
            <Stack direction="horizontal" gap="regular">
              {friend.isOnline ? (
                <OnlineButtons username={username} userId={userId} />
              ) : (
                <OfflineButtons userId={userId} />
              )}
              <UnfriendActionButton friendshipId={friend.id} />
            </Stack>
          </Stack>
        )}

        {requestReceived && (
          <Stack gap="sm">
            <Text variant="body-xs" className="text-text-secondary">
              Solicitud recibida
            </Text>
            <Stack direction="horizontal" gap="regular">
              <AcceptActionButton friendshipId={requestReceived.id} />
              <RejectActionButton friendshipId={requestReceived.id} type="pendingReceived" />
            </Stack>
          </Stack>
        )}

        {requestSent && (
          <Stack gap="sm">
            <Text variant="body-xs" className="text-text-secondary">
              Solicitud enviada
            </Text>
            <Stack direction="horizontal" gap="regular">
              <RejectActionButton friendshipId={requestSent.id} type="pendingSent" />
            </Stack>
          </Stack>
        )}

        {!friend && !requestReceived && !requestSent && (
          <Stack gap="sm">
            <Text variant="body-xs" className="text-text-secondary">
              Añadir amistad
            </Text>
            <Stack direction="horizontal" gap="regular">
              <InviteActionButton userId={userId} />
            </Stack>
          </Stack>
        )}
      </Stack>

      <Stack gap="xs">
        <Text as="h3" variant="body-xs" className="text-text-secondary">
          {t('bio')}
        </Text>
        <Text variant="body-sm">{bio || 'no-bio'}</Text>
      </Stack>
    </Stack>
  );
}
