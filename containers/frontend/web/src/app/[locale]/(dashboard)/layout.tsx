import type { ReactNode } from 'react';

import { CurrentUserProvider } from '@/features/auth/me/current-user.provider';
import { glassBackgroundStyles, glassBorderStyles, SplitScreenGrid } from '@components';
import { getTranslations } from 'next-intl/server';
import { cn } from '@/lib/styles/cn';
import { getCurrentUserIdOrNull } from '@/features/auth/me/get-current-user-id-or-null';
import { SocialGuestView } from '@/features/social/social-variants';

type SocialLayoutProps = {
  children: ReactNode;
};

export default async function SocialLayout({ children }: SocialLayoutProps) {
  const t = await getTranslations('pages.home');
  const userId = await getCurrentUserIdOrNull();

  return (
    <SplitScreenGrid
      full={
        <main className="p-20">
          <h1>{t('title')}</h1>
          <p>{t('subtitle')}</p>
        </main>
      }
      side={
        <aside
          className={cn(
            glassBackgroundStyles({ intensity: 'medium', blur: 'sm' }),
            glassBorderStyles(),
            'h-full w-full overflow-hidden rounded-s-md border-r-0',
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
