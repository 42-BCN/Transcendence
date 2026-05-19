import type {
  CreateFriendshipActionsArgs,
  FriendshipAction,
  FriendshipStatus,
} from './friendship-actions.types';

export function createFriendshipActions({
  userId,
  status,
  t,
  handlers,
  error,
}: CreateFriendshipActionsArgs): FriendshipAction[] {
  const actionsByStatus: Record<FriendshipStatus, FriendshipAction[]> = {
    friend: [
      {
        key: 'message',
        type: 'link',
        label: t('message'),
        href: `/messages/${userId}`,
      },
      {
        key: 'deleteFriend',
        type: 'button',
        label: t('unfriend'),
        onPress: handlers.handleDeleteFriend,
        error,
      },
    ],
    received: [
      {
        key: 'rejectRequest',
        type: 'button',
        label: t('reject'),
        onPress: handlers.handleRejectRequest,
        error,
      },
      {
        key: 'acceptRequest',
        type: 'button',
        label: t('accept'),
        onPress: handlers.handleAcceptRequest,
        error,
      },
    ],
    sent: [
      {
        key: 'cancelRequest',
        type: 'button',
        label: t('cancelRequest'),
        onPress: handlers.handleCancelRequest,
        error,
      },
    ],
    none: [
      {
        key: 'addFriend',
        type: 'button',
        label: t('addFriend'),
        onPress: handlers.handleAddFriend,
        error,
      },
    ],
  };

  return actionsByStatus[status];
}
