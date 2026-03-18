// app/providers.tsx

import type { ReactNode } from 'react';
import { ClientProviders } from './providers.client';

export function Providers({ locale, children }: { locale: string; children: ReactNode }) {
  return <ClientProviders locale={locale}>{children}</ClientProviders>;
}
