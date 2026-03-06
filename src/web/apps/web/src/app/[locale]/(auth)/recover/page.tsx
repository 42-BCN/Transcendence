import { RecoverFeature } from '@/features/auth/recover';
import { getTranslations } from 'next-intl/server';

export default async function RecoverPage() {
  const t = await getTranslations('auth');

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-xl font-semibold">{t('recover.title')}</h1>
      <RecoverFeature />
    </main>
  );
}
