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

const internalFooterLinks = footerLinks.filter((link) => !link.href.startsWith('http'));
const externalFooterLinks = footerLinks.filter((link) => link.href.startsWith('http'));

export function Footer() {
  const t = useTranslations('components.footer');

  return (
    <Stack gap="sm" as="footer">
      {internalFooterLinks.map(({ href, label }) => (
        <InternalLink href={href} key={label}>
          {t(label)}
        </InternalLink>
      ))}
      {externalFooterLinks.map(({ href, label }) => (
        <ExternalLink href={href} key={label} as="link">
          {t(label)}
        </ExternalLink>
      ))}
      <Text variant="caption">
        © {new Date().getFullYear()} {t('appName')}
      </Text>
    </Stack>
  );
}
