/* eslint-disable no-console */

const DEFAULT_BASE_URLS = [
  'https://127.0.0.1:8443/api',
  'https://localhost:8443/api',
  'https://127.0.0.1:4000',
] as const;

const SENDER_EMAIL = process.env.FRIENDS_ACCEPT_SENDER_EMAIL ?? 'mfontser@fakemail.com';
const RECEIVER_EMAIL = process.env.FRIENDS_ACCEPT_RECEIVER_EMAIL ?? 'capapes@fakemail.com';
const PASSWORD = process.env.FRIENDS_ACCEPT_PASSWORD ?? 'Password123!';

type ApiResponse<T> = { ok: true; data: T } | { ok: false; error?: { code?: string } };

type LoginOk = {
  user: {
    id: string;
    email: string;
    username: string;
  };
};

type FriendshipRow = {
  id: string;
  friendUserId: string;
  friendUsername: string;
  status: 'pending' | 'accepted';
};

type FriendsDetailedOk = {
  friendships: FriendshipRow[];
};

type PendingRequestsOk = {
  requests: FriendshipRow[];
};

type SendFriendRequestOk = {
  friendship: {
    id: string;
    status: 'pending' | 'accepted';
  };
  wasAutoAccepted: boolean;
};

class Client {
  #cookie = '';
  readonly #baseUrl: string;

  constructor(baseUrl: string) {
    this.#baseUrl = baseUrl.replace(/\/$/, '');
  }

  async request<T>(
    path: string,
    options: { method?: string; body?: unknown; okStatuses?: number[] } = {},
  ): Promise<T> {
    const { method = 'GET', body, okStatuses = [200, 201] } = options;
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };

    if (this.#cookie) headers.Cookie = this.#cookie;
    if (body !== undefined) headers['Content-Type'] = 'application/json';

    let response: Response;

    try {
      response = await fetch(`${this.#baseUrl}${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    } catch (error) {
      const detail =
        error instanceof Error
          ? [error.message, error.cause instanceof Error ? error.cause.message : '']
              .filter(Boolean)
              .join(' | ')
          : String(error);

      throw new Error(`fetch ${method} ${this.#baseUrl}${path} failed: ${detail}`);
    }

    const setCookies =
      typeof response.headers.getSetCookie === 'function'
        ? response.headers.getSetCookie()
        : response.headers.get('set-cookie')
          ? [response.headers.get('set-cookie')]
          : [];

    if (setCookies.length > 0) {
      this.#cookie = setCookies.map((cookie) => cookie.split(';')[0]).join('; ');
    }

    const text = await response.text();
    const json = text ? (JSON.parse(text) as T) : ({} as T);

    if (!okStatuses.includes(response.status)) {
      throw new Error(`${method} ${path} -> ${response.status}: ${text}`);
    }

    return json;
  }
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

async function login(client: Client, email: string): Promise<LoginOk['user']> {
  const response = await client.request<ApiResponse<LoginOk>>('/auth/login', {
    method: 'POST',
    body: {
      identifier: email,
      password: PASSWORD,
    },
  });

  assert(response.ok === true, `login failed for ${email}`);
  return response.data.user;
}

async function chooseBaseUrl(): Promise<string> {
  const candidates = [
    ...(process.env.BASE_URL ? [process.env.BASE_URL] : []),
    ...DEFAULT_BASE_URLS,
  ].map((url) => url.replace(/\/$/, ''));

  for (const candidate of candidates) {
    try {
      const response = await fetch(`${candidate}/health`);

      if (response.ok) {
        return candidate;
      }
    } catch {
      continue;
    }
  }

  return candidates[0];
}

async function cleanupRelationship(
  sender: Client,
  receiver: Client,
  senderId: string,
  receiverId: string,
): Promise<void> {
  const receiverDetailed = await receiver.request<ApiResponse<FriendsDetailedOk>>('/friends/detailed');
  assert(receiverDetailed.ok === true, 'receiver detailed friendships failed');
  const acceptedForReceiver = receiverDetailed.data.friendships.find(
    (friendship) => friendship.friendUserId === senderId,
  );

  if (acceptedForReceiver) {
    await receiver.request<ApiResponse<{ deleted: boolean }>>(`/friends/${acceptedForReceiver.id}`, {
      method: 'DELETE',
    });
  }

  const senderDetailed = await sender.request<ApiResponse<FriendsDetailedOk>>('/friends/detailed');
  assert(senderDetailed.ok === true, 'sender detailed friendships failed');
  const acceptedForSender = senderDetailed.data.friendships.find(
    (friendship) => friendship.friendUserId === receiverId,
  );

  if (acceptedForSender) {
    await sender.request<ApiResponse<{ deleted: boolean }>>(`/friends/${acceptedForSender.id}`, {
      method: 'DELETE',
    });
  }

  const senderSent = await sender.request<ApiResponse<PendingRequestsOk>>('/friends/requests/sent');
  assert(senderSent.ok === true, 'sender sent requests failed');
  const senderPending = senderSent.data.requests.find(
    (friendship) => friendship.friendUserId === receiverId,
  );

  if (senderPending) {
    await sender.request<ApiResponse<{ deleted: boolean }>>(`/friends/${senderPending.id}`, {
      method: 'DELETE',
    });
  }

  const receiverSent = await receiver.request<ApiResponse<PendingRequestsOk>>(
    '/friends/requests/sent',
  );
  assert(receiverSent.ok === true, 'receiver sent requests failed');
  const receiverPending = receiverSent.data.requests.find(
    (friendship) => friendship.friendUserId === senderId,
  );

  if (receiverPending) {
    await receiver.request<ApiResponse<{ deleted: boolean }>>(`/friends/${receiverPending.id}`, {
      method: 'DELETE',
    });
  }
}

async function main(): Promise<void> {
  const baseUrl = await chooseBaseUrl();

  console.log('friends:accept:dev starting');
  console.log({
    baseUrl,
    sender: SENDER_EMAIL,
    receiver: RECEIVER_EMAIL,
  });

  const sender = new Client(baseUrl);
  const receiver = new Client(baseUrl);

  const senderUser = await login(sender, SENDER_EMAIL);
  const receiverUser = await login(receiver, RECEIVER_EMAIL);

  await cleanupRelationship(sender, receiver, senderUser.id, receiverUser.id);

  const sendResponse = await sender.request<ApiResponse<SendFriendRequestOk>>('/friends/request', {
    method: 'POST',
    body: {
      targetUserId: receiverUser.id,
    },
  });

  assert(sendResponse.ok === true, 'failed to create pending friendship');
  assert(sendResponse.data.wasAutoAccepted === false, 'request unexpectedly auto-accepted');

  const pendingResponse = await receiver.request<ApiResponse<PendingRequestsOk>>(
    '/friends/requests/pending',
  );
  assert(pendingResponse.ok === true, 'receiver pending requests failed');

  const pending = pendingResponse.data.requests.find(
    (friendship) => friendship.friendUserId === senderUser.id,
  );
  assert(pending, 'pending request from sender not found');

  const acceptResponse = await receiver.request<ApiResponse<{ friendship: FriendshipRow }>>(
    '/friends/respond',
    {
      method: 'POST',
      body: {
        friendshipId: pending.id,
        action: 'accept',
      },
    },
  );

  assert(acceptResponse.ok === true, 'accept request failed');

  console.log('friends:accept:dev accepted seeded friendship', {
    senderId: senderUser.id,
    senderUsername: senderUser.username,
    receiverId: receiverUser.id,
    receiverUsername: receiverUser.username,
    friendshipId: pending.id,
  });
}

void main().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error('friends:accept:dev failed', error.message);
    if (error.cause) {
      console.error('cause:', error.cause);
    }
  } else {
    console.error('friends:accept:dev failed', String(error));
  }
  process.exitCode = 1;
});
