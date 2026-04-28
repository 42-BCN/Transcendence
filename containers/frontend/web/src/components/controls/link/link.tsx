'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Link as AriaLink } from 'react-aria-components';

import { Link } from '@/i18n/navigation';
import type { InteractiveControlStyleProps } from '@components/primitives/interactive-control/interactive-control.types';

import { buttonStyles, iconStyles } from '../button/button.styles';
import { LinkStyles } from './link.styles';

type LinkStyleProps = InteractiveControlStyleProps & {
  icon?: ReactNode;
  as?: 'link' | 'button';
  children?: ReactNode;
};

type AriaLinkBaseProps = Omit<ComponentPropsWithoutRef<typeof AriaLink>, 'children' | 'className'>;

export type ExternalLinkProps = LinkStyleProps & AriaLinkBaseProps;

export function ExternalLink(args: ExternalLinkProps) {
  const {
    variant = 'secondary',
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
      {...props}
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

type InternalLinkBaseProps = Omit<
  ComponentPropsWithoutRef<typeof Link>,
  'children' | 'className' | 'href'
>;

type InternalHref = ComponentPropsWithoutRef<typeof Link>['href'];

export type InternalLinkProps = LinkStyleProps &
  InternalLinkBaseProps & {
    href: InternalHref;
  };

export function InternalLink(args: InternalLinkProps) {
  const {
    children,
    href,
    variant = 'secondary',
    size = 'md',
    w = 'full',
    className,
    as = 'link',
    icon,
    ...props
  } = args;

  return (
    <Link
      {...props}
      href={href}
      className={
        as === 'button' ? buttonStyles({ variant, size, w, className }) : LinkStyles(className)
      }
    >
      {icon && <span className={iconStyles()}>{icon}</span>}
      {variant === 'cta' ? <span className="z-10">{children}</span> : children}
    </Link>
  );
}
