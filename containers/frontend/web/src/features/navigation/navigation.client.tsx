'use client';

import { useState, useMemo } from 'react';
import { type NavItem } from './navigation.config';
import { NavigationProvider } from './navigation.context';
import { NavigationHeader } from './navigation-header';
import { NavigationMain } from './navigation-main';
import { NavigationFooter } from './navigation-footer';
import { Stack } from '@components/primitives/stack';
import { glassCardStyles } from '@components/primitives/glass-card/glass-card.styles';

// TODO Translate aria-labels

type NavigationClientProps = {
  locale: string;
  mainNavItems: NavItem[];
  isAuthenticated: boolean;
};

export function NavigationClient(args: NavigationClientProps) {
  const { locale } = args;

  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpanded = () => setIsExpanded((prev) => !prev);

  const value = useMemo(
    () => ({
      locale,
      isExpanded,
      toggleExpanded,
    }),
    [locale, isExpanded, toggleExpanded],
  );
  return (
    <NavigationProvider value={value}>
      <div className="absolute inset-0 ">
        <Stack
          as="nav"
          aria-label="main"
          // TODO: This style here will be removed once the navigation is fully implemented. There's another issue for this component developing on parallel.
          className={glassCardStyles({
            intensity: 'medium',
            blur: 'xl',
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

// function MobileNavigation(args: NavigationClientProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   return (
//     <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
//       <Button className="md:hidden">Menu</Button>
//       <Drawer>
//         <NavigationContent
//           {...args}
//           className="flex flex-col gap-2"
//           onNavigate={() => setIsOpen(false)}
//         />
//         <Button className="mt-4" slot="close">
//           Close
//         </Button>
//       </Drawer>
//     </DialogTrigger>
//   );
// }

// function NavigationContent(
//   args: NavigationClientProps & { className?: string; onNavigate?: () => void },
// ) {
//   const { locale, mainNavItems, isAuthenticated = false, className, onNavigate } = args;
//   const pathname = usePathname();
//   const t = useTranslations('navigation');
//   return (
//     <div className={className}>
//       <LocaleSwitcher />

//       {mainNavItems.map((item) => (
//         <NavLinkItem
//           key={item.href}
//           locale={locale}
//           navItem={item}
//           pathname={pathname}
//           t={t}
//           onPress={() => {
//             onNavigate?.();
//           }}
//         />
//       ))}
//       {isAuthenticated ? <Logout /> : null}
//     </div>
//   );
// }

// import { Drawer } from '@components/composites/drawer';
// import { Button, DialogTrigger } from 'react-aria-components';
// import { LocaleSwitcher } from '../locale-switcher';
