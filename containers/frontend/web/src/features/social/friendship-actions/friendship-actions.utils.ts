import type { FriendshipStatus } from './friendship-actions.types';

interface GetFriendshipStatusArgs {
  friend?: unknown;
  requestReceived?: unknown;
  requestSent?: unknown;
}

export function getFriendshipStatus({
  friend,
  requestReceived,
  requestSent,
}: GetFriendshipStatusArgs): FriendshipStatus {
  if (friend) return 'friend';
  if (requestReceived) return 'received';
  if (requestSent) return 'sent';

  return 'none';
}
