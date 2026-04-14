import { CreateAccountForm } from './create-account.form';
import { Oauth } from '../../oauth';
import { useTranslations } from 'next-intl';

import { InlineLinkPrompt, FormTitle, Divider } from '@components';

export function CreateAccountFeature() {
  const t = useTranslations('features.auth');
  return (
    <>
      <FormTitle title={t('signup.title')} />

      <CreateAccountForm />

      <Divider label={t('messages.or')} />

      <Oauth>{t('actions.continueWithGoogle')}</Oauth>

      <InlineLinkPrompt
        text={t('signup.haveAccount')}
        linkLabel={t('signup.goToLogin')}
        href={'/login'}
      />
    </>
  );
}
