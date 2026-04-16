import type { Request, Response } from 'express';
import { randomUUID } from 'crypto';

import type { LoginRes, SignupRes } from '@contracts/auth/auth.contract';
import { AUTH_ERRORS, type AuthErrorName } from '@contracts/auth/auth.errors';
import type { SignupReq, LoginReq } from '@contracts/auth/auth.validation';
import { HttpStatus, HttpStatusCode } from '@contracts/http';

import { normalizeEmailLocale } from '../mail';
import * as SharedRepo from '../shared.repo';
import * as Service from './local.service';

function errorStatus(code: AuthErrorName): number {
  return AUTH_ERRORS[code] ?? HttpStatus.INTERNAL_SERVER_ERROR;
}

function sendError<TResponse>(res: Response<TResponse>, code: AuthErrorName): void {
  res.status(errorStatus(code)).json({
    ok: false,
    error: { code },
  } as TResponse);
}

function sendOk<TResponse>(
  res: Response<TResponse>,
  data: TResponse extends { data: infer TData } ? TData : unknown,
  code: HttpStatusCode,
): void {
  res.status(code).json({
    ok: true,
    data,
  } as TResponse);
}

type SessionIdentityData = {
  identityKey: string;
  username: string;
  isGuest: boolean;
  userId?: string;
  guestId?: string;
};

type SessionIdentityRes = {
  ok: boolean;
  data?: SessionIdentityData;
  error?: { code: AuthErrorName };
};

type GuestSessionReq = {
  guestId?: string;
};

function sanitizeGuestId(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const cleaned = raw.trim().toLowerCase();
  if (!/^[a-z0-9_-]{8,64}$/.test(cleaned)) return null;
  return cleaned;
}

function toGuestUsername(guestId: string): string {
  return `guest-${guestId.slice(0, 8)}`;
}

function newGuestId(): string {
  return randomUUID().replaceAll('-', '').slice(0, 24);
}

function guestIdentity(guestId: string, guestUsername: string): SessionIdentityData {
  return {
    identityKey: `guest:${guestId}`,
    username: guestUsername,
    isGuest: true,
    guestId,
  };
}

export async function postSignup(
  req: Request<unknown, unknown, SignupReq>,
  res: Response<SignupRes>,
): Promise<void> {
  const locale = normalizeEmailLocale(req.headers['accept-language']?.toString());
  const result = await Service.signup(req.body, locale);
  sendOk(res, { user: result }, 200);
}

export async function postLogin(
  req: Request<unknown, unknown, LoginReq>,
  res: Response<LoginRes>,
): Promise<void> {
  const result = await Service.login(req.body);

  req.session.regenerate((err) => {
    if (err) return sendError(res, 'AUTH_INTERNAL_ERROR');
    req.session.userId = result.id;
    req.session.guestId = undefined;
    req.session.guestUsername = undefined;
    req.session.save((saveErr) => {
      if (saveErr) return sendError(res, 'AUTH_INTERNAL_ERROR');
      sendOk(res, { user: result }, 200);
    });
  });
}

export async function postGuestSession(
  req: Request<unknown, unknown, GuestSessionReq>,
  res: Response<SessionIdentityRes>,
): Promise<void> {
  if (req.session.userId) {
    const user = await SharedRepo.findUserById(req.session.userId);
    if (!user) {
      sendError(res, 'AUTH_UNAUTHORIZED');
      return;
    }

    sendOk(
      res,
      {
        identityKey: `user:${user.id}`,
        username: user.username,
        isGuest: false,
        userId: user.id,
      },
      200,
    );
    return;
  }

  const requestedGuestId = sanitizeGuestId(req.body?.guestId);
  const guestId = requestedGuestId ?? req.session.guestId ?? newGuestId();
  const guestUsername = req.session.guestUsername ?? toGuestUsername(guestId);

  req.session.guestId = guestId;
  req.session.guestUsername = guestUsername;

  req.session.save((err) => {
    if (err) {
      sendError(res, 'AUTH_INTERNAL_ERROR');
      return;
    }

    sendOk(res, guestIdentity(guestId, guestUsername), 200);
  });
}

export async function getSessionIdentity(
  req: Request,
  res: Response<SessionIdentityRes>,
): Promise<void> {
  if (req.session.userId) {
    const user = await SharedRepo.findUserById(req.session.userId);
    if (!user) {
      sendError(res, 'AUTH_UNAUTHORIZED');
      return;
    }

    sendOk(
      res,
      {
        identityKey: `user:${user.id}`,
        username: user.username,
        isGuest: false,
        userId: user.id,
      },
      200,
    );
    return;
  }

  if (!req.session.guestId) {
    sendError(res, 'AUTH_UNAUTHORIZED');
    return;
  }

  const guestId = req.session.guestId;
  const guestUsername = req.session.guestUsername ?? toGuestUsername(guestId);

  if (!req.session.guestUsername) {
    req.session.guestUsername = guestUsername;
  }

  sendOk(res, guestIdentity(guestId, guestUsername), 200);
}

export function postLogout(req: Request, res: Response): void {
  req.session.destroy((err) => {
    if (err) return sendError(res, 'AUTH_INTERNAL_ERROR');

    res.clearCookie('sid', {
      path: '/',
      sameSite: 'lax',
    });

    sendOk(res, null, 200);
  });
}
