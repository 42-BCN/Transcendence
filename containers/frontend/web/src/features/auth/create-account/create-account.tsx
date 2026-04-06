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
      <div className="flex items-center gap-4 before:h-px before:flex-1 before:bg-border-primary after:h-px after:flex-1 after:bg-border-primary">
        <Text variant="caption">{t('messages.or')}</Text>
      </div>
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
