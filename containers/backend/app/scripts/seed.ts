import { prisma } from '../src/lib/prisma';
import { hashPassword } from '../src/auth/local/local.service';

import type { FriendshipStatus } from '../src/generated/prisma/enums';

const DEFAULT_PASSWORD = 'Password123!';
const LOCKOUT_TEST_EMAIL = 'lockout.test@fakemail.com';
const LOCKOUT_TEST_USERNAME = 'lockout_test_user';
const LOCKOUT_TEST_PASSWORD = 'LockoutTest123!';

const POKEMON_USERNAMES = [
  'pikachu',
  'bulbasaur',
  'squirtle',
  'charmander',
  'eevee',
  'snorlax',
  'mew',
  'mewtwo',
  'dragonite',
  'lapras',
  'gyarados',
  'vaporeon',
  'jolteon',
  'flareon',
  'ditto',
] as const;

type SeedUserRef = {
  id: string;
  username: string;
  email: string;
};

type UserMap = Map<string, SeedUserRef>;

type FriendshipSeed =
  | { type: 'accepted'; a: string; b: string }
  | { type: 'pending'; from: string; to: string };

const FRIENDSHIP_SEEDS: FriendshipSeed[] = [
  { type: 'accepted', a: 'pikachu', b: 'bulbasaur' },
  { type: 'accepted', a: 'pikachu', b: 'squirtle' },
  // Pikachu Sent (Total 4)
  { type: 'pending', from: 'pikachu', to: 'charmander' },
  { type: 'pending', from: 'pikachu', to: 'mew' },
  { type: 'pending', from: 'pikachu', to: 'mewtwo' },
  { type: 'pending', from: 'pikachu', to: 'dragonite' },
  // Pikachu Received (Total 5)
  { type: 'pending', from: 'eevee', to: 'pikachu' },
  { type: 'pending', from: 'lapras', to: 'pikachu' },
  { type: 'pending', from: 'gyarados', to: 'pikachu' },
  { type: 'pending', from: 'vaporeon', to: 'pikachu' },
  { type: 'pending', from: 'jolteon', to: 'pikachu' },
  // Others
  { type: 'pending', from: 'mew', to: 'mewtwo' },
  { type: 'accepted', a: 'dragonite', b: 'lapras' },
  // snorlax intentionally isolated
];

function sortPair(a: string, b: string): { userId1: string; userId2: string } {
  return a < b ? { userId1: a, userId2: b } : { userId1: b, userId2: a };
}

function requireUser(users: UserMap, username: string): SeedUserRef {
  const user = users.get(username);
  if (!user) {
    throw new Error(`Seed user not found: ${username}`);
  }
  return user;
}

function validateFriendshipSeed(seed: FriendshipSeed): void {
  if (seed.type === 'accepted' && seed.a === seed.b) {
    throw new Error(`Accepted friendship cannot be self: ${seed.a}`);
  }

  if (seed.type === 'pending' && seed.from === seed.to) {
    throw new Error(`Pending friendship cannot be self: ${seed.from}`);
  }
}

async function upsertLocalUser(args: {
  email: string;
  username: string;
  password: string;
}): Promise<SeedUserRef> {
  const { email, username, password } = args;
  const passwordHash = await hashPassword(password);

  return prisma.user.upsert({
    where: { email },
    update: {
      username,
      passwordHash,
      googleId: null,
      provider: 'local',
      emailVerifiedAt: new Date(),
      isBlocked: false,
      failedAttempts: 0,
      lockedUntil: null,
      lastLoginAt: null,
    },
    create: {
      email,
      username,
      passwordHash,
      googleId: null,
      provider: 'local',
      emailVerifiedAt: new Date(),
      isBlocked: false,
      failedAttempts: 0,
      lockedUntil: null,
      lastLoginAt: null,
    },
    select: {
      id: true,
      username: true,
      email: true,
    },
  });
}

async function insertSpecificUser(user: string): Promise<void> {
  await upsertLocalUser({
    email: `${user}@fakemail.com`,
    username: user,
    password: DEFAULT_PASSWORD,
  });
}

async function insertLockoutTestUser(): Promise<void> {
  await upsertLocalUser({
    email: LOCKOUT_TEST_EMAIL,
    username: LOCKOUT_TEST_USERNAME,
    password: LOCKOUT_TEST_PASSWORD,
  });
}

async function seedPokemonUsers(): Promise<UserMap> {
  const users = new Map<string, SeedUserRef>();

  for (const username of POKEMON_USERNAMES) {
    const user = await upsertLocalUser({
      email: `${username}@seed.local`,
      username,
      password: DEFAULT_PASSWORD,
    });

    users.set(username, user);
  }

  return users;
}

async function upsertFriendship(args: {
  aId: string;
  bId: string;
  senderId: string;
  status: FriendshipStatus;
}): Promise<void> {
  const { aId, bId, senderId, status } = args;

  if (aId === bId) {
    throw new Error('Cannot create friendship with the same user on both sides');
  }

  if (senderId !== aId && senderId !== bId) {
    throw new Error('senderId must belong to one of the friendship users');
  }

  const { userId1, userId2 } = sortPair(aId, bId);

  await prisma.friendship.upsert({
    where: {
      friendships_pair_uniq: { userId1, userId2 },
    },
    update: {
      senderId,
      status,
    },
    create: {
      userId1,
      userId2,
      senderId,
      status,
    },
  });
}

async function seedFriendships(users: UserMap): Promise<void> {
  for (const seed of FRIENDSHIP_SEEDS) {
    validateFriendshipSeed(seed);

    if (seed.type === 'accepted') {
      const a = requireUser(users, seed.a);
      const b = requireUser(users, seed.b);

      await upsertFriendship({
        aId: a.id,
        bId: b.id,
        senderId: a.id,
        status: 'accepted',
      });
    } else {
      const from = requireUser(users, seed.from);
      const to = requireUser(users, seed.to);

      await upsertFriendship({
        aId: from.id,
        bId: to.id,
        senderId: from.id,
        status: 'pending',
      });
    }
  }
}

export async function seed(): Promise<void> {
  console.log('Seeding Database');

  if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
    throw new Error('Seeding is only allowed in development or test environments.');
  }

  try {
    await insertSpecificUser('capapes');
    await insertSpecificUser('mfontser');
    await insertSpecificUser('joanavar');
    await insertSpecificUser('cmanica');
    await insertSpecificUser('tatahere');
    await insertLockoutTestUser();

    const pokemonUsers = await seedPokemonUsers();
    await seedFriendships(pokemonUsers);
  } finally {
    await prisma.$disconnect();
  }

  console.log({
    specificUsers: [
      'capapes@fakemail.com',
      'mfontser@fakemail.com',
      'joanavar@fakemail.com',
      'cmanica@fakemail.com',
      'tatahere@fakemail.com',
    ],
    lockoutUser: {
      email: LOCKOUT_TEST_EMAIL,
      username: LOCKOUT_TEST_USERNAME,
      password: LOCKOUT_TEST_PASSWORD,
    },
    pokemonUsers: POKEMON_USERNAMES.length,
    friendshipScenarios: FRIENDSHIP_SEEDS.length,
  });

  console.log('Seeded');
}

seed().catch((err) => {
  console.error('Database Seed failed: ', err);
  process.exitCode = 1;
});
