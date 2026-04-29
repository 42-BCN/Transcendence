import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';

import {
  getFriendsList,
  getPendingRequests,
  getSentRequests,
} from '@/features/social/actions/social.server.actions';
import { CurrentUserProvider } from '@/features/auth/me/current-user.provider';
import { glassBackgroundStyles, glassBorderStyles, SplitScreenGrid } from '@components';
import { cn } from '@/lib/styles/cn';
import { getCurrentUserIdOrNull } from '@/features/auth/me/get-current-user-id-or-null';
import { SocialGuestView } from '@/features/social/social-variants';
import { SocialStoreProvider } from '@/features/social/store/social-store.provider';

type SocialLayoutProps = {
  children: ReactNode;
};

export default async function SocialLayout({ children }: SocialLayoutProps) {
  const t = await getTranslations('pages.home');
  const userId = await getCurrentUserIdOrNull();

  let initialData: SocialInitialData | null = null;

  if (userId) {
    const [friendsResult, pendingReceivedResult, pendingSentResult] = await Promise.all([
      getFriendsList(),
      getPendingRequests(),
      getSentRequests(),
    ]);

    initialData = {
      friends: friendsResult.ok ? friendsResult.data.friends : [],
      pendingReceived: pendingReceivedResult.ok ? pendingReceivedResult.data.requests : [],
      pendingSent: pendingSentResult.ok ? pendingSentResult.data.requests : [],
      currentUserId: userId,
      errors: {
        friends: friendsResult.ok === false ? friendsResult.error.code : undefined,
        pendingReceived:
          pendingReceivedResult.ok === false ? pendingReceivedResult.error.code : undefined,
        pendingSent: pendingSentResult.ok === false ? pendingSentResult.error.code : undefined,
      },
    };
  }

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
          {userId && initialData ? (
            <CurrentUserProvider user={userId}>
              <SocialStoreProvider initialData={initialData}>{children}</SocialStoreProvider>
            </CurrentUserProvider>
          ) : (
            <SocialGuestView />
          )}
        </aside>
      }
    />
  );
}
