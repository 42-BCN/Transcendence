// app/providers.client.tsx
'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { I18nProvider, RouterProvider } from 'react-aria-components';
import { ThemeProvider } from '@/providers/theme-provider';
import { RealtimeSessionBridge } from '@/lib/sockets/realtime-session-bridge';

export function ClientProviders({ locale, children }: { locale: string; children: ReactNode }) {
  const router = useRouter();

  return (
    <ThemeProvider>
      <RealtimeSessionBridge />
      <I18nProvider locale={locale}>
        <RouterProvider navigate={router.push}>{children}</RouterProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
