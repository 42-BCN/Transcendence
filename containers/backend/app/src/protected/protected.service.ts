import argon2 from 'argon2';

import { ApiError } from '@shared';

import { hashPassword } from '@/auth/local/local.service';
import { updatePasswordHash } from '@/auth/local/local.repo';
import { findUserByIdWithPassword } from '@/auth/shared.repo';

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
