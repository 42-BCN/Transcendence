'use server';

import { cookies } from 'next/headers';

import type { VerifyEmailRes } from '@/contracts/api/auth/auth.contract';
import { fetchServer, withServerAction } from '@/lib/http/fetcher.server';
import { VerifyEmailReqSchema } from '@/contracts/api/auth/auth.validation';
import { getValidationErrorResult } from '@/lib/http/errors';
import { forwardAuthCookies } from '@/lib/http/auth-cookies.server';

export const verifyEmailAction = withServerAction(
  async (token: string): Promise<VerifyEmailRes> => {
    const parsedToken = VerifyEmailReqSchema.safeParse({ token });

    if (!parsedToken.success) return getValidationErrorResult(parsedToken.error);

    const { data, headers } = await fetchServer<VerifyEmailRes>('/auth/verify-email', 'POST', {
      token: parsedToken.data.token,
    });

    if (data.ok) await forwardAuthCookies(headers);

    return data;
  },
);
