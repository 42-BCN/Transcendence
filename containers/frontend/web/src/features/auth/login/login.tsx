import { LoginForm } from './login.form';
import { Oauth } from '../oauth';
import { useTranslations } from 'next-intl';

import { InternalLink, Stack, Text } from '@components';

export function Login() {
  const t = useTranslations('features.auth');
  return (
    <Stack>
      <Text as="h1" variant="heading-md">
        {t('login.title')}
      </Text>
      <LoginForm />
      <Text variant="divider">{t('messages.or')}</Text>
      <Oauth>{t('actions.continueWithGoogle')}</Oauth>
      <Stack direction="horizontal" justify="center" align="baseline" gap="sm">
        <Text as="span" variant="caption">
          {t('login.noAccount')}
        </Text>
        <InternalLink href={'/create-account'}>{t('login.goToSignup')}</InternalLink>
      </Stack>
    </Stack>
  );
}
