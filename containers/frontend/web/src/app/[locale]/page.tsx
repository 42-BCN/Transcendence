import { getTranslations } from 'next-intl/server';
import { SplitScreenGrid } from '@/components';
import { SocialDashboard } from '@/features/social/social-dashboard';

export default async function HomePage() {
  const t = await getTranslations('pages.home');

  return (
    <SplitScreenGrid
      full={
        <main className="p-20">
          <h1>{t('title')}</h1>
          <p>{t('subtitle')}</p>
        </main>
      }
      side={<SocialDashboard />}
    />
  );
}
