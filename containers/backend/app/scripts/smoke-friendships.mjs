#!/usr/bin/env node
/* eslint-disable no-undef, no-console */
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
  const emailA = 'capapes@fakemail.com';
  const emailB = 'mfontser@fakemail.com';
  const password = 'Password123!';

  const a = new Client();
  const b = new Client();

  const loginA = await a.req('/auth/login', {
    method: 'POST',
    body: { identifier: emailA, password },
  });
  const loginB = await b.req('/auth/login', {
    method: 'POST',
    body: { identifier: emailB, password },
  });

  assert(loginA.ok === true && loginA.data?.user?.id, 'login A');
  assert(loginB.ok === true && loginB.data?.user?.id, 'login B');
  const idA = loginA.data.user.id;
  const idB = loginB.data.user.id;

  // Cleanup: remove accepted or pending A–B rows so the test is repeatable
  async function cleanupRelationship() {
    const listA = await a.req('/friendships');
    const accA = listA.data.friendships?.find((f) => f.friendUserId === idB);
    if (accA) await a.req(`/friends/${accA.id}`, { method: 'DELETE' });
    const listB = await b.req('/friendships');
    const accB = listB.data.friendships?.find((f) => f.friendUserId === idA);
    if (accB) await b.req(`/friends/${accB.id}`, { method: 'DELETE' });
    const sentB = await b.req('/friendships/requests/sent');
    const pendB = sentB.data.requests?.find((r) => r.friendUserId === idA);
    if (pendB) await b.req(`/friends/${pendB.id}`, { method: 'DELETE' });
    const sentA = await a.req('/friendships/requests/sent');
    const pendA = sentA.data.requests?.find((r) => r.friendUserId === idB);
    if (pendA) await a.req(`/friends/${pendA.id}`, { method: 'DELETE' });
  }
  await cleanupRelationship();

  const sendRes = await b.req('/friendships/request', {
    method: 'POST',
    body: { targetUserId: idA },
    okStatuses: [200, 201],
  });
  assert(sendRes.ok === true, 'send request');
  const friendshipId = sendRes.data.friendship?.id;
  assert(friendshipId, 'friendship id from send');

  const received = await a.req('/friendships/requests/pending');
  assert(received.ok === true, 'received list');
  const pending = received.data.requests.find((r) => r.id === friendshipId);
  assert(pending, 'pending request visible to A');

  const acceptRes = await a.req('/friendships/respond', {
    method: 'POST',
    body: { friendshipId, action: 'accept' },
  });
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
  assert('friendAvatar' in row, 'FriendshipPublic uses friendAvatar');

  const delRes = await a.req(`/friends/${friendshipId}`, { method: 'DELETE' });
  assert(delRes.ok === true && delRes.data?.deleted === true, 'DELETE /friends/:friendshipId');

  const friendsAfter = await a.req('/friends');
  assert(
    !friendsAfter.data.friends.find((f) => f.id === idB),
    'GET /friends omits removed user',
  );

  await a.req(`/friends/${friendshipId}`, { method: 'DELETE', okStatuses: [404] });

  console.log('smoke-friendships: OK', { idA, idB, friendshipId });
}

main().catch((e) => {
  console.error('smoke-friendships: FAIL', e.message);
  process.exitCode = 1;
});
