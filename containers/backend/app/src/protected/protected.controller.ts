import type { Request, Response } from 'express';
import type { DeleteMeRes } from '@contracts/auth/auth.contract';
import type { UserMeProfileResponse } from '@contracts/users/users.contracts';
import type { UpdateMeProfileReq } from '@contracts/users/users.validation';
import { sendError } from '@shared';

import { getAuthCookieSameSite } from '@/auth/auth.cookies';
import { findUserMeProfileById } from '@/users/users.service';

import * as Service from './protected.service';

export async function getMeProfile(
  req: Request,
  res: Response<UserMeProfileResponse>,
): Promise<void> {
  const userId = req.session.userId as string; // guaranteed by requireAuth
  const me = await findUserMeProfileById(userId);
  res.status(200).json({
    ok: true,
    data: me,
  });
}

export async function postMeResetPassword(
  req: Request<unknown, unknown, { currentPassword: string; newPassword: string }>,
  res: Response<{ ok: true; data: null }>,
): Promise<void> {
  const userId = req.session.userId as string; // guaranteed by requireAuth

  await Service.resetPasswordForMe({
    userId,
    currentPassword: req.body.currentPassword,
    newPassword: req.body.newPassword,
  });

  res.status(200).json({
    ok: true,
    data: null,
  });
}

export async function putMeProfile(
  req: Request<unknown, unknown, UpdateMeProfileReq>,
  res: Response<UserMeProfileResponse>,
): Promise<void> {
  const userId = req.session.userId as string; // guaranteed by requireAuth

  const profile = await Service.updateBioForMe({
    userId,
    bio: req.body.bio,
  });

  res.status(200).json({
    ok: true,
    data: profile,
  });
}

export async function deleteMe(req: Request, res: Response<DeleteMeRes>): Promise<void> {
  const userId = req.session.userId as string; // guaranteed by requireAuth

  await Service.deleteAccountForMe(userId);

  req.session.destroy((err) => {
    if (err) {
      sendError(res, 'AUTH_INTERNAL_ERROR');
      return;
    }

    res.clearCookie('sid', {
      path: '/',
      sameSite: getAuthCookieSameSite(),
    });

    res.status(200).json({
      ok: true,
      data: null,
    });
  });
}
