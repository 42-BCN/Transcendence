import argon2 from 'argon2';

import { ApiError } from '@shared';
import type { UserMeProfile } from '@contracts/users/users.contracts';

import { hashPassword } from '@/auth/local/local.service';
import { findUserByIdWithPassword, findUserById } from '@/auth/shared.repo';
import { updatePasswordHash } from '@/auth/local/local.repo';
import { deleteUserById, updateUserBio } from '@/users/users.repo';

export async function resetPasswordForMe(input: {
  userId: string;
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  const user = await findUserByIdWithPassword(input.userId);

  if (!user) throw new ApiError('AUTH_UNAUTHORIZED');
  if (user.isBlocked) throw new ApiError('AUTH_FORBIDDEN');
  if (user.provider !== 'local' || !user.passwordHash) throw new ApiError('AUTH_FORBIDDEN');

  const currentPasswordMatches = await argon2
    .verify(user.passwordHash, input.currentPassword)
    .catch(() => false);

  if (!currentPasswordMatches) throw new ApiError('AUTH_INVALID_CREDENTIALS');

  const passwordHash = await hashPassword(input.newPassword);
  await updatePasswordHash(user.id, passwordHash);
}

export async function updateBioForMe(input: {
  userId: string;
  bio: string;
}): Promise<UserMeProfile> {
  const profile = await updateUserBio(input.userId, input.bio);

  if (!profile) throw new ApiError('USER_NOT_FOUND');

  return profile;
}

export async function deleteAccountForMe(userId: string): Promise<void> {
  const user = await findUserById(userId);

  if (!user) throw new ApiError('AUTH_UNAUTHORIZED');

  const deleted = await deleteUserById(userId);

  if (!deleted) throw new ApiError('AUTH_UNAUTHORIZED');
}
