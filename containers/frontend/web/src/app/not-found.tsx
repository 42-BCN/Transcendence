import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('pages.notFound');

  return (
    <main className="m-6">
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </main>
  );
}
