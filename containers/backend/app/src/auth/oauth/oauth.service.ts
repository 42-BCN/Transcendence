import type { Profile } from 'passport';

import type { AuthUser } from '@contracts/auth/auth.contract';
import { normalizeEmail } from '@contracts/auth/auth.validation';
import { ApiError, generateUsername } from '@shared';

import { toAuthUser } from '../auth.model';
import * as OauthRepo from './oauth.repo';
import * as SharedRepo from '../shared.repo';

function rejectBlockedUser(isBlocked: boolean): void {
  if (isBlocked) throw new ApiError('AUTH_FORBIDDEN');
}

function getUserProfile(profile: Profile) {
  const googleId = profile.id;
  const email = profile.emails?.[0]?.value;
  const username = generateUsername();
  return {
    googleId,
    email: email ? normalizeEmail(email) : undefined,
    username,
  };
}

export async function findOrCreateGoogleUser(profile: Profile): Promise<AuthUser> {
  const { googleId, email, username } = getUserProfile(profile);

  if (!email) throw new ApiError('AUTH_EMAIL_NOT_VERIFIED');

  const byGoogle = await OauthRepo.findUserByGoogleId(googleId);
  if (byGoogle) {
    rejectBlockedUser(byGoogle.isBlocked);
    return toAuthUser(byGoogle);
  }

  const byEmail = await SharedRepo.findUserByEmail(email);
  if (byEmail) {
    rejectBlockedUser(byEmail.isBlocked);
    const linked = await OauthRepo.linkGoogleIdToEmailUser({ email, googleId });
    rejectBlockedUser(linked.isBlocked);
    return toAuthUser(linked);
  }

  const created = await OauthRepo.insertGoogleUser({ email, googleId, username });
  return toAuthUser(created);
}
