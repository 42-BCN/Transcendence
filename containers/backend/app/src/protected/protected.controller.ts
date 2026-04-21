import type { Request, Response } from 'express';

import { findUserMeProfileById } from '@/users/users.service';

import * as Service from './protected.service';

export async function getMeProfile(
  req: Request,
  res: Response<{
    ok: true;
    data: {
      id: string;
      username: string;
      avatar: string | null;
      bio: string;
      provider: 'local' | 'google';
    };
  }>,
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
