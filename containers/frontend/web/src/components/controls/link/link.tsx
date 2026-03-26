'use client';

import { Link as AriaLink } from 'react-aria-components';
import { Link } from '@/i18n/navigation';

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
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
};

export function ExternalLink(args: LinkProps) {
  const {
    variant = 'primary',
    size = 'md',
    w = 'full',
    children,
    icon,
    href,
    target = '_blank',
    rel,
  } = args;

  const computedRel = target === '_blank' ? (rel ?? 'noopener noreferrer') : rel;

  return (
    <AriaLink
      href={href}
      target={target}
      rel={computedRel}
      className={buttonStyles({ variant, size, w })}
    >
      {icon && <span className={iconStyles()}>{icon}</span>}
      {children}
    </AriaLink>
  );
}

export type InternalLinkProps = {
  children: ReactNode;
  href: string;
};

export function InternalLink(args: InternalLinkProps) {
  const { children, href } = args;
  return (
    <Link className={LinkStyles()} href={href}>
      {children}
    </Link>
  );
}
