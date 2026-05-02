import type {
  FriendPublic,
  FriendshipPublic,
} from '@/contracts/api/friendships/friendships.contracts';
import type {
  FriendAcceptedNotificationPayload,
  FriendRejectedNotificationPayload,
  FriendRequestNotificationPayload,
} from '@/contracts/sockets/friendships/friendships.schema';

import type { GroupedSearchResults, PendingListKey, SocialState } from './social-store.types';

type SetState = (
  partial: Partial<SocialState> | ((state: SocialState) => Partial<SocialState>),
) => void;

type SearchResultItem = GroupedSearchResults[keyof GroupedSearchResults][number];

export const emptyGroupedSearchResults = (): GroupedSearchResults => ({
  online: [],
  offline: [],
  requests: [],
  pending: [],
  none: [],
});

function updateResults(
  results: GroupedSearchResults,
  predicate: (item: SearchResultItem) => boolean,
  update: (item: SearchResultItem) => SearchResultItem,
): GroupedSearchResults {
  return {
    online: results.online.map((item) => (predicate(item) ? update(item) : item)),
    offline: results.offline.map((item) => (predicate(item) ? update(item) : item)),
    requests: results.requests.map((item) => (predicate(item) ? update(item) : item)),
    pending: results.pending.map((item) => (predicate(item) ? update(item) : item)),
    none: results.none.map((item) => (predicate(item) ? update(item) : item)),
  };
}

function addUniqueFriend(friends: FriendPublic[], friend: FriendPublic): FriendPublic[] {
  if (friends.some((item) => item.id === friend.id)) return friends;

  return [...friends, friend];
}

function addUniquePending(
  requests: FriendshipPublic[],
  friendship: FriendshipPublic,
): FriendshipPublic[] {
  if (requests.some((item) => item.id === friendship.id)) return requests;

  return [...requests, friendship];
}

function removePendingByFriendshipId(
  requests: FriendshipPublic[],
  friendshipId: string,
): FriendshipPublic[] {
  return requests.filter((item) => item.id !== friendshipId);
}

function removePendingByUserId(requests: FriendshipPublic[], userId: string): FriendshipPublic[] {
  return requests.filter((item) => item.userId !== userId);
}

function moveSearchResultPresence(
  results: GroupedSearchResults,
  userId: string,
  isOnline: boolean,
): GroupedSearchResults {
  const fromKey = isOnline ? 'offline' : 'online';
  const toKey = isOnline ? 'online' : 'offline';

  const item = results[fromKey].find((result) => result.id === userId);

  if (!item) return results;

  return {
    ...results,
    [fromKey]: results[fromKey].filter((result) => result.id !== userId),
    [toKey]: addUniqueSearchResult(results[toKey], item),
  };
}

function addUniqueSearchResult<T extends { id: string }>(items: T[], item: T): T[] {
  if (items.some((current) => current.id === item.id)) return items;

  return [...items, item];
}

function setFriendOnlineStatusReducer(
  userId: string,
  isOnline: boolean,
): (state: SocialState) => Partial<SocialState> {
  return (state) => ({
    friends: state.friends.map((friend) =>
      friend.id === userId ? { ...friend, isOnline } : friend,
    ),
    searchResults: moveSearchResultPresence(state.searchResults, userId, isOnline),
  });
}

function receiveFriendRequestReducer(
  payload: FriendRequestNotificationPayload,
): (state: SocialState) => Partial<SocialState> {
  return (state) => {
    const request: FriendshipPublic = {
      id: payload.friendshipId,
      userId: payload.senderId,
      username: payload.senderUsername,
      avatar: null,
      status: 'pending',
      isSender: false,
      createdAt: new Date().toISOString(),
    };

    return {
      pendingReceived: addUniquePending(state.pendingReceived, request),
      searchResults: updateResults(
        state.searchResults,
        (item) => item.id === payload.senderId,
        (item) => ({
          ...item,
          friendshipStatus: 'pending',
          friendshipId: payload.friendshipId,
          senderId: payload.senderId,
        }),
      ),
    };
  };
}

function findSearchResultByUserId(results: GroupedSearchResults, userId: string) {
  return [
    ...results.online,
    ...results.offline,
    ...results.requests,
    ...results.pending,
    ...results.none,
  ].find((item) => item.id === userId);
}

function receiveFriendAcceptedReducer(
  payload: FriendAcceptedNotificationPayload,
): (state: SocialState) => Partial<SocialState> {
  return (state) => {
    const pendingSent = state.pendingSent.find(
      (request) => request.userId === payload.friendUserId,
    );

    const pendingReceived = state.pendingReceived.find(
      (request) => request.userId === payload.friendUserId,
    );

    const existingFriend = state.friends.find((friend) => friend.id === payload.friendUserId);

    const existingSearchUser = findSearchResultByUserId(state.searchResults, payload.friendUserId);

    const newFriend: FriendPublic = {
      id: payload.friendUserId,
      username: payload.friendUsername,
      avatar: pendingSent?.avatar ?? pendingReceived?.avatar ?? existingSearchUser?.avatar ?? null,
      isOnline: existingFriend?.isOnline ?? false,
    };

    return {
      pendingSent: removePendingByUserId(state.pendingSent, payload.friendUserId),
      pendingReceived: removePendingByUserId(state.pendingReceived, payload.friendUserId),
      friends: addUniqueFriend(state.friends, newFriend),
      searchResults: updateResults(
        state.searchResults,
        (item) => item.id === payload.friendUserId,
        (item) => ({
          ...item,
          friendshipStatus: 'accepted',
          friendshipId:
            pendingSent?.id ??
            pendingReceived?.id ??
            item.friendshipId ??
            existingSearchUser?.friendshipId ??
            null,
          senderId: null,
        }),
      ),
    };
  };
}

function receiveFriendRejectedReducer(
  payload: FriendRejectedNotificationPayload,
): (state: SocialState) => Partial<SocialState> {
  return (state) => ({
    pendingSent: removePendingByFriendshipId(state.pendingSent, payload.friendshipId),
    pendingReceived: removePendingByFriendshipId(state.pendingReceived, payload.friendshipId),
    searchResults: updateResults(
      state.searchResults,
      (item) => item.friendshipId === payload.friendshipId,
      (item) => ({
        ...item,
        friendshipStatus: 'none',
        friendshipId: null,
        senderId: null,
      }),
    ),
  });
}

function removePendingByIdReducer(
  list: PendingListKey,
  id: string,
): (state: SocialState) => Partial<SocialState> {
  return (state) => ({
    [list]: state[list].filter((item) => item.id !== id),
    searchResults: updateResults(
      state.searchResults,
      (item) => item.friendshipId === id,
      (item) => ({
        ...item,
        friendshipStatus: 'none',
        friendshipId: null,
        senderId: null,
      }),
    ),
  });
}

function createFriendFromPendingRequest(request: FriendshipPublic): FriendPublic {
  return {
    id: request.userId,
    username: request.username,
    avatar: request.avatar,
    isOnline: false,
  };
}

function createFriendFromSearchItem(
  searchItem: GroupedSearchResults['requests'][number],
): FriendPublic {
  return {
    id: searchItem.id,
    username: searchItem.username,
    avatar: searchItem.avatar,
    isOnline: false,
  };
}

function markSearchFriendshipAccepted(
  results: GroupedSearchResults,
  friendshipId: string,
): GroupedSearchResults {
  return updateResults(
    results,
    (item) => item.friendshipId === friendshipId,
    (item) => ({
      ...item,
      friendshipStatus: 'accepted',
      friendshipId,
      senderId: null,
    }),
  );
}

function resolveAcceptedFriend(
  request: FriendshipPublic | undefined,
  searchItem: GroupedSearchResults['requests'][number] | undefined,
): FriendPublic | null {
  if (request) return createFriendFromPendingRequest(request);
  if (searchItem) return createFriendFromSearchItem(searchItem);

  return null;
}

function acceptPendingByIdReducer(id: string): (state: SocialState) => Partial<SocialState> {
  return (state) => {
    const request = state.pendingReceived.find((item) => item.id === id);
    const searchItem = state.searchResults.requests.find((item) => item.friendshipId === id);
    const newFriend = resolveAcceptedFriend(request, searchItem);

    if (!newFriend) return {};

    return {
      pendingReceived: removePendingByFriendshipId(state.pendingReceived, id),
      friends: addUniqueFriend(state.friends, newFriend),
      searchResults: markSearchFriendshipAccepted(state.searchResults, id),
    };
  };
}

function addPendingRequestReducer(
  friendship: FriendshipPublic,
  wasAutoAccepted?: boolean,
): (state: SocialState) => Partial<SocialState> {
  return (state) => {
    if (wasAutoAccepted || friendship.status === 'accepted') {
      const newFriend: FriendPublic = {
        id: friendship.userId,
        username: friendship.username,
        avatar: friendship.avatar,
        isOnline: false,
      };

      return {
        friends: addUniqueFriend(state.friends, newFriend),
        searchResults: updateResults(
          state.searchResults,
          (item) => item.id === friendship.userId,
          (item) => ({
            ...item,
            friendshipStatus: 'accepted',
            friendshipId: friendship.id,
            senderId: null,
          }),
        ),
      };
    }

    return {
      pendingSent: addUniquePending(state.pendingSent, friendship),
      searchResults: updateResults(
        state.searchResults,
        (item) => item.id === friendship.userId,
        (item) => ({
          ...item,
          friendshipStatus: 'pending',
          friendshipId: friendship.id,
          senderId: state.currentUserId,
        }),
      ),
    };
  };
}

export function createSocialActions(set: SetState) {
  return {
    setFriends: (friends: FriendPublic[]) => set({ friends }),

    setPendingReceived: (pendingReceived: FriendshipPublic[]) => set({ pendingReceived }),

    setPendingSent: (pendingSent: FriendshipPublic[]) => set({ pendingSent }),

    setSearchResults: (searchResults: GroupedSearchResults) => set({ searchResults }),

    setSearchQuery: (searchQuery: string) => set({ searchQuery }),

    setCurrentUserId: (currentUserId: string | null) => set({ currentUserId }),

    setFriendOnlineStatus: (userId: string, isOnline: boolean) =>
      set(setFriendOnlineStatusReducer(userId, isOnline)),

    receiveFriendRequest: (payload: FriendRequestNotificationPayload) =>
      set(receiveFriendRequestReducer(payload)),

    receiveFriendAccepted: (payload: FriendAcceptedNotificationPayload) =>
      set(receiveFriendAcceptedReducer(payload)),

    receiveFriendRejected: (payload: FriendRejectedNotificationPayload) =>
      set(receiveFriendRejectedReducer(payload)),

    removePendingById: (list: PendingListKey, id: string) =>
      set(removePendingByIdReducer(list, id)),

    acceptPendingById: (id: string) => set(acceptPendingByIdReducer(id)),

    addPendingRequest: (friendship: FriendshipPublic, wasAutoAccepted?: boolean) =>
      set(addPendingRequestReducer(friendship, wasAutoAccepted)),
  };
}
