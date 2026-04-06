'use client';

import { Link as AriaLink } from 'react-aria-components';
import { Link } from '@/i18n/navigation';

import { buttonStyles, iconStyles } from '../button/button.styles';
import type { ComponentProps, ReactNode } from 'react';
import { LinkStyles } from './link.styles';
import type { InteractiveControlStyleProps } from '@components/primitives/interactive-control/interactive-control.types';

export type ExternalLinkProps = InteractiveControlStyleProps & {
  icon?: ReactNode;
  href: string;
  children: ReactNode;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  as?: 'link' | 'button';
};

export function ExternalLink(args: ExternalLinkProps) {
  const {
    variant = 'primary',
    size = 'md',
    w = 'full',
    className,
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
      className={
        as === 'button' ? buttonStyles({ variant, size, w, className }) : LinkStyles(className)
      }
    >
      {icon && <span className={iconStyles()}>{icon}</span>}
      {children}
    </AriaLink>
  );
}

export type InternalLinkProps = InteractiveControlStyleProps & {
  children: ReactNode;
  href: ComponentProps<typeof Link>['href'];
  as?: 'link' | 'button';
  icon?: ReactNode;
};

export function InternalLink(args: InternalLinkProps) {
  const {
    children,
    href,
    variant = 'primary',
    size = 'md',
    w = 'full',
    className,
    as = 'link',
    icon,
  } = args;

  return (
    <Link
      className={
        as === 'button' ? buttonStyles({ variant, size, w, className }) : LinkStyles(className)
      }
      href={href}
    >
      {icon && <span className={iconStyles()}>{icon}</span>}
      {children}
    </Link>
  );
}
