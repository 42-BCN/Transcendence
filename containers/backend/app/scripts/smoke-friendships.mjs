#!/usr/bin/env node
/**
 * Smoke test: signup x2 → login → friend request → accept → GET /friends & /friendships.
 * Run inside backend container: BASE_URL=http://127.0.0.1:4000 node scripts/smoke-friendships.mjs
 */

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:4000';

class Client {
  /** @type {string} */
  #cookie = '';

  /**
   * @param {string} path
   * @param {{ method?: string, body?: unknown, okStatuses?: number[] }} [opts]
   */
  async req(path, opts = {}) {
    const { method = 'GET', body, okStatuses } = opts;
    const headers = {};
    if (this.#cookie) headers.cookie = this.#cookie;
    if (body !== undefined) headers['content-type'] = 'application/json';

    const res = await fetch(BASE + path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const setCookies =
      typeof res.headers.getSetCookie === 'function'
        ? res.headers.getSetCookie()
        : res.headers.get('set-cookie')
          ? [res.headers.get('set-cookie')]
          : [];
    if (setCookies.length > 0) {
      this.#cookie = setCookies.map((c) => c.split(';')[0]).join('; ');
    }

    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = { _raw: text };
    }

    const allowed = okStatuses ?? [200, 201];
    if (!allowed.includes(res.status)) {
      throw new Error(`${method} ${path} -> ${res.status}: ${text}`);
    }
    return json;
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function main() {
  const stamp = Date.now();
  const emailA = `smoke_a_${stamp}@example.com`;
  const emailB = `smoke_b_${stamp}@example.com`;
  const password = 'SmokeTestPass1!';

  const a = new Client();
  const b = new Client();

  const signupA = await a.req('/auth/signup', {
    method: 'POST',
    body: { email: emailA, password },
  });
  const signupB = await b.req('/auth/signup', {
    method: 'POST',
    body: { email: emailB, password },
  });

  assert(signupA.ok === true && signupA.data?.user?.id, 'signup A');
  assert(signupB.ok === true && signupB.data?.user?.id, 'signup B');
  const idA = signupA.data.user.id;
  const idB = signupB.data.user.id;

  await a.req('/auth/login', {
    method: 'POST',
    body: { identifier: emailA, password },
  });
  await b.req('/auth/login', {
    method: 'POST',
    body: { identifier: emailB, password },
  });

  const sendRes = await b.req('/friendships/request', {
    method: 'POST',
    body: { targetUserId: idA },
    okStatuses: [200, 201],
  });
  assert(sendRes.ok === true, 'send request');
  const friendshipId = sendRes.data.friendship?.id;
  assert(friendshipId, 'friendship id from send');

  const received = await a.req('/friendships/requests/received');
  assert(received.ok === true, 'received list');
  const pending = received.data.requests.find((r) => r.id === friendshipId);
  assert(pending, 'pending request visible to A');

  const acceptRes = await a.req(
    `/friendships/requests/${friendshipId}/accept`,
    { method: 'PATCH' },
  );
  assert(acceptRes.ok === true, 'accept');

  const friends = await a.req('/friends');
  assert(friends.ok === true, 'GET /friends');
  const friendRow = friends.data.friends.find((f) => f.id === idB);
  assert(friendRow, 'B in A friends list');
  assert(typeof friendRow.isOnline === 'boolean', 'isOnline present');

  const list = await a.req('/friendships');
  assert(list.ok === true, 'GET /friendships');
  const row = list.data.friendships.find((f) => f.friendUserId === idB);
  assert(row, 'B in friendships list');
  assert('createdAt' in row, 'FriendshipPublic uses createdAt');

  console.log('smoke-friendships: OK', { idA, idB, friendshipId });
}

main().catch((e) => {
  console.error('smoke-friendships: FAIL', e.message);
  process.exitCode = 1;
});
