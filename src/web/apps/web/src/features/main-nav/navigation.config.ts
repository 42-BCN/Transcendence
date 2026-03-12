import { IconName } from '@components/primitives/icon/icons';

// features/navigation/navigation.config.ts
type NavHref = '/' | '/robots' | '/ui' | '/signup' | '/login' | '/profile';

export type NavItem = {
  href: NavHref;
  key: string;
  exact: boolean;
  icon: IconName;
};
const baseNavItems: NavItem[] = [
  { href: '/', key: 'home', exact: true, icon: 'home' },
  { href: '/robots', key: 'robots', exact: false, icon: 'gamepad' },
  { href: '/ui', key: 'UI', exact: false, icon: 'ui' },
];

const publicNavItems: NavItem[] = [
  { href: '/signup', key: 'createAccount', exact: false, icon: 'logIn' },
  { href: '/login', key: 'login', exact: false, icon: 'logIn' },
];

const privateNavItems: NavItem[] = [
  { href: '/profile', key: 'profile', exact: false, icon: 'user' },
];

export function getMainNavItems(isAuthenticated: boolean): NavItem[] {
  return [...baseNavItems, ...(isAuthenticated ? privateNavItems : publicNavItems)];
}
