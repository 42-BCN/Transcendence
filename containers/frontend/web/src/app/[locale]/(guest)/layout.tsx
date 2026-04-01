import type { ReactNode } from 'react';

import { redirect } from 'next/navigation';
import { protectedMeAction } from '@/features/auth/me/protected.action';

export default async function GuestOnlyLayout({ children }: { children: ReactNode }) {
  const me = await protectedMeAction().catch(() => null);
  if (me) redirect('/');

  return <>{children}</>;
}
