import { LoginFeature } from '@/features/auth/login-form';
import { AuthPageLayout } from '@components/primitives/auth-page-layout';
import { getTranslations } from 'next-intl/server';

export default async function LoginPage() {
  const t = await getTranslations('auth');
  return (
    <AuthPageLayout title={t('login.title')}>
      <LoginFeature />
    </AuthPageLayout>
  );
}
