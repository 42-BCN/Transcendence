import type { Request, Response } from 'express';

import type {
  PublicApiHealthResponse,
  PublicUsersCountResponse,
  PublicUsersSearchResponse,
} from '@contracts/public-api/public-api.contracts';
import type { SearchUsersQuery } from '@contracts/users/users.validation';
import { getRedisClient } from '@shared';

import { prisma } from '../lib/prisma';
import { countPublicUsers, searchPublicUsers } from '../users/users.service';

export async function getPublicApiHealthController(
  _req: Request,
  res: Response<PublicApiHealthResponse>,
): Promise<void> {
  await Promise.all([getRedisClient().ping(), prisma.$queryRaw`SELECT 1`]);

  res.status(200).json({
    ok: true,
    data: {
      database: 'up',
      redis: 'up',
    },
  });
}

export async function getPublicUsersCountController(
  _req: Request,
  res: Response<PublicUsersCountResponse>,
): Promise<void> {
  const totalUsers = await countPublicUsers();

  res.status(200).json({
    ok: true,
    data: {
      totalUsers,
    },
  });
}

export async function searchPublicUsersController(
  _req: Request,
  res: Response<PublicUsersSearchResponse, { query: SearchUsersQuery }>,
): Promise<void> {
  const { q, limit } = res.locals.query;
  const users = await searchPublicUsers(q, limit);

  res.status(200).json({
    ok: true,
    data: {
      users,
      meta: {
        q,
        limit,
        count: users.length,
      },
    },
  });
}
