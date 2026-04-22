import type { ReactNode } from 'react';
import { glassCardStyles, SplitScreenGrid } from '@components';
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
        <aside
          className={glassCardStyles({
            intensity: 'medium',
            blur: 'sm',
            className: 'h-full w-full overflow-hidden rounded-l-md rounded-r-none border-r-0 p-0',
          })}
        >
          {children}
        </aside>
      }
    />
  );
}
