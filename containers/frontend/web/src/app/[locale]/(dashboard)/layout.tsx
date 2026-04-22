import type { ReactNode } from 'react';
import { glassBackgroundStyles, glassBorderStyles, SplitScreenGrid } from '@components';
import { getTranslations } from 'next-intl/server';
import { cn } from '@/lib/styles/cn';

type SocialLayoutProps = {
  children: ReactNode;
};
export default async function SocialLayout({ children }: SocialLayoutProps) {
  const t = await getTranslations('pages.home');
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
            'h-full w-full overflow-hidden rounded-l-md rounded-r-none border-r-0',
          )}
        >
          {children}
        </aside>
      }
    />
  );
}
