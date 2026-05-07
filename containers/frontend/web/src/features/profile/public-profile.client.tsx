'use client';

import { useTranslations } from 'next-intl';
import { Text, Stack, Button } from '@components';
import { useSocialStore } from '@/providers/social-provider';
import { sendFriendRequest, respondToRequest, deleteFriendship } from '../social/actions/friendships.actions';

interface PublicProfileClientProps {
  userId: string;
  bio: string | null;
}

interface ProfileAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'cta' | 'danger';
  className?: string;
}

export function PublicProfileClient({ userId, bio }: PublicProfileClientProps) {
  const t = useTranslations('features.profile');
  const {
    friends,
    pendingReceived,
    pendingSent,
    removeFriendById,
    removePendingById,
    addPendingRequest,
    acceptPendingById,
  } = useSocialStore((s) => s);

  const friend = friends.find((item) => item.id === userId);
  const requestReceived = pendingReceived.find((item) => item.userId === userId);
  const requestSent = pendingSent.find((item) => item.userId === userId);

  const deleteStyle = 'border-slate-500 text-slate-500';

  const getActionsConfig = (): ProfileAction[] => {
    if (friend)
      return [
        { label: t('message'), onClick: () => {}, variant: 'cta' },
        {
          label: t('unfriend'),
          onClick: () =>
            deleteFriendship(friend.id).then((result) => result.ok && removeFriendById(friend.id)),
          className: deleteStyle,
        },
      ];

    if (requestReceived)
      return [
        {
          label: t('accept'),
          onClick: () =>
            respondToRequest(requestReceived.id, 'accept').then(
              (result) => result.ok && acceptPendingById(requestReceived.id),
            ),
          variant: 'cta',
        },
        {
          label: t('reject'),
          onClick: () =>
            respondToRequest(requestReceived.id, 'reject').then(
              (result) => result.ok && removePendingById('pendingReceived', requestReceived.id),
            ),
          className: deleteStyle,
        },
      ];

    if (requestSent)
      return [
        {
          label: t('cancelRequest'),
          onClick: () =>
            deleteFriendship(requestSent.id).then(
              (result) => result.ok && removePendingById('pendingSent', requestSent.id),
            ),
          className: deleteStyle,
        },
      ];

    return [
      {
        label: t('addFriend'),
        onClick: () =>
          sendFriendRequest(userId).then((result) => {
            if (result.ok) {
              addPendingRequest(result.data.friendship, result.data.wasAutoAccepted);
            }
          }),
        variant: 'cta',
      },
    ];
  };

  const actions = getActionsConfig();

  return (
    <Stack className="h-full" gap="md">
      <div className="flex-1">
        <Text as="h3" variant="body-xs" className="text-text-secondary">
          {t('bio')}
        </Text>
        <Text variant="body-sm">{bio || t('emptyBio')}</Text>
      </div>

      <Stack gap="sm">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant}
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
