// app/providers.tsx
'use client';

import type { ReactNode } from 'react';
import { SSRProvider } from 'react-aria-components';

export function Providers({ children }: { children: ReactNode }) {
  return <SSRProvider>{children}</SSRProvider>;
}
