import { SignupFeature } from '@/features/auth/signup-form';
import { getTranslations } from 'next-intl/server';
import { AuthPageLayout } from '@components/primitives/auth-page-layout';

export default async function SignupPage() {
  const t = await getTranslations('auth');

  return (
    <AuthPageLayout title={t('signup.title')}>
      <SignupFeature/>
    </AuthPageLayout>
  );
}
