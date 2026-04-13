import { glassCardStyles, Stack } from '@components';
import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex justify-end w-full pe-11 items-center">
      <Stack className={glassCardStyles({ className: 'min-h-[600px] max-w-[420px]' })}>
        {children}
      </Stack>
    </main>
  );
}
