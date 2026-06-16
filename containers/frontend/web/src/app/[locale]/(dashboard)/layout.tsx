import type { ReactNode } from 'react';

import { CurrentUserProvider } from '@/features/auth/me/current-user.provider';
import { glassBackgroundStyles, glassBorderStyles, SplitScreenGrid } from '@components';
import { cn } from '@/lib/styles/cn';
import { getCurrentUserIdOrNull } from '@/features/auth/me/get-current-user-id-or-null';
import { SocialGuestView } from '@/features/social/social-variants';
import { createNoIndexMetadata } from '@/lib/metadata/metadata.config';
import { GameRoomsPanel } from '@/features/rooms';

export const metadata = createNoIndexMetadata();

type SocialLayoutProps = {
  children: ReactNode;
};

export default async function SocialLayout({ children }: SocialLayoutProps) {
  const userId = await getCurrentUserIdOrNull();

  return (
    <SplitScreenGrid
      full={
        <section className="flex h-full flex-col md:p-20" aria-labelledby="game-rooms-heading">
          <h2 id="game-rooms-heading" className="sr-only">
            Game Rooms
          </h2>
          <GameRoomsPanel />
        </section>
      }
      mobileStackMode="split"
      side={
        <aside
          className={cn(
            glassBackgroundStyles({ intensity: 'medium', blur: 'sm' }),
            glassBorderStyles(),
            'h-full w-full overflow-hidden rounded-none pointer-events-auto md:rounded-s-md md:border-r-0',
          )}
        >
          {userId ? (
            <CurrentUserProvider user={userId}>{children}</CurrentUserProvider>
          ) : (
            <SocialGuestView />
          )}
        </aside>
      }
    />
  );
}
