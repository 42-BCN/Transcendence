import type { Socket } from 'socket.io';

type SessionIdentityResponse = {
  ok: boolean;
  data?: {
    identityKey?: string;
    sessionId?: string;
    username?: string;
    isGuest?: boolean;
    userId?: string;
    guestId?: string;
    previousGuestId?: string;
  };
};

type RawSessionIdentity = NonNullable<SessionIdentityResponse['data']>;

export type SocketIdentity = {
  identityKey: string;
  sessionId: string;
  username: string;
  isGuest: boolean;
  userId?: string;
  guestId?: string;
  previousGuestId?: string;
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
  return toSocketIdentity(body?.data);
}

function toOptionalString(value: unknown) {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function toRequiredString(value: unknown) {
  const nextValue = toOptionalString(value);
  return nextValue ?? null;
}

function getIdentityKeyAndUsername(identity: RawSessionIdentity | undefined) {
  const identityKey = toRequiredString(identity?.identityKey);
  const sessionId = toRequiredString(identity?.sessionId);
  const username = toRequiredString(identity?.username);

  if (!identityKey || !sessionId || !username) {
    return null;
  }

  return { identityKey, sessionId, username };
}

function getRequiredIdentityFields(identity: RawSessionIdentity | undefined) {
  const baseIdentity = getIdentityKeyAndUsername(identity);
  const isGuest = identity?.isGuest;

  if (!baseIdentity || typeof isGuest !== 'boolean') {
    return null;
  }

  return { ...baseIdentity, isGuest };
}

function getOptionalIdentityFields(identity: RawSessionIdentity) {
  const userId = toOptionalString(identity.userId);
  const guestId = toOptionalString(identity.guestId);
  const previousGuestId = toOptionalString(identity.previousGuestId);

  return { userId, guestId, previousGuestId };
}

function buildSocketIdentity(
  requiredFields: NonNullable<ReturnType<typeof getRequiredIdentityFields>>,
  optionalFields: ReturnType<typeof getOptionalIdentityFields>,
): SocketIdentity {
  return {
    identityKey: requiredFields.identityKey,
    sessionId: requiredFields.sessionId,
    username: requiredFields.username,
    isGuest: requiredFields.isGuest,
    ...(optionalFields.userId ? { userId: optionalFields.userId } : {}),
    ...(optionalFields.guestId ? { guestId: optionalFields.guestId } : {}),
    ...(optionalFields.previousGuestId
      ? { previousGuestId: optionalFields.previousGuestId }
      : {}),
  };
}

function toSocketIdentity(identity: RawSessionIdentity | undefined): SocketIdentity | null {
  const requiredFields = getRequiredIdentityFields(identity);
  if (!requiredFields || !identity) {
    return null;
  }

  const optionalFields = getOptionalIdentityFields(identity);
  return buildSocketIdentity(requiredFields, optionalFields);
}

function applySocketIdentity(socket: Socket, identity: SocketIdentity) {
  socket.data.userId = identity.userId;
  socket.data.username = identity.username;
  socket.data.identityKey = identity.identityKey;
  socket.data.sessionId = identity.sessionId;
  socket.data.guestId = identity.guestId;
  socket.data.previousGuestId = identity.previousGuestId;
  socket.data.isGuest = identity.isGuest;
}

function isAuthenticatedSocketIdentity(identity: SocketIdentity | null): identity is SocketIdentity & { userId: string } {
  return Boolean(identity && identity.isGuest === false && identity.userId);
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
    if (!isAuthenticatedSocketIdentity(identity)) {
      return next(new Error('AUTH_UNAUTHORIZED'));
    }

    applySocketIdentity(socket, identity);
    socket.data.guestId = undefined;
    socket.data.isGuest = false;
    return next();
  } catch (error) {
    console.error('[socket.auth] failed to validate session cookie', error);
    return next(new Error('AUTH_UNAUTHORIZED'));
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

    applySocketIdentity(socket, identity);
    next();
  } catch (error) {
    console.error('[socket.auth] optional identity resolution failed', error);
    next(new Error('AUTH_UNAUTHORIZED'));
  }
}
