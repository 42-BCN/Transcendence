import type { IconName } from '@components';

// features/navigation/navigation.config.ts
type NavHref = '/' | '/robots' | '/ui' | '/login' | '/me' | '/game';

export type NavItem = {
  href: NavHref;
  key: string;
  exact: boolean;
  icon: IconName;
};
const baseNavItems: NavItem[] = [
  { href: '/', key: 'home', exact: true, icon: 'home' },
  { href: '/game', key: 'game', exact: false, icon: 'gamepad' },
  { href: '/ui', key: 'ui', exact: false, icon: 'ui' },
];

const publicNavItems: NavItem[] = [{ href: '/login', key: 'login', exact: false, icon: 'logIn' }];

const privateNavItems: NavItem[] = [{ href: '/me', key: 'profile', exact: false, icon: 'user' }];

export function getMainNavItems(isAuthenticated: boolean): NavItem[] {
  return [...baseNavItems, ...(isAuthenticated ? privateNavItems : publicNavItems)];
}
