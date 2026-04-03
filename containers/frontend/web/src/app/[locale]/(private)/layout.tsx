import type { ReactNode } from 'react';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { protectedMeAction } from '@/features/auth/me/protected.action';

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const sid = cookieStore.get('sid')?.value;

  if (!sid) redirect('/login');

  const me = await protectedMeAction().catch(() => null);
  if (!me) redirect('/login');

  return <>{children}</>;
}
