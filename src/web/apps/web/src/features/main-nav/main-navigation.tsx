'use client';

import { usePathname } from 'next/navigation';
import { NavLink } from '@components/controls/nav-link';
import { mainNavItems } from './navigation.config';
import { useTranslations } from 'next-intl';

type NavItem = (typeof mainNavItems)[number];
type TFunc = ReturnType<typeof useTranslations>;

function NavLinkItem(args: { locale: string; navItem: NavItem; pathname: string; t: TFunc }) {
  const { locale, navItem, pathname, t } = args;
  const href = `/${locale}${navItem.href}`;
  const isCurrent = navItem.exact
    ? pathname === href
    : pathname === href || pathname.startsWith(href + '/');

  return (
    <NavLink href={href} isCurrent={isCurrent}>
      {t(navItem.key)}
    </NavLink>
  );
}

export function MainNav({ locale }: { locale: string }) {
  const pathname = usePathname();
  const t = useTranslations('navigation');

  return (
    <nav aria-label="Main">
      <div className="flex gap-2">
        {mainNavItems.map((item) => (
          <NavLinkItem key={item.href} locale={locale} navItem={item} pathname={pathname} t={t} />
        ))}
      </div>
    </nav>
  );
}
