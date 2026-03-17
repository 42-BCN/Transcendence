// app/providers.client.tsx
'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { I18nProvider, RouterProvider } from 'react-aria-components';

export function ClientProviders({ locale, children }: { locale: string; children: ReactNode }) {
  const router = useRouter();

  return (
    <I18nProvider locale={locale}>
      <RouterProvider navigate={router.push}>{children}</RouterProvider>
    </I18nProvider>
  );
}
