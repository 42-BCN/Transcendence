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

type FooterLink = (typeof footerLinks)[number];

function isExternalFooterLink(link: FooterLink): link is FooterLink & { href: `http${string}` } {
  return link.href.startsWith('http');
}

function isInternalFooterLink(
  link: FooterLink,
): link is Exclude<FooterLink, FooterLink & { href: `http${string}` }> {
  return !isExternalFooterLink(link);
}

const internalFooterLinks = footerLinks.filter(isInternalFooterLink);
const externalFooterLinks = footerLinks.filter(isExternalFooterLink);

export function Footer() {
  const t = useTranslations('components.footer');
  const year = new Date().getFullYear();
  const copyright = t('copyright', { year, appName: t('appName') }).replace('. ', '.\n');

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
      <Text variant="caption" className="whitespace-pre-line">
        {copyright}
      </Text>
    </Stack>
  );
}
