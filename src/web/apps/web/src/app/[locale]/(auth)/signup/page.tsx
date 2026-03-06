import { CreateAccount } from '@/features/auth/create-account';
import { getTranslations } from 'next-intl/server';

export default async function SignupPage() {
  const t = await getTranslations('auth');

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-xl font-semibold">{t('createAccount.title')}</h1>
      <CreateAccount />
    </main>
  );
}
