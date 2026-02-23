// features/navigation/navigation.config.ts

export const mainNavItems = [
  { href: '/', key: 'home', exact: true },
  { href: '/robots', key: 'robots', exact: false },
  { href: '/ui', key: 'UI', exact: false },
  { href: '/signup', key: 'signup', exact: false },
  { href: '/login', key: 'login', exact: false },
] as const;
