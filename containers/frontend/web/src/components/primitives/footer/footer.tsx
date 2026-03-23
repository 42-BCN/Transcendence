'use client';

import { Fragment } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  footerStyles,
  footerContainerStyles,
  footerLinksGroupStyles,
  footerLinkItemStyles,
  footerCopyrightStyles,
} from './footer.styles';

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
    <footer className={footerStyles(className)}>
      <div className={footerContainerStyles()}>
        <div className={footerLinksGroupStyles()}>
          {links.map((link) => (
            <Fragment key={link.key}>
              {link.href.startsWith('http') ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={footerLinkItemStyles()}
                >
                  {t(link.key)}
                </a>
              ) : (
                <Link href={link.href as any} className={footerLinkItemStyles()}>
                  {t(link.key)}
                </Link>
              )}
            </Fragment>
          ))}
        </div>

        <div className={footerCopyrightStyles()}>
          © {new Date().getFullYear()} {t('appName')}
        </div>
      </div>
    </footer>
  );
}
