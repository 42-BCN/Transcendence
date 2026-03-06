import { CreateAccount } from '@/features/auth/create-account';
import { getTranslations } from 'next-intl/server';
import { AuthPageLayout } from '@components/primitives/auth-page-layout';

export default async function SignupPage() {
  const t = await getTranslations('auth');

  return (
    <AuthPageLayout title={t('signup.title')}>
      <CreateAccount />
    </AuthPageLayout>
  );
}
