'use client';

import { type ReactNode } from 'react';
import { getPathname } from '@/i18n/navigation';
import { usePathname } from 'next/navigation';
import { Icon, NavLink, Stack, TooltipTrigger } from '@components';
import { type NavItem } from '../navigation.config';
import { useTranslations } from 'next-intl';
import { Logout } from '../../auth/logout';
import { useNavigationContext } from '../navigation.context';
import { headerStyles } from '../navigation-header/navigation-header.styles';

type NavLinkItemProps = {
  navItem: NavItem;
};

function isNavItemCurrent(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

type RenderNavLinkContentProps = {
  icon: NavItem['icon'];
  label: string;
  isExpanded: boolean;
};

export function RenderNavLinkContent(args: RenderNavLinkContentProps) {
  const { icon, label, isExpanded } = args;

  return (
    <>
      <div className={headerStyles.wrapper}>
        <Icon name={icon} size={20} />
      </div>
      {isExpanded ? <span className="whitespace-nowrap pe-3">{label}</span> : null}
    </>
  );
}

function WithTooltip(content: ReactNode, label: string, enabled: boolean) {
  return enabled ? <TooltipTrigger label={label}>{content}</TooltipTrigger> : content;
}

function NavLinkItem(args: NavLinkItemProps) {
  const { navItem } = args;
  const { isExpanded, locale, closeNavigation } = useNavigationContext();

  const t = useTranslations('features.navigation');
  const label = t(navItem.key);

  const pathname = usePathname();
  const href = getPathname({ locale, href: navItem.href });
  const isCurrent = isNavItemCurrent(pathname, href, navItem.exact);
  const navLinkClassName = isExpanded ? 'w-full justify-start py-0 ps-2 pe-0' : 'size-6 p-0';

  const link = (
    <NavLink
      href={href}
      isCurrent={isCurrent}
      aria-label={label}
      onPress={closeNavigation}
      w={isExpanded ? 'full' : 'auto'}
      className={navLinkClassName}
    >
      <RenderNavLinkContent icon={navItem.icon} label={label} isExpanded={isExpanded} />
    </NavLink>
  );

  return WithTooltip(link, label, !isExpanded);
}

type NavigationMainProps = {
  mainNavItems: NavItem[];
  isAuthenticated: boolean;
};

export function NavigationMain(args: NavigationMainProps) {
  const { mainNavItems, isAuthenticated = false } = args;
  const { isExpanded, closeNavigation } = useNavigationContext();
  const t = useTranslations('features.navigation');

  return (
    <Stack className="flex-1 list w-full" gap="sm" align="stretch" role="list">
      {mainNavItems.map((item) => (
        <NavLinkItem key={item.href} navItem={item} />
      ))}
      {isAuthenticated
        ? WithTooltip(<Logout onPress={closeNavigation} />, t('logout'), !isExpanded)
        : null}
    </Stack>
  );
}
