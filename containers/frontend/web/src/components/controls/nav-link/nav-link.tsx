'use client';

import type { ReactNode } from 'react';
import { Link as RacLink } from 'react-aria-components';
import type { LinkProps as RacLinkProps } from 'react-aria-components';

import { navLinkStyles } from './nav-link.styles';
import type {
  InteractiveControlSize,
  InteractiveControlW,
} from '@components/primitives/interactive-control/interactive-control.types';

export type NavLinkProps = Omit<RacLinkProps, 'className' | 'children' | 'href'> & {
  href: string;
  isCurrent?: boolean;
  children: ReactNode;
  size?: InteractiveControlSize;
  w?: InteractiveControlW;
  className?: string;
};

export function NavLink({
  href,
  isCurrent,
  children,
  size = 'md',
  w = 'auto',
  className,
  ...props
}: NavLinkProps) {
  return (
    <RacLink
      href={href}
      aria-current={isCurrent ? 'page' : undefined}
      className={navLinkStyles({ size, w, className })}
      {...props}
    >
      {children}
    </RacLink>
  );
}
