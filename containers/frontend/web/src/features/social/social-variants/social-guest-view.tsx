'use client';

import { useTranslations } from 'next-intl';
import { Stack, Text, InternalLink, InlineLinkPrompt } from '@components';

export function SocialGuestView() {
  const t = useTranslations('features.social.guest');

  return (
    <Stack gap="md" className="h-full p-5 pt-11" align="center">
      <Text as="h1" variant="heading-md" className="font-bold">
        {t('title')}
      </Text>
      <Text color="secondary" variant="body-sm">
        {t('body')}
      </Text>
      <InternalLink href="/login" as="button" variant="cta" w="full">
        {t('login')}
      </InternalLink>
      <InlineLinkPrompt text={t('noAccount')} linkLabel={t('signup')} href="/create-account" />
    </Stack>
  );
}
