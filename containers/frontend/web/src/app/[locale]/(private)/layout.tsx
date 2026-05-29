import type { ReactNode } from 'react';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { protectedMeAction } from '@/features/auth/me/protected.action';
import { createNoIndexMetadata } from '@/lib/metadata/metadata.config';

export const metadata = createNoIndexMetadata();

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const sid = cookieStore.get('sid')?.value;

  if (!sid) redirect('/login');

  const me = await protectedMeAction();
  if (!me.ok) redirect('/login');

  return <>{children}</>;
}
