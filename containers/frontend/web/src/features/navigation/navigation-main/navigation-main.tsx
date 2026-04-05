'use client';

import { type ReactNode } from 'react';
import { getPathname } from '@/i18n/navigation';
import { usePathname } from 'next/navigation';
import { NavLink } from '@components/controls/nav-link';
import { type NavItem } from '../navigation.config';
import { useTranslations } from 'next-intl';
import { Logout } from '../../auth/logout';
import { TooltipTrigger } from '@components/composites/tooltip-trigger';
import { Icon } from '@components/primitives/icon';
import { useNavigationContext } from '../navigation.context';
import { Stack } from '@components/primitives/stack';
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

  const link = (
    <NavLink href={href} isCurrent={isCurrent} aria-label={label} onPress={closeNavigation}>
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
  const { closeNavigation } = useNavigationContext();

  return (
    <Stack className="flex-1 list" gap="sm" align="start" role="list">
      {mainNavItems.map((item) => (
        <NavLinkItem key={item.href} navItem={item} />
      ))}
      {isAuthenticated ? <Logout onPress={closeNavigation} /> : null}
    </Stack>
  );
}
