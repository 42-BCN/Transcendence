import type { IconName } from '@components/primitives/icon';
import type { FriendshipActionKey } from './friendship-actions.types';

/**
 * Strictly typed icon mapping for friendship actions.
 * Each key is guaranteed to map to a valid IconName.
 */
export const iconByAction: Record<FriendshipActionKey, IconName> = {
  message: 'messages',
  addFriend: 'userAdd',
  acceptRequest: 'check',
  rejectRequest: 'close',
  cancelRequest: 'close',
  deleteFriend: 'trash',
};
