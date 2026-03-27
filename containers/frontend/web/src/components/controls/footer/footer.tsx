'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  footerLinksGroupStyles,
  footerLinkItemStyles,
  footerCopyrightStyles,
} from './footer.styles';
import { Stack } from '@components/primitives/stack';
import { ExternalLink } from '@components/controls/link/link';

export type FooterProps = {
  className?: string;
};

export function Footer({ className }: FooterProps) {
  const t = useTranslations('Footer');

  const links = [
    { key: 'privacy', href: '/privacy', label: t('privacy') },
    { key: 'terms', href: '/terms', label: t('terms') },
    { key: 'github', href: 'https://github.com/42-BCN/Transcendence', label: t('github') },
  ] as const;

  return (
    <footer>
      <Stack>
        <div className={footerLinksGroupStyles()}>
          {/* this should be an extenssion of link */}
          {links.map(({ href, label }) =>
            href.startsWith('http') ? (
              <ExternalLink href={href} key={label} as="link">
                {label}
              </ExternalLink>
            ) : (
              <Link href={href as any} key={label} className={footerLinkItemStyles()}>
                {label}
              </Link>
            ),
          )}
        </div>
        {/* // This should be an extension of text */}
        <p className={footerCopyrightStyles()}>
          © {new Date().getFullYear()} {t('appName')}
        </p>
      </Stack>
    </footer>
  );
}
