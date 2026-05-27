import {
  deleteFriendship,
  respondToRequest,
  sendFriendRequest,
} from '../actions/friendships.actions';

import type {
  FriendshipActionHandlers,
  FriendshipActionHandlersArgs,
} from './friendship-actions.types';

type ActionResult = {
  ok: boolean;
  error?: { code: string };
};

async function runAction({
  action,
  onSuccess,
  setError,
}: {
  action: () => Promise<ActionResult>;
  onSuccess?: () => void;
  setError: FriendshipActionHandlersArgs['setError'];
}) {
  setError();

  const result = await action();

  if (!result.ok) {
    setError({ code: result.error?.code ?? 'FETCH_FAILED' });
    return;
  }

  onSuccess?.();
}

function handleDeleteFriend(args: FriendshipActionHandlersArgs) {
  const friendId = args.friend?.id;

  return async () => {
    if (!friendId) return;

    await runAction({
      action: () => deleteFriendship(friendId),
      onSuccess: () => args.removeFriendById(friendId),
      setError: args.setError,
    });
  };
}

function handleAcceptRequest(args: FriendshipActionHandlersArgs) {
  const receivedId = args.requestReceived?.id;

  return async () => {
    if (!receivedId) return;

    await runAction({
      action: () => respondToRequest(receivedId, 'accept'),
      onSuccess: () => args.acceptPendingById(receivedId),
      setError: args.setError,
    });
  };
}

function handleRejectRequest(args: FriendshipActionHandlersArgs) {
  const receivedId = args.requestReceived?.id;

  return async () => {
    if (!receivedId) return;

    await runAction({
      action: () => respondToRequest(receivedId, 'reject'),
      onSuccess: () => args.removePendingById('pendingReceived', receivedId),
      setError: args.setError,
    });
  };
}

function handleCancelRequest(args: FriendshipActionHandlersArgs) {
  const sentId = args.requestSent?.id;

  return async () => {
    if (!sentId) return;

    await runAction({
      action: () => deleteFriendship(sentId),
      onSuccess: () => args.removePendingById('pendingSent', sentId),
      setError: args.setError,
    });
  };
}

function handleAddFriend(args: FriendshipActionHandlersArgs) {
  return async () => {
    args.setError();

    const result = await sendFriendRequest(args.userId);

    if (!result.ok) {
      args.setError({ code: result.error?.code ?? 'FETCH_FAILED' });
      return;
    }

    args.addPendingRequest(result.data.friendship, result.data.wasAutoAccepted);
  };
}

export function createFriendshipActionHandlers(
  args: FriendshipActionHandlersArgs,
): FriendshipActionHandlers {
  return {
    handleDeleteFriend: handleDeleteFriend(args),
    handleAcceptRequest: handleAcceptRequest(args),
    handleRejectRequest: handleRejectRequest(args),
    handleCancelRequest: handleCancelRequest(args),
    handleAddFriend: handleAddFriend(args),
  };
}
