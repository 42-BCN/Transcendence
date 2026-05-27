import { timingSafeEqual } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

import { sendError } from './errors.middleware';

export function readApiKey(req: Request): string | undefined {
  const apiKey = req.header('x-api-key');

  if (!apiKey) return undefined;

  const normalized = apiKey.trim();
  return normalized.length > 0 ? normalized : undefined;
}

function matchesApiKey(providedApiKey: string, expectedApiKey: string): boolean {
  if (providedApiKey.length !== expectedApiKey.length) return false;
  const providedBuffer = Buffer.from(providedApiKey);
  const expectedBuffer = Buffer.from(expectedApiKey);

  return timingSafeEqual(providedBuffer, expectedBuffer);
}

export function requireApiKey(req: Request, res: Response, next: NextFunction) {
  const expectedApiKey = process.env.PUBLIC_API_KEY;

  if (!expectedApiKey) {
    console.error('PUBLIC_API_KEY is not configured');
    return sendError(res, 'INTERNAL_ERROR');
  }

  const providedApiKey = readApiKey(req);

  if (!providedApiKey || !matchesApiKey(providedApiKey, expectedApiKey)) {
    return sendError(res, 'AUTH_UNAUTHORIZED');
  }

  next();
}
