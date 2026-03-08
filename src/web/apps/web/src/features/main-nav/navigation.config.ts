// features/navigation/navigation.config.ts
type NavHref = '/' | '/robots' | '/ui' | '/signup' | '/login' | '/profile';

export type NavItem = {
  href: NavHref;
  key: string;
  exact: boolean;
};
const baseNavItems: NavItem[] = [
  { href: '/', key: 'home', exact: true },
  { href: '/robots', key: 'robots', exact: false },
  { href: '/ui', key: 'UI', exact: false },
];

const publicNavItems: NavItem[] = [
  { href: '/signup', key: 'createAccount', exact: false },
  { href: '/login', key: 'login', exact: false },
];

const privateNavItems: NavItem[] = [{ href: '/profile', key: 'profile', exact: false }];

export function getMainNavItems(isAuthenticated: boolean): NavItem[] {
  return [...baseNavItems, ...(isAuthenticated ? privateNavItems : publicNavItems)];
}
