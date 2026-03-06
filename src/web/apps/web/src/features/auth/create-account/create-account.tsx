import { CreateAccountForm } from './create-account.form';
import { Oauth } from '../oauth';
import { useTranslations } from 'next-intl';

import { InternalLink } from '@components/controls/link/link';

export function CreateAccount() {
  const t = useTranslations('auth');
  return (
    <>
      <CreateAccountForm />
      <Oauth children={t('createAccount.withGoogle')} />
      <div className="flex row gap-2 mt-3 justify-center">
        <p className="text-slate-600 text-sm">{t('createAccount.haveAccount')}</p>{' '}
        <InternalLink href={'/login'}>{t('createAccount.goToLogin')}</InternalLink>
      </div>
    </>
  );
}
