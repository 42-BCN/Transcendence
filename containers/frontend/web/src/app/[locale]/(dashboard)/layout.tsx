import type { ReactNode } from 'react';
import { SplitScreenGrid } from '@components';
import { getTranslations } from 'next-intl/server';

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
        <aside className="h-full w-full bg-bg-primary/50 backdrop-blur-sm border-l border-border-primary overflow-hidden">
          {children}
        </aside>
      }
    />
  );
}
