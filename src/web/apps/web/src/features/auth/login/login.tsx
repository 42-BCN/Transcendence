import { LoginForm } from './login.form';
import { Oauth } from '../oauth';
import { useTranslations } from 'next-intl';

import { InternalLink } from '@components/controls/link/link';
import { Text } from '@components/primitives/text';
import { Stack } from '@components/primitives/stack';

export function Login() {
  const t = useTranslations('auth');
  return (
    <Stack>
      <Text as="h1" variant="heading-md">
        {t('login.title')}
      </Text>
      <LoginForm />
      <Stack direction="horizontal" align="center" gap="md">
        <div className="flex-1 border-t border-slate-300"></div>
        <Text variant="caption">{t('common.or')}</Text>
        <div className="flex-1 border-t border-slate-300"></div>
      </Stack>
      <Oauth>{t('login.withGoogle')}</Oauth>
      <Stack direction="horizontal" justify="center" align="baseline" gap="sm">
        <Text as="span" variant="caption">
          {t('login.noAccount')}
        </Text>{' '}
        <InternalLink href={'/signup'}>
          <Text as="span" variant="caption">
            {t('login.goToSignup')}
          </Text>
        </InternalLink>
      </Stack>
    </Stack>
  );
}
