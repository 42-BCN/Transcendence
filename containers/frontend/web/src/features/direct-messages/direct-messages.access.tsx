'use client';

import { InternalLink, Stack, Text } from '@components';
import { useTranslations } from 'next-intl';

import { directMessagesStyles } from './direct-messages.styles';

type DirectMessagesAccessProps = {
  title: string;
  body: string;
};

export function DirectMessagesAccess({ title, body }: DirectMessagesAccessProps) {
  const t = useTranslations('features.directMessages');

  return (
    <Stack gap="md" className={directMessagesStyles.access.wrapper} align="center" justify="center">
      <Text as="h1" variant="heading-md" className={directMessagesStyles.access.title}>
        {title}
      </Text>
      <Text color="secondary" variant="body-sm">
        {body}
      </Text>
      <InternalLink href="/" as="button" variant="cta" w="auto">
        {t('backToHome')}
      </InternalLink>
    </Stack>
  );
}
