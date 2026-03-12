import { CreateAccountForm } from './create-account.form';
import { Oauth } from '../oauth';
import { useTranslations } from 'next-intl';

import { InternalLink } from '@components/controls/link/link';
import { Stack } from '@components/primitives/stack';
import { Text } from '@components/primitives/text';

export function CreateAccount() {
  const t = useTranslations('auth');
  return (
    <Stack justify="center">
      <Text as="h1" variant="heading-md">
        {t('createAccount.title')}
      </Text>
      <CreateAccountForm />
      <Text variant="caption">OR</Text>
      <Oauth>{t('createAccount.withGoogle')}</Oauth>
      <Stack direction="horizontal" justify="center" align="baseline" gap="sm">
        <Text as="span" variant="caption">
          {t('createAccount.haveAccount')}
        </Text>
        <InternalLink href={'/login'}>
          <Text as="span" variant="caption">
            {t('createAccount.goToLogin')}
          </Text>
        </InternalLink>
      </Stack>
    </Stack>
  );
}
