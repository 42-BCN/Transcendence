'use client';

import { useTranslations } from 'next-intl';
import { Stack } from '@components/primitives/stack';
import { ExternalLink, InternalLink } from '@components/controls/link/link';
import { Text } from '@components/primitives/text';

export const footerLinks = [
  { key: 'privacy', href: '/privacy', label: 'privacy' },
  { key: 'terms', href: '/terms', label: 'terms' },
  { key: 'github', href: 'https://github.com/42-BCN/Transcendence', label: 'github' },
] as const;

export function Footer() {
  const t = useTranslations('Footer');

  return (
    <Stack gap="sm" as="footer">
      {footerLinks.map(({ href, label }) =>
        href.startsWith('http') ? (
          <ExternalLink href={href} key={label} as="link">
            {t(label)}
          </ExternalLink>
        ) : (
          <InternalLink href={href} key={label}>
            {t(label)}
          </InternalLink>
        ),
      )}
      <Text variant="caption">
        © {new Date().getFullYear()} {t('appName')}
      </Text>
    </Stack>
  );
}
