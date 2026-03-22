'use client';

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
  ] as const;

  return (
    <footer className={footerStyles(className)}>
      <div className={footerContainerStyles()}>
        <div className={footerCopyrightStyles()}>
          © {new Date().getFullYear()} {t('appName')}. {t('copyright')}
        </div>

        <div className={footerLinksGroupStyles()}>
          {links.map((link) => (
            <Link key={link.key} href={link.href} className={footerLinkItemStyles()}>
              {t(link.key)}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
