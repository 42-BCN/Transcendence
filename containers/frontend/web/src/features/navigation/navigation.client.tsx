'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { type NavItem } from './navigation.config';
import { NavigationProvider } from './navigation.context';
import { NavigationHeader } from './navigation-header';
import { NavigationMain } from './navigation-main';
import { NavigationFooter } from './navigation-footer';
import { Stack } from '@components/primitives/stack';
import { glassCardStyles } from '@components/primitives/glass-card/glass-card.styles';
import { Drawer } from '@components/composites/drawer';
import { Button, DialogTrigger } from 'react-aria-components';
import { Settings } from '../settings';

type NavigationClientProps = {
  locale: string;
  mainNavItems: NavItem[];
  isAuthenticated: boolean;
};

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
  const pathname = usePathname();

  const closeNavigation = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const value = useMemo(
    () => ({
      locale: args.locale,
      isExpanded: true,
      toggleExpanded: () => {},
      closeNavigation,
    }),
    [args.locale, closeNavigation],
  );

  return (
    <NavigationProvider value={value}>
      <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
        <Button className="md:hidden absolute top-5 left-2 z-20 h-min w-min">Menu</Button>

        <Drawer>
          <Stack
            as="nav"
            aria-label="main"
            className="group z-10 flex max-h-[100dvh] w-full overflow-y-auto overscroll-contain px-0 py-4 rounded-s-none rounded-e-md"
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
      <div className="absolute inset-0">
        <Stack
          as="nav"
          aria-label="main"
          className={glassCardStyles({
            intensity: 'medium',
            blur: 'sm',
            className:
              'group py-4 z-10 h-screen overflow-y-auto w-min px-0 sticky top-0 rounded-s-none rounded-e-md',
          })}
          align="start"
        >
          <NavigationHeader />
          <NavigationMain {...args} />
          <NavigationFooter />
        </Stack>
      </div>
    </NavigationProvider>
  );
}

export function NavigationClient(args: NavigationClientProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop === null) return null;

  return isDesktop ? <DesktopNavigation {...args} /> : <MobileNavigation {...args} />;
}
