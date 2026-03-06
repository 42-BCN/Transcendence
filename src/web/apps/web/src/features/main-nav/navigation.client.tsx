'use client';

import { getPathname } from '@/i18n/navigation';

import { usePathname } from 'next/navigation';
import { NavLink } from '@components/controls/nav-link';
import { type NavItem } from './navigation.config';
import { useTranslations } from 'next-intl';
import { Logout } from '../auth/logout';

type TFunc = ReturnType<typeof useTranslations>;

function NavLinkItem(args: { locale: string; navItem: NavItem; pathname: string; t: TFunc }) {
  const { locale, navItem, pathname, t } = args;

  const href = getPathname({
    locale: locale,
    href: navItem.href,
  });
  const isCurrent = navItem.exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <NavLink href={href} isCurrent={isCurrent}>
      {t(navItem.key)}
    </NavLink>
  );
}

type NavigationClientProps = {
  locale: string;
  mainNavItems: NavItem[];
  isAuthenticated: boolean;
};

export function NavigationClient(args: NavigationClientProps) {
  const { locale, mainNavItems, isAuthenticated = false } = args;
  const pathname = usePathname();
  const t = useTranslations('navigation');
  return (
    <nav aria-label="Main">
      <div className="flex gap-2">
        {mainNavItems.map((item) => (
          <NavLinkItem key={item.href} locale={locale} navItem={item} pathname={pathname} t={t} />
        ))}
        {isAuthenticated ? <Logout /> : null}
      </div>
    </nav>
  );
}
