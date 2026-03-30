'use client';

import { useState, useMemo, useEffect } from 'react';
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
// import { LocaleSwitcher } from '../locale-switcher';

// TODO Translate aria-labels

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

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button className="md:hidden absolute inset-0 top-5 left-2 w-min h-min">Menu</Button>

      <Drawer>
        <Stack
          as="nav"
          aria-label="main"
          className="group py-4 z-10 h-screen overflow-y-auto w-full px-0 rounded-s-none rounded-e-md"
          align="start"
        >
          <NavigationHeader />
          <NavigationMain {...args} />
          <Settings />
        </Stack>
      </Drawer>
    </DialogTrigger>
  );
}

function DesktopNavigation(args: NavigationClientProps) {
  return (
    <div className="absolute inset-0 ">
      <Stack
        as="nav"
        aria-label="main"
        // TODO: This style here will be removed once the navigation is fully implemented. There's another issue for this component developing on parallel.
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
  );
}

export function NavigationClient(args: NavigationClientProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { locale } = args;

  const [isExpandedState, setIsExpanded] = useState(false);
  const isExpanded = isDesktop ? isExpandedState : true;
  const toggleExpanded = () => setIsExpanded((prev) => !prev);

  const value = useMemo(
    () => ({
      locale,
      isExpanded,
      toggleExpanded,
    }),
    [locale, isExpanded, toggleExpanded],
  );
  if (isDesktop === null) return null;

  return (
    <NavigationProvider value={value}>
      {isDesktop ? <DesktopNavigation {...args} /> : <MobileNavigation {...args} />}
    </NavigationProvider>
  );
}
