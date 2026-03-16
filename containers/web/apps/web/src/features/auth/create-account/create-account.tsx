import { CreateAccountForm } from './create-account.form';
import { Oauth } from '../oauth';
import { useTranslations } from 'next-intl';

import { InternalLink } from '@components/controls/link/link';
import { Stack } from '@components/primitives/stack';
import { Text } from '@components/primitives/text';

export function CreateAccount() {
  const t = useTranslations('auth');
  return (
    <Stack>
      <Text as="h1" variant="heading-md">
        {t('createAccount.title')}
      </Text>
      <CreateAccountForm />
      <div className="flex items-center gap-4 before:h-px before:flex-1 before:bg-slate-300 after:h-px after:flex-1 after:bg-slate-300">
        <Text variant="caption">{t('common.or')}</Text>
      </div>
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
