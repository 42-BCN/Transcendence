import { glassCardStyles, Stack } from '@components';
import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex justify-center md:min-h-[100dvh] md:justify-end w-full md:pe-11 items-center">
      <Stack
        className={glassCardStyles({
          className:
            'md:min-h-[600px] w-full h-[100dvh] sm:w-auto sm:h-auto  sm:p-5 md:max-w-[420px] px-3 py-5 md:p-8',
        })}
      >
        {children}
      </Stack>
    </main>
  );
}
