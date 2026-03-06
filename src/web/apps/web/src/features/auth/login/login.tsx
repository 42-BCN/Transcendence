import { LoginForm } from './login.form';
import { Oauth } from '../oauth';
import { useTranslations } from 'next-intl';

import { InternalLink } from '@components/controls/link/link';

export function Login() {
  const t = useTranslations('auth');
  return (
    <>
      <LoginForm />
      <Oauth children={t('login.withGoogle')} />
      <div className="flex row gap-2 mt-3 justify-center">
        <p className="text-slate-600 text-sm">{t('login.noAccount')}</p>{' '}
        <InternalLink href={'/signup'}>{t('login.goToSignup')}</InternalLink>
      </div>
    </>
  );
}
