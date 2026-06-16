'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { type NavItem } from './navigation.config';
import { NavigationProvider } from './navigation.context';
import { NavigationHeader } from './navigation-header';
import { NavigationMain } from './navigation-main';
import { NavigationFooter } from './navigation-footer';
import { Drawer, Stack, glassCardStyles, IconButton } from '@components';
import { DialogTrigger } from 'react-aria-components';
import { Settings } from '../settings';
import { useTranslations } from 'next-intl';
import { useMediaQuery } from '@/hooks/use-media-query';
import { dispatchMobileMenuCloseEvent, dispatchMobileMenuOpenEvent } from './mobile-menu.events';
import { navigationClientStyles } from './navigation.client.styles';

type NavigationClientProps = {
  locale: string;
  mainNavItems: NavItem[];
  isAuthenticated: boolean;
  mode?: 'auto' | 'desktop' | 'mobile';
  position?: 'fixed' | 'absolute';
  showFooter?: boolean;
  showSettings?: boolean;
  forceVisibleTrigger?: boolean;
};

function getMobileNavigationValue(locale: string, closeNavigation: () => void) {
  return {
    locale,
    isExpanded: true,
    toggleExpanded: () => {},
    closeNavigation,
  };
}
function MobileNavigation(args: NavigationClientProps) {
  const position = args.position ?? 'fixed';
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('features.navigation');
  const pathname = usePathname();

  const closeNavigation = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      dispatchMobileMenuOpenEvent();
    } else {
      dispatchMobileMenuCloseEvent();
    }
  }, [isOpen]);

  const value = useMemo(
    () => getMobileNavigationValue(args.locale, closeNavigation),
    [args.locale, closeNavigation],
  );

  return (
    <NavigationProvider value={value}>
      <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
        <IconButton
          label={t('menu')}
          className={navigationClientStyles.mobileTrigger(position, args.forceVisibleTrigger)}
          icon={isOpen ? 'close' : 'menu'}
          placement="right"
        />

        <Drawer isDismissable>
          <Stack
            as="nav"
            aria-label={t('mainAriaLabel')}
            className={navigationClientStyles.mobileDrawer(position)}
            align="start"
          >
            <NavigationHeader />
            <NavigationMain {...args} />
            {args.showSettings !== false && <Settings />}
          </Stack>
        </Drawer>
      </DialogTrigger>
    </NavigationProvider>
  );
}
function DesktopNavigation(args: NavigationClientProps) {
  const position = args.position ?? 'fixed';
  const t = useTranslations('features.navigation');
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const closeNavigation = useCallback(() => {
    setIsExpanded(false);
  }, []);

  const value = useMemo(
    () => ({
      locale: args.locale,
      isExpanded,
      toggleExpanded,
      closeNavigation,
    }),
    [args.locale, isExpanded, toggleExpanded, closeNavigation],
  );

  return (
    <NavigationProvider value={value}>
      <Stack
        as="nav"
        aria-label={t('mainAriaLabel')}
        className={glassCardStyles({
          intensity: 'medium',
          blur: 'sm',
          className: navigationClientStyles.desktop(position, isExpanded),
        })}
        align="start"
      >
        <NavigationHeader />
        <NavigationMain {...args} />
        {args.showFooter !== false && <NavigationFooter />}
      </Stack>
    </NavigationProvider>
  );
}

export function NavigationClient({
  mode = 'auto',
  position = 'fixed',
  ...args
}: NavigationClientProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  if (mode === 'desktop') return <DesktopNavigation {...args} position={position} />;
  if (mode === 'mobile') return <MobileNavigation {...args} position={position} />;

  if (isDesktop === null) return null;

  return isDesktop ? (
    <DesktopNavigation {...args} position={position} />
  ) : (
    <MobileNavigation {...args} position={position} />
  );
}
