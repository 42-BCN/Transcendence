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

type NavigationPosition = 'fixed' | 'absolute';

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

const navigationPositionClassNames = {
  fixed: {
    desktop: 'fixed h-screen',
    mobileTrigger: 'fixed',
    mobileDrawer: 'h-[100dvh]',
  },
  absolute: {
    desktop: 'absolute h-full',
    mobileTrigger: 'absolute',
    mobileDrawer: 'h-full',
  },
} as const;

function getMobileNavigationValue(locale: string, closeNavigation: () => void) {
  return {
    locale,
    isExpanded: true,
    toggleExpanded: () => {},
    closeNavigation,
  };
}

function getMobileNavigationClassName(position: NavigationPosition) {
  return `group z-10 flex ${navigationPositionClassNames[position].mobileDrawer} w-full overflow-y-auto overscroll-contain rounded-s-none rounded-e-md px-2 py-4`;
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

  const value = useMemo(
    () => getMobileNavigationValue(args.locale, closeNavigation),
    [args.locale, closeNavigation],
  );

  return (
    <NavigationProvider value={value}>
      <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
        <IconButton
          label={t('menu')}
          className={`${args.forceVisibleTrigger ? '' : 'md:hidden'} ${
            navigationPositionClassNames[position].mobileTrigger
          } pointer-events-auto left-[24px] top-5 z-[30]`}
          icon={isOpen ? 'close' : 'menu'}
          placement="right"
        />

        <Drawer>
          <Stack
            as="nav"
            aria-label={t('mainAriaLabel')}
            className={getMobileNavigationClassName(position)}
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
          className: `group top-0 z-10 overflow-y-auto rounded-s-none rounded-e-md px-2 py-4 ${
            navigationPositionClassNames[position].desktop
          } ${isExpanded ? 'w-44' : 'w-min'}`,
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
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (mode === 'desktop') return <DesktopNavigation {...args} position={position} />;
  if (mode === 'mobile') return <MobileNavigation {...args} position={position} />;

  if (isDesktop === null) return null;

  return isDesktop ? (
    <DesktopNavigation {...args} position={position} />
  ) : (
    <MobileNavigation {...args} position={position} />
  );
}
