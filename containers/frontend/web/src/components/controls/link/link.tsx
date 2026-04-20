'use client';

import { Link as AriaLink } from 'react-aria-components';
import { Link } from '@/i18n/navigation';

import { buttonStyles, iconStyles } from '../button/button.styles';
import type { ComponentProps, ComponentPropsWithoutRef, ReactNode } from 'react';
import { LinkStyles } from './link.styles';
import type { InteractiveControlStyleProps } from '@components/primitives/interactive-control/interactive-control.types';

export type ExternalLinkProps = InteractiveControlStyleProps & {
  icon?: ReactNode;
  as?: 'link' | 'button';
} & ComponentPropsWithoutRef<typeof AriaLink>;

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
    ...props
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
      {...props}
    >
      {icon && <span className={iconStyles()}>{icon}</span>}
      {children}
    </AriaLink>
  );
}

export type InternalLinkProps = InteractiveControlStyleProps & {
  as?: 'link' | 'button';
  icon?: ReactNode;
} & ComponentPropsWithoutRef<typeof AriaLink>;

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
    ...props
  } = args;

  return (
    <AriaLink
      as={Link}
      href={href}
      className={
        as === 'button' ? buttonStyles({ variant, size, w, className }) : LinkStyles(className)
      }
      {...props}
    >
      {icon && <span className={iconStyles()}>{icon}</span>}
      {children}
    </AriaLink>
  );
}
