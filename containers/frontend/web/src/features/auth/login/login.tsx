import { LoginForm } from './login.form';
import { Oauth } from '../oauth';
import { useTranslations } from 'next-intl';

import { InternalLink } from '@components/controls/link/link';
import { Text } from '@components/primitives/text';
import { Stack } from '@components/primitives/stack';

export function Login() {
  const t = useTranslations('features.auth');
  return (
    <Stack>
      <Text as="h1" variant="heading-md">
        {t('login.title')}
      </Text>
      <LoginForm />
      <div className="flex items-center gap-4 before:h-px before:flex-1 before:bg-border-primary after:h-px after:flex-1 after:bg-border-primary">
        <Text variant="caption">{t('messages.or')}</Text>
      </div>
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
