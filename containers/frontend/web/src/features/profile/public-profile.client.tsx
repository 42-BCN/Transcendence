'use client';

import { useTranslations } from 'next-intl';
import { Text, Stack, Button } from '@components';
import { useSocialStore } from '@/providers/social-provider';
import { sendFriendRequest, respondToRequest, deleteFriendship } from '../social/actions/friendships.actions';

interface PublicProfileClientProps {
  userId: string;
  bio: string | null;
}

export function PublicProfileClient({ userId, bio }: PublicProfileClientProps) {
  const t = useTranslations('features.profile');
  const { friends, pendingReceived, pendingSent, removeFriendById, removePendingById, addPendingRequest, acceptPendingById } = useSocialStore((s) => s);

  const friend = friends.find((f) => f.id === userId);
  const requestReceived = pendingReceived.find((r) => r.userId === userId);
  const requestSent = pendingSent.find((r) => r.userId === userId);

  // Mapeo de acciones según el estatus
  const getActionsConfig = () => {
    const deleteStyle = 'border-slate-500 text-slate-500';

    if (friend) return [
      { label: t('message'), onClick: () => {}, variant: 'cta' },
      { label: t('unfriend'), onClick: () => deleteFriendship(friend.id).then(() => removeFriendById(friend.id)), className: deleteStyle }
    ];
    if (requestReceived) return [
      { label: t('accept'), onClick: () => respondToRequest(requestReceived.id, 'accept').then(() => acceptPendingById(requestReceived.id)), variant: 'cta' },
      { label: t('reject'), onClick: () => respondToRequest(requestReceived.id, 'reject').then(() => removePendingById('pendingReceived', requestReceived.id)), className: deleteStyle }
    ];
    if (requestSent) return [
      { label: t('cancel_request'), onClick: () => deleteFriendship(requestSent.id).then(() => removePendingById('pendingSent', requestSent.id)), className: deleteStyle }
    ];
    return [
      { label: t('add_friend'), onClick: () => sendFriendRequest(userId).then((res: any) => res.ok && addPendingRequest(res.data.friendship)), variant: 'cta' }
    ];
  };

  return (
    <Stack className="h-full" gap="md">
      <div className="flex-1">
        <Text as="h3" variant="body-xs" className="text-text-secondary">
          {t('bio')}
        </Text>
        <Text variant="body-sm">{bio || 'no-bio'}</Text>
      </div>

      <Stack gap="sm">
        {getActionsConfig().map((action, i) => (
          <Button 
            key={i} 
            variant={action.variant as any} 
            onPress={action.onClick} 
            className={`w-full ${action.className || ''}`}
          >
            {action.label}
          </Button>
        ))}
      </Stack>
    </Stack>
  );
}
