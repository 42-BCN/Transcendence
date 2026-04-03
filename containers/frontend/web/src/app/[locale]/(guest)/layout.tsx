import type { ReactNode } from 'react';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { protectedMeAction } from '@/features/auth/me/protected.action';

export default async function GuestOnlyLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const sid = cookieStore.get('sid');
  const me = sid ? await protectedMeAction().catch(() => null) : null;
  if (me) redirect('/');

  return <>{children}</>;
}
