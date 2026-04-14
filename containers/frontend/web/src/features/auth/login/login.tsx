import { LoginForm } from './login.form';
import { Oauth } from '../oauth';
import { useTranslations } from 'next-intl';

import { FormTitle, Divider } from '@components';
import { InlineLinkPrompt } from '@components/composites/inline-link-prompt/inline-link-prompt';

export function LoginFeature() {
  const t = useTranslations('features.auth');
  return (
    <>
      <FormTitle title={t('login.title')} />

      <LoginForm />

      <Divider label={t('messages.or')} />

      <Oauth>{t('actions.continueWithGoogle')}</Oauth>

      <InlineLinkPrompt
        text={t('login.noAccount')}
        linkLabel={t('login.goToSignup')}
        href="/create-account"
      />
    </>
  );
}
