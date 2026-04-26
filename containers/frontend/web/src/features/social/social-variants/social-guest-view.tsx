'use client';

import { useTranslations } from 'next-intl';
import { Stack, Text, InternalLink, InlineLinkPrompt } from '@components';

export function SocialGuestView() {
  const t = useTranslations('features.social.guest');

  return (
    <Stack gap="md" className="w-full px-3 py-2" align="stretch">
      <Text color="secondary" variant="body-sm">
        {t('body')}
      </Text>

      <Stack gap="md" className="w-full" align="center">
        <InternalLink href="/login" as="button" variant="cta" w="full" className="justify-center">
          <span className="fancy-btn__label">{t('login')}</span>
        </InternalLink>

        <InlineLinkPrompt text={t('noAccount')} linkLabel={t('signup')} href="/create-account" />
      </Stack>
    </Stack>
  );
}
