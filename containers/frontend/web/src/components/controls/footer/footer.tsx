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
import { Icon } from '@components/primitives/icon';

export type FooterProps = {
  className?: string;
};

export function Footer({ className }: FooterProps) {
  const t = useTranslations('Footer');

  const links = [
    { key: 'privacy', href: '/privacy' },
    { key: 'terms', href: '/terms' },
    { key: 'github', href: 'https://github.com/42-BCN/Transcendence' },
  ] as const;

  return (
    <footer>
      <Stack>
        <div className={footerLinksGroupStyles()}>
          {/* this should be an extenssion of link */}
          <Icon name="link" />
          {links.map((link) =>
            link.href.startsWith('http') ? (
              <ExternalLink href={link.href} key={link.key} variant="ghost">
                {t(link.key)}
              </ExternalLink>
            ) : (
              <Link href={link.href as any} key={link.key} className={footerLinkItemStyles()}>
                {t(link.key)}
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
