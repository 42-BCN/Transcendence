import { Login } from '@/features/auth/login';
import { getTranslations } from 'next-intl/server';

export default async function LoginPage() {
  const t = await getTranslations('auth');
  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-xl font-semibold">{t('login.title')}</h1>
      <Login />
    </main>
  );
}
