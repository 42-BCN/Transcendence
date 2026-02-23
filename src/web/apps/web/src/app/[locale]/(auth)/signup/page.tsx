import { signupAction } from './actions';
import { SignupFeature } from '@/features/auth/signup-form';
import { getTranslations } from 'next-intl/server';

export default async function SignupPage() {
  const t = await getTranslations('auth');

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-xl font-semibold">{t('signup.title')}</h1>

      {/* ✅ Now it's actually used */}
      <SignupFeature action={signupAction} />
    </main>
  );
}
