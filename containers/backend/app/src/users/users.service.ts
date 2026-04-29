import type { UserMeProfile, UserPublic, SearchUserResult } from '@contracts/users/users.contracts';
import { ApiError } from '@shared';

import {
  listUsers,
  selectUserData,
  selectUserDataByUsername,
  selectUserMeProfileData,
  searchUsersByUsername,
  countSearchUsersByUsername,
} from './users.repo';
import { findFriendshipsByUserPairs } from '../friendships/friendships.repo';

type getUsersProps = {
  limit: number;
  offset: number;
};

export async function getUsers(args: getUsersProps): Promise<UserPublic[]> {
  const { limit, offset } = args;
  const data = await listUsers(limit, offset);
  return data;
}

export async function findUserById(id: string): Promise<UserPublic> {
  const data = await selectUserData(id);
  if (!data) throw new ApiError('USER_NOT_FOUND');
  return data;
}

export async function userByUsername(username: string): Promise<UserPublic> {
  const data = await selectUserDataByUsername(username);
  if (!data) throw new ApiError('USER_NOT_FOUND');
  return data;
}

export async function findUserMeProfileById(id: string): Promise<UserMeProfile> {
  const data = await selectUserMeProfileData(id);
  if (!data) throw new ApiError('USER_NOT_FOUND');
  return data;
}

export async function searchUsers(
  query: string,
  limit: number,
  offset: number,
  currentUserId: string,
): Promise<SearchUsersOk> {
  const [users, total] = await Promise.all([
    searchUsersByUsername(query, limit, offset, currentUserId),
    countSearchUsersByUsername(query, currentUserId),
  ]);

  if (users.length === 0) {
    return {
      users: [],
      meta: { total, limit, offset, hasMore: false },
    };
  }

  const otherUserIds = users.map((u) => u.id);
  const friendshipMap = await findFriendshipsByUserPairs(currentUserId, otherUserIds);

  const mappedUsers: SearchUserResult[] = users.map((u) => {
    const friendship = friendshipMap.get(u.id);
    return {
      id: u.id,
      username: u.username,
      avatar: u.avatar,
      friendshipStatus: friendship ? friendship.status : 'none',
      senderId: friendship ? friendship.senderId : null,
      friendshipId: friendship ? friendship.id : null,
    };
  });

  return {
    users: mappedUsers,
    meta: {
      total,
      limit,
      offset,
      hasMore: offset + users.length < total,
    },
  };
}
