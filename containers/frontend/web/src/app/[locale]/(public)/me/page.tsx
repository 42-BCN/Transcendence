import { ProtectedButton } from '@/features/auth/me/protected-button';
import { getTranslations } from 'next-intl/server';

export default async function MePage() {
  const t = await getTranslations('me');
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">{t('title')}</h1>
      <ProtectedButton />
      <p className="text-sm opacity-70">{t('subtitle')}</p>
    </main>
  );
}
