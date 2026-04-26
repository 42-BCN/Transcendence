/* eslint-disable no-console */

import { BASE_URL, TEST_PASSWORD } from './smoke.config';
import { request } from './smoke.request';
import type { ApiResponse, TestResult } from './smoke.types';
import {
  assert,
  clearCookies,
  hasCookie,
  logResponse,
  logStep,
  printSummary,
  runTest,
} from './smoke.utils';

const FRIENDSHIP_TEST_EMAIL = process.env.FRIENDSHIP_TEST_EMAIL ?? 'pikachu@seed.local';
const FRIENDSHIP_TEST_PASSWORD = process.env.FRIENDSHIP_TEST_PASSWORD ?? TEST_PASSWORD;

type UserLookup = {
  id: string;
  username: string;
};

type FriendshipPublic = {
  id: string;
  userId: string;
  username: string;
  avatar: string | null;
  status: 'pending' | 'accepted';
  isSender: boolean;
  createdAt: string | Date;
};

type FriendPublic = {
  id: string;
  username: string;
  avatar: string | null;
  isOnline: boolean;
};

type GetFriendsListOk = {
  friends: FriendPublic[];
};

type GetPendingRequestsOk = {
  requests: FriendshipPublic[];
};

type GetSentRequestsOk = {
  requests: FriendshipPublic[];
};

type SendFriendRequestOk = {
  friendship: FriendshipPublic;
  wasAutoAccepted: boolean;
};

const results: TestResult[] = [];

async function loginAsSeedUser(): Promise<void> {
  logStep('login as seeded friends user');
  clearCookies();

  const login = await request<
    ApiResponse<{ user: { id: string; email: string; username: string } }>
  >('auth/login', {
    method: 'POST',
    body: JSON.stringify({
      identifier: FRIENDSHIP_TEST_EMAIL,
      password: FRIENDSHIP_TEST_PASSWORD,
    }),
  });

  assert(login.res.status === 200, 'Login should return 200');
  assert(login.body?.ok === true, 'Login should return ok=true');
  assert(hasCookie('sid'), 'Login should set sid cookie');
}

async function getUserByUsername(username: string): Promise<UserLookup> {
  const res = await request<ApiResponse<UserLookup>>(
    `users/username/${encodeURIComponent(username)}`,
    { method: 'GET' },
  );

  logResponse(res.res, res.body, res.text);

  assert(res.res.status === 200, `User ${username} should return 200`);
  assert(res.body?.ok === true, `User ${username} should return ok=true`);

  return res.body.data;
}

function friendUsernamesOf(items: FriendPublic[]): string[] {
  return items.map((item) => item.username).sort();
}

function requestUsernamesOf(items: FriendshipPublic[]): string[] {
  return items.map((item) => item.username).sort();
}

async function testListAcceptedFriends(): Promise<void> {
  await loginAsSeedUser();

  logStep('list accepted friends for pikachu');

  const res = await request<ApiResponse<GetFriendsListOk>>('friends', {
    method: 'GET',
  });

  logResponse(res.res, res.body, res.text);

  assert(res.res.status === 200, 'Friends list should return 200');
  assert(res.body?.ok === true, 'Friends list should return ok=true');

  const names = friendUsernamesOf(res.body.data.friends);

  assert(names.includes('bulbasaur'), 'Friends list should include bulbasaur');
  assert(names.includes('squirtle'), 'Friends list should include squirtle');
}

async function testListPendingSent(): Promise<void> {
  await loginAsSeedUser();

  logStep('list sent pending requests for pikachu');

  const res = await request<ApiResponse<GetSentRequestsOk>>('friends/requests/sent', {
    method: 'GET',
  });

  logResponse(res.res, res.body, res.text);

  assert(res.res.status === 200, 'Sent pending list should return 200');
  assert(res.body?.ok === true, 'Sent pending list should return ok=true');

  const names = requestUsernamesOf(res.body.data.requests);

  assert(names.includes('charmander'), 'Sent pending should include charmander');
}

async function testListPendingReceived(): Promise<void> {
  await loginAsSeedUser();

  logStep('list pending (received) requests for pikachu');

  const res = await request<ApiResponse<GetPendingRequestsOk>>('friends/requests/pending', {
    method: 'GET',
  });

  logResponse(res.res, res.body, res.text);

  assert(res.res.status === 200, 'Pending received list should return 200');
  assert(res.body?.ok === true, 'Pending received list should return ok=true');

  const names = requestUsernamesOf(res.body.data.requests);

  assert(names.includes('eevee'), 'Pending received should include eevee');
}

async function testSendRequestToIsolatedUser(): Promise<void> {
  await loginAsSeedUser();

  logStep('send request from pikachu to isolated snorlax');

  const snorlax = await getUserByUsername('snorlax');

  const send = await request<ApiResponse<SendFriendRequestOk>>('friends/request', {
    method: 'POST',
    body: JSON.stringify({
      targetUserId: snorlax.id,
    }),
  });

  logResponse(send.res, send.body, send.text);

  assert(
    send.res.status === 200 || send.res.status === 201,
    'Send friend request should return 200 or 201',
  );
  assert(send.body?.ok === true, 'Send friend request should return ok=true');
  assert(send.body.data.friendship.status === 'pending', 'New friend request should be pending');
  assert(send.body.data.wasAutoAccepted === false, 'New friend request should not auto-accept');
}

async function testDuplicateRequestRejected(): Promise<void> {
  await loginAsSeedUser();

  logStep('duplicate request from pikachu to charmander is rejected');

  const charmander = await getUserByUsername('charmander');

  const send = await request<ApiResponse<unknown>>('friends/request', {
    method: 'POST',
    body: JSON.stringify({
      targetUserId: charmander.id,
    }),
  });

  logResponse(send.res, send.body, send.text);

  assert(send.res.status === 409, 'Duplicate pending request should return 409');
  assert(send.body?.ok === false, 'Duplicate request should return ok=false');
}

async function testReverseRequestAutoAccept(): Promise<void> {
  await loginAsSeedUser();

  logStep('reverse request from pikachu to eevee auto-accepts');

  const eevee = await getUserByUsername('eevee');

  const send = await request<ApiResponse<SendFriendRequestOk>>('friends/request', {
    method: 'POST',
    body: JSON.stringify({
      targetUserId: eevee.id,
    }),
  });

  logResponse(send.res, send.body, send.text);

  assert(send.res.status === 200, 'Reverse request auto-accept should return 200');
  assert(send.body?.ok === true, 'Reverse request should return ok=true');
  assert(send.body.data.friendship.status === 'accepted', 'Reverse request should auto-accept');
  assert(
    send.body.data.wasAutoAccepted === true,
    'Reverse request should set wasAutoAccepted=true',
  );
}

async function testSelfRequestRejected(): Promise<void> {
  await loginAsSeedUser();

  logStep('self request is rejected');

  const me = await request<ApiResponse<{ userId: string }>>('protected/me', {
    method: 'GET',
  });

  logResponse(me.res, me.body, me.text);

  assert(me.res.status === 200, '/protected/me should return 200');
  assert(me.body?.ok === true, '/protected/me should return ok=true');

  const send = await request<ApiResponse<unknown>>('friends/request', {
    method: 'POST',
    body: JSON.stringify({
      targetUserId: me.body.data.userId,
    }),
  });

  logResponse(send.res, send.body, send.text);

  assert(send.res.status === 422, 'Self request should return 422');
  assert(send.body?.ok === false, 'Self request should return ok=false');
}

async function testMissingTargetRejected(): Promise<void> {
  await loginAsSeedUser();

  logStep('missing target user is rejected');

  const send = await request<ApiResponse<unknown>>('friends/request', {
    method: 'POST',
    body: JSON.stringify({
      targetUserId: '00000000-0000-0000-0000-000000000000',
    }),
  });

  logResponse(send.res, send.body, send.text);

  assert(send.res.status === 404, 'Missing target user should return 404');
  assert(send.body?.ok === false, 'Missing target user should return ok=false');
}

async function main(): Promise<void> {
  console.log('friends smoke suite starting');
  console.log('BASE_URL:', BASE_URL);
  console.log('FRIENDSHIP_TEST_EMAIL:', FRIENDSHIP_TEST_EMAIL);

  await runTest(results, 'accepted friends list', testListAcceptedFriends);
  await runTest(results, 'pending sent list', testListPendingSent);
  await runTest(results, 'pending list (received)', testListPendingReceived);
  await runTest(results, 'send request to isolated user', testSendRequestToIsolatedUser);
  await runTest(results, 'duplicate request rejected', testDuplicateRequestRejected);
  await runTest(results, 'reverse request auto-accept', testReverseRequestAutoAccept);
  await runTest(results, 'self request rejected', testSelfRequestRejected);
  await runTest(results, 'missing target rejected', testMissingTargetRejected);

  printSummary(results);

  const hasFailures = results.some((result) => !result.ok);
  if (hasFailures) process.exit(1);
}

main().catch((error) => {
  console.error('\nFriends smoke suite crashed');
  console.error(error);
  process.exit(1);
});
