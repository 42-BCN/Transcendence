'use client';

import { Link as AriaLink } from 'react-aria-components';
import Link from 'next/link';

import { buttonStyles, iconStyles } from '../button/button.styles';
import type {
  ButtonSize as Size,
  ButtonVariant as Variant,
  ButtonW as W,
} from '../button/button.styles';
import type { ReactNode } from 'react';
import { LinkStyles } from './link.styles';

export type LinkProps = {
  variant?: Variant;
  size?: Size;
  w?: W;
  icon?: ReactNode;
  href: string;
  children: ReactNode;
};

export function ExternalLink(args: LinkProps) {
  const { variant = 'primary', size = 'md', w = 'full', children, icon, href } = args;
  return (
    <AriaLink href={href} className={buttonStyles({ variant, size, w })}>
      {icon && <span className={iconStyles()}>{icon}</span>}
      {children}
    </AriaLink>
  );
}

export type InternalLinksProps = {
  children: ReactNode;
  href: string;
};

export function InternalLink(args: InternalLinksProps) {
  const { children, href } = args;
  return (
    <Link className={LinkStyles()} href={href}>
      {children}
    </Link>
  );
}
