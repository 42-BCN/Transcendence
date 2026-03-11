'use client';

import { useState } from 'react';
import { getPathname } from '@/i18n/navigation';

import { usePathname } from 'next/navigation';
import { NavLink } from '@components/controls/nav-link';
import { type NavItem } from './navigation.config';
import { useTranslations } from 'next-intl';
import { Logout } from '../auth/logout';
import { Drawer } from '@components/composites/drawer';
import { Button, DialogTrigger } from 'react-aria-components';
import { LocaleSwitcher } from '../locale-switcher';

type TFunc = ReturnType<typeof useTranslations>;

function NavLinkItem(args: {
  locale: string;
  navItem: NavItem;
  pathname: string;
  t: TFunc;
  onPress: () => void;
}) {
  const { locale, navItem, pathname, t, onPress } = args;

  const href = getPathname({
    locale: locale,
    href: navItem.href,
  });
  const isCurrent = navItem.exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <NavLink href={href} isCurrent={isCurrent} onPress={onPress}>
      {t(navItem.key)}
    </NavLink>
  );
}

type NavigationClientProps = {
  locale: string;
  mainNavItems: NavItem[];
  isAuthenticated: boolean;
};

function NavigationContent(
  args: NavigationClientProps & { className?: string; onNavigate?: () => void },
) {
  const { locale, mainNavItems, isAuthenticated = false, className, onNavigate } = args;
  const pathname = usePathname();
  const t = useTranslations('navigation');
  return (
    <div className={className}>
      <LocaleSwitcher />
      {mainNavItems.map((item) => (
        <NavLinkItem
          key={item.href}
          locale={locale}
          navItem={item}
          pathname={pathname}
          t={t}
          onPress={() => {
            onNavigate?.();
          }}
        />
      ))}
      {isAuthenticated ? <Logout /> : null}
    </div>
  );
}

export function NavigationClient(args: NavigationClientProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav aria-label="Main" className="flex flex-col md:flex-row gap-4">
      <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
        <Button className="md:hidden">Menu</Button>
        <Drawer>
          <NavigationContent
            {...args}
            className="flex flex-col gap-2"
            onNavigate={() => setIsOpen(false)}
          />
          <Button className="mt-4" slot="close">
            Close
          </Button>
        </Drawer>
      </DialogTrigger>
      <NavigationContent {...args} className="hidden md:flex md:flex-row md:gap-2" />
    </nav>
  );
}
