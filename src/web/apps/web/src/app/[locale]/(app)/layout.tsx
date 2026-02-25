import type { ReactNode } from 'react';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const sid = cookieStore.get('sid')?.value;

  if (!sid) {
    redirect('/login');
  }

  return <>{children}</>;
}
