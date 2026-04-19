import type { Socket } from 'socket.io';

type SessionIdentityResponse = {
  ok: boolean;
  data?: {
    identityKey?: string;
    username?: string;
    isGuest?: boolean;
    userId?: string;
    guestId?: string;
  };
};

export type SocketIdentity = {
  identityKey: string;
  username: string;
  isGuest: boolean;
  userId?: string;
  guestId?: string;
};

const BACKEND_SESSION_IDENTITY_URL =
  process.env.BACKEND_SESSION_IDENTITY_URL ??
  process.env.BACKEND_SESSION_PROFILE_URL ??
  process.env.BACKEND_SESSION_URL ??
  'https://backend:4000/auth/session/identity';

async function resolveIdentityFromSessionCookie(
  cookieHeader: string,
): Promise<SocketIdentity | null> {
  const res = await fetch(BACKEND_SESSION_IDENTITY_URL, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Cookie: cookieHeader,
    },
    cache: 'no-store',
  });

  if (!res.ok) return null;

  const body = (await res.json().catch(() => null)) as SessionIdentityResponse | null;
  const identityKey = body?.data?.identityKey;
  const username = body?.data?.username;
  const isGuest = body?.data?.isGuest;
  const userId = body?.data?.userId;
  const guestId = body?.data?.guestId;

  if (typeof identityKey !== 'string' || identityKey.length === 0) return null;
  if (typeof username !== 'string' || username.length === 0) return null;
  if (typeof isGuest !== 'boolean') return null;

  return {
    identityKey,
    username,
    isGuest,
    ...(typeof userId === 'string' ? { userId } : {}),
    ...(typeof guestId === 'string' ? { guestId } : {}),
  };
}

export async function requireSessionSocketAuth(
  socket: Socket,
  next: (err?: Error) => void,
): Promise<void> {
  const cookieHeader = socket.handshake.headers.cookie;

  if (!cookieHeader) {
    next(new Error('AUTH_UNAUTHORIZED'));
    return;
  }

  try {
    const identity = await resolveIdentityFromSessionCookie(cookieHeader);

    if (!identity || identity.isGuest || !identity.userId) {
      next(new Error('AUTH_UNAUTHORIZED'));
      return;
    }

    socket.data.userId = identity.userId;
    socket.data.username = identity.username;
    socket.data.identityKey = identity.identityKey;
    socket.data.guestId = undefined;
    socket.data.isGuest = false;
    next();
  } catch (error) {
    console.error('[socket.auth] failed to validate session cookie', error);
    next(new Error('AUTH_UNAUTHORIZED'));
  }
}

export async function attachOptionalChatIdentity(
  socket: Socket,
  next: (err?: Error) => void,
): Promise<void> {
  const cookieHeader = socket.handshake.headers.cookie;

  if (!cookieHeader) {
    next(new Error('AUTH_UNAUTHORIZED'));
    return;
  }

  try {
    const identity = await resolveIdentityFromSessionCookie(cookieHeader);

    if (!identity) {
      next(new Error('AUTH_UNAUTHORIZED'));
      return;
    }

    socket.data.userId = identity.userId;
    socket.data.username = identity.username;
    socket.data.identityKey = identity.identityKey;
    socket.data.guestId = identity.guestId;
    socket.data.isGuest = identity.isGuest;
    next();
  } catch (error) {
    console.error('[socket.auth] optional identity resolution failed', error);
    next(new Error('AUTH_UNAUTHORIZED'));
  }
}
