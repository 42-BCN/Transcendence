import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import type { ReactNode } from 'react';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const hasSession = cookies().has('sid'); // your cookie name
  if (!hasSession) redirect('/login');

  return <>{children}</>;
}
