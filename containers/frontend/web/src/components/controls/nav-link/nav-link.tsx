'use client';

import type { ReactNode } from 'react';
import { Link as RacLink } from 'react-aria-components';

import { navLinkStyles } from './nav-link.styles';

export type NavLinkProps = {
  href: string;
  isCurrent?: boolean;
  children: ReactNode;
  onPress?: () => void;
};

export function NavLink({ href, isCurrent, children, onPress }: NavLinkProps) {
  return (
    <RacLink
      href={href}
      aria-current={isCurrent ? 'page' : undefined}
      className={navLinkStyles()}
      onPress={onPress}
    >
      {children}
    </RacLink>
  );
}
