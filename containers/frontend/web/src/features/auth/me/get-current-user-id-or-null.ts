import { cache } from 'react';
import { cookies } from 'next/headers';

import { protectedMeAction } from './protected.action';

export const getCurrentUserIdOrNull = cache(async () => {
  const cookieStore = await cookies();
  const sid = cookieStore.get('sid')?.value;

  if (!sid) {
    return null;
  }

  const result = await protectedMeAction().catch(() => null);

  if (!result?.ok) {
    return null;
  }

  return result.data.userId;
});
