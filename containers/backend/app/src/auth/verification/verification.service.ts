import { createHash } from 'node:crypto';

import type { AuthUser } from '@contracts/auth/auth.contract';
import { ApiError } from '@shared';

import { toAuthUser } from '../auth.model';
import * as VerificationRepo from './verification.repo';

export { resendVerification } from './resend.service';

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

// TODO could use the detailed response from repe for better error handling (e.g. distinguish between invalid and expired token)
export async function verifyEmailByToken(token: string): Promise<AuthUser> {
  const now = new Date();
  const result = await VerificationRepo.consumeEmailVerificationToken(hashToken(token), now);
  if (!result.ok) throw new ApiError('AUTH_TOKEN_EXPIRED');
  if (result.user.isBlocked) throw new ApiError('AUTH_FORBIDDEN');
  return toAuthUser(result.user);
}
