import { getTranslations } from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('home');

  return (
    <main className="p-5">
      <h1>{t('title')}</h1>
      <p>{t('subtitle')}</p>
    </main>
  );
}
