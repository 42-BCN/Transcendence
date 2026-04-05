'use client';

import { Link as AriaLink } from 'react-aria-components';
import { Link } from '@/i18n/navigation';

import { buttonStyles, iconStyles } from '../button/button.styles';
import type {
  ButtonSize as Size,
  ButtonVariant as Variant,
  ButtonW as W,
} from '../button/button.styles';
import type { ComponentProps, ReactNode } from 'react';
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
  as?: 'link' | 'button';
};

// TODO links and buttons are quite similar may they should be merged into a single component with an "as" prop to determine the underlying element? Or maybe we can have a base component that both extend from? We can discuss this in the next meeting. For now, I'm just going to copy the button styles and add some link specific styles on top of it.
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
    as = 'button',
  } = args;

  const computedRel = target === '_blank' ? 'noopener noreferrer' : rel;

  return (
    <AriaLink
      href={href}
      target={target}
      rel={computedRel}
      className={as === 'button' ? buttonStyles({ variant, size, w }) : LinkStyles()}
    >
      {icon && <span className={iconStyles()}>{icon}</span>}
      {children}
    </AriaLink>
  );
}

export type InternalLinkProps = {
  children: ReactNode;
  href: ComponentProps<typeof Link>['href'];
};

export function InternalLink(args: InternalLinkProps) {
  const { children, href } = args;
  return (
    <Link className={LinkStyles()} href={href}>
      {children}
    </Link>
  );
}
