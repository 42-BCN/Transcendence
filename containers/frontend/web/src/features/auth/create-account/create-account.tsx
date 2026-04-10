import { CreateAccountForm } from './create-account.form';
import { Oauth } from '../oauth';
import { useTranslations } from 'next-intl';

import { InternalLink, Stack, Text } from '@components';

export function CreateAccount() {
  const t = useTranslations('features.auth');
  return (
    <Stack>
      <Text as="h1" variant="heading-md">
        {t('signup.title')}
      </Text>
      <CreateAccountForm />
      <Text variant="divider">{t('messages.or')}</Text>
      <Oauth>{t('actions.continueWithGoogle')}</Oauth>
      <Stack direction="horizontal" justify="center" align="baseline" gap="sm">
        <Text as="span" variant="caption">
          {t('signup.haveAccount')}
        </Text>
        <InternalLink href={'/login'}>{t('signup.goToLogin')}</InternalLink>
      </Stack>
    </Stack>
  );
}
