import { getTranslations } from 'next-intl/server';
import { AuthPageLayout } from '@components/primitives/auth-page-layout';
import { ResendVerification } from '@/features/auth/resend-verification';
import { InternalLink } from '@components/controls/link/link';

export default async function SignupSuccessPage() {
  const t = await getTranslations('auth');

  return (
    <AuthPageLayout title={t('createAccount.success.title')}>
      <div className="flex flex-col gap-4 text-center">
        <p className="text-slate-600">{t('createAccount.success.sent')}</p>
        <p className="text-slate-600">{t('createAccount.success.check')}</p>
        <p className="text-slate-600">{t('createAccount.success.checkSpam')}</p>

        <ResendVerification />

        <div className="mt-6 pt-6 border-t border-slate-100">
          <InternalLink href="/login">{t('createAccount.success.backToLogin')}</InternalLink>
        </div>
      </div>
    </AuthPageLayout>
  );
}
