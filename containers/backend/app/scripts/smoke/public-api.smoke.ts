/* eslint-disable no-console */

import { BASE_URL } from './smoke.config';
import { request } from './smoke.request';
import type { ApiResponse, TestResult } from './smoke.types';
import { assert, logResponse, logStep, printSummary, runTest } from './smoke.utils';

const PUBLIC_API_KEY = process.env.PUBLIC_API_TEST_KEY ?? process.env.PUBLIC_API_KEY;
const SEEDED_USERNAME = process.env.PUBLIC_API_TEST_USERNAME ?? 'pikachu';
const SEARCH_QUERY = process.env.PUBLIC_API_TEST_QUERY ?? 'pika';

type UserPublic = {
  id: string;
  username: string;
  avatar: string | null;
  bio: string;
};

type PublicApiHealthOk = {
  database: 'up';
  redis: 'up';
};

type UsersListOk = {
  users: UserPublic[];
  meta: {
    limit: number;
    offset: number;
    count: number;
  };
};

type PublicUsersCountOk = {
  totalUsers: number;
};

type PublicUsersSearchOk = {
  users: UserPublic[];
  meta: {
    q: string;
    limit: number;
    count: number;
  };
};

const results: TestResult[] = [];

function requirePublicApiKey(): string {
  assert(
    Boolean(PUBLIC_API_KEY),
    'Set PUBLIC_API_KEY or PUBLIC_API_TEST_KEY before running the public API smoke test',
  );

  return PUBLIC_API_KEY!;
}

async function requestPublicApi<T>(
  path: string,
  init: RequestInit = {},
): Promise<{ res: Response; body: T | null; text: string }> {
  const headers = new Headers(init.headers);
  headers.set('x-api-key', requirePublicApiKey());

  return request<T>(`public-api/${path}`, {
    ...init,
    headers,
  });
}

async function requestPublicApiWithoutKey<T>(
  path: string,
  init: RequestInit = {},
): Promise<{ res: Response; body: T | null; text: string }> {
  const headers = new Headers(init.headers);
  headers.delete('x-api-key');

  return request<T>(`public-api/${path}`, {
    ...init,
    headers,
  });
}

async function testRejectsMissingApiKey(): Promise<void> {
  logStep('public API rejects requests without x-api-key');

  const res = await requestPublicApiWithoutKey<ApiResponse<unknown>>('health', {
    method: 'GET',
  });

  logResponse(res.res, res.body, res.text);

  assert(res.res.status === 401, 'Missing API key should return 401');
  assert(res.body?.ok === false, 'Missing API key should return ok=false');
  assert(
    res.body.error.code === 'AUTH_UNAUTHORIZED',
    'Missing API key should return AUTH_UNAUTHORIZED',
  );
}

async function testRejectsInvalidApiKey(): Promise<void> {
  logStep('public API rejects requests with an invalid x-api-key');

  const res = await request<ApiResponse<unknown>>('public-api/health', {
    method: 'GET',
    headers: {
      'x-api-key': 'definitely-invalid-public-api-key',
    },
  });

  logResponse(res.res, res.body, res.text);

  assert(res.res.status === 401, 'Invalid API key should return 401');
  assert(res.body?.ok === false, 'Invalid API key should return ok=false');
  assert(
    res.body.error.code === 'AUTH_UNAUTHORIZED',
    'Invalid API key should return AUTH_UNAUTHORIZED',
  );
}

async function testHealth(): Promise<void> {
  logStep('public API health succeeds');

  const res = await requestPublicApi<ApiResponse<PublicApiHealthOk>>('health', {
    method: 'GET',
  });

  logResponse(res.res, res.body, res.text);

  assert(res.res.status === 200, 'Public API health should return 200');
  assert(res.body?.ok === true, 'Public API health should return ok=true');
  assert(res.body.data.database === 'up', 'Public API health should report database=up');
  assert(res.body.data.redis === 'up', 'Public API health should report redis=up');
}

async function testListUsers(): Promise<void> {
  logStep('public API lists users');

  const res = await requestPublicApi<ApiResponse<UsersListOk>>('users?limit=5&offset=0', {
    method: 'GET',
  });

  logResponse(res.res, res.body, res.text);

  assert(res.res.status === 200, 'Public API users list should return 200');
  assert(res.body?.ok === true, 'Public API users list should return ok=true');
  assert(res.body.data.meta.limit === 5, 'Users list should echo limit=5');
  assert(res.body.data.meta.offset === 0, 'Users list should echo offset=0');
  assert(res.body.data.users.length > 0, 'Users list should return at least one user');
  assert(
    res.body.data.users.length <= 5,
    'Users list should not return more users than the requested limit',
  );
  assert(
    res.body.data.meta.count === res.body.data.users.length,
    'Users list meta.count should match the number of returned users',
  );
}

async function testCountUsers(): Promise<void> {
  logStep('public API returns user count');

  const res = await requestPublicApi<ApiResponse<PublicUsersCountOk>>('users/count', {
    method: 'GET',
  });

  logResponse(res.res, res.body, res.text);

  assert(res.res.status === 200, 'Public API users count should return 200');
  assert(res.body?.ok === true, 'Public API users count should return ok=true');
  assert(res.body.data.totalUsers > 0, 'Public API users count should be greater than zero');
}

async function testSearchUsers(): Promise<void> {
  logStep('public API searches users');

  const res = await requestPublicApi<ApiResponse<PublicUsersSearchOk>>(
    `users/search?q=${encodeURIComponent(SEARCH_QUERY)}&limit=5`,
    {
      method: 'GET',
    },
  );

  logResponse(res.res, res.body, res.text);

  assert(res.res.status === 200, 'Public API users search should return 200');
  assert(res.body?.ok === true, 'Public API users search should return ok=true');
  assert(res.body.data.meta.q === SEARCH_QUERY, 'Users search should echo the query string');
  assert(res.body.data.meta.limit === 5, 'Users search should echo limit=5');
  assert(
    res.body.data.users.some((user) => user.username === SEEDED_USERNAME),
    `Users search should include ${SEEDED_USERNAME}`,
  );
}

async function testGetUserByUsernameAndId(): Promise<void> {
  logStep('public API gets a user by username and id');

  const byUsername = await requestPublicApi<ApiResponse<UserPublic>>(
    `users/username/${encodeURIComponent(SEEDED_USERNAME)}`,
    {
      method: 'GET',
    },
  );

  logResponse(byUsername.res, byUsername.body, byUsername.text);

  assert(byUsername.res.status === 200, 'Public API user by username should return 200');
  assert(byUsername.body?.ok === true, 'Public API user by username should return ok=true');
  assert(
    byUsername.body.data.username === SEEDED_USERNAME,
    `Username lookup should return ${SEEDED_USERNAME}`,
  );

  const byId = await requestPublicApi<ApiResponse<UserPublic>>(
    `users/${encodeURIComponent(byUsername.body.data.id)}`,
    {
      method: 'GET',
    },
  );

  logResponse(byId.res, byId.body, byId.text);

  assert(byId.res.status === 200, 'Public API user by id should return 200');
  assert(byId.body?.ok === true, 'Public API user by id should return ok=true');
  assert(byId.body.data.id === byUsername.body.data.id, 'User id lookup should match username id');
  assert(
    byId.body.data.username === SEEDED_USERNAME,
    `User id lookup should resolve to ${SEEDED_USERNAME}`,
  );
}

async function main(): Promise<void> {
  console.log('public API smoke suite starting');
  console.log('BASE_URL:', BASE_URL);
  console.log('SEEDED_USERNAME:', SEEDED_USERNAME);
  console.log('SEARCH_QUERY:', SEARCH_QUERY);

  requirePublicApiKey();

  await runTest(results, 'rejects missing API key', testRejectsMissingApiKey);
  await runTest(results, 'rejects invalid API key', testRejectsInvalidApiKey);
  await runTest(results, 'health', testHealth);
  await runTest(results, 'users list', testListUsers);
  await runTest(results, 'users count', testCountUsers);
  await runTest(results, 'users search', testSearchUsers);
  await runTest(results, 'get user by username and id', testGetUserByUsernameAndId);

  printSummary(results);

  const hasFailures = results.some((result) => !result.ok);
  if (hasFailures) process.exit(1);
}

main().catch((error) => {
  console.error('\nPublic API smoke suite crashed');
  console.error(error);
  process.exit(1);
});
