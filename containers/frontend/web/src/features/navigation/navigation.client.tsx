'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { type NavItem } from './navigation.config';
import { NavigationProvider } from './navigation.context';
import { NavigationHeader } from './navigation-header';
import { NavigationMain } from './navigation-main';
import { NavigationFooter } from './navigation-footer';
import { Button as UiButton, Drawer, Stack, glassCardStyles } from '@components';
import { DialogTrigger } from 'react-aria-components';
import { Settings } from '../settings';
import { useTranslations } from 'next-intl';

type NavigationClientProps = {
  locale: string;
  mainNavItems: NavItem[];
  isAuthenticated: boolean;
};

function getMobileNavigationValue(locale: string, closeNavigation: () => void) {
  return {
    locale,
    isExpanded: true,
    toggleExpanded: () => {},
    closeNavigation,
  };
}

const mobileNavigationClassName = glassCardStyles({
  intensity: 'medium',
  blur: 'sm',
  className:
    'group z-10 flex max-h-[100dvh] w-full overflow-y-auto overscroll-contain px-2 py-4 rounded-s-none rounded-e-md',
});

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const media = window.matchMedia(query);

    const listener = () => setMatches(media.matches);
    listener();

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

function MobileNavigation(args: NavigationClientProps) {
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
        <UiButton variant="ghost" w="auto" className="md:hidden absolute top-5 left-2 z-20">
          {t('menu')}
        </UiButton>
        <Drawer>
          <Stack
            as="nav"
            aria-label={t('mainAriaLabel')}
            className={mobileNavigationClassName}
            align="start"
          >
            <NavigationHeader />
            <NavigationMain {...args} />
            <Settings />
          </Stack>
        </Drawer>
      </DialogTrigger>
    </NavigationProvider>
  );
}

function DesktopNavigation(args: NavigationClientProps) {
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
          className: `group py-4 z-10 fixed h-screen overflow-y-auto ${isExpanded ? 'w-44' : 'w-min'} px-2 top-0 rounded-s-none rounded-e-md`,
        })}
        align="start"
      >
        <NavigationHeader />
        <NavigationMain {...args} />
        <NavigationFooter />
      </Stack>
    </NavigationProvider>
  );
}

export function NavigationClient(args: NavigationClientProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop === null) return null;

  return isDesktop ? <DesktopNavigation {...args} /> : <MobileNavigation {...args} />;
}
