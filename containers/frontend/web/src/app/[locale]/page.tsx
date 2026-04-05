import { getTranslations } from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('pages.home');

  return (
    <main className="p-8">
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
    </main>
  );
}
