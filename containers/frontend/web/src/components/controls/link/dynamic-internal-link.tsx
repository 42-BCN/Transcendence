'use client';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { Link } from '@/i18n/navigation';
import type { InteractiveControlStyleProps } from '@components/primitives/interactive-control/interactive-control.types';
import { buttonStyles, iconStyles } from '../button/button.styles';
import { TooltipTrigger } from '../../composites/tooltip-trigger';
import { LinkStyles } from './link.styles';

type DynamicInternalLinkStyleProps = InteractiveControlStyleProps & {
  icon?: ReactNode;
  as?: 'link' | 'button' | 'icon';
  children?: ReactNode;
  label?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
};

type LinkBaseProps = Omit<ComponentPropsWithoutRef<typeof Link>, 'children' | 'className' | 'href'>;

function getLinkClassName({
  as,
  variant,
  size,
  w,
  className,
}: {
  as: 'link' | 'button' | 'icon';
  variant: InteractiveControlStyleProps['variant'];
  size: InteractiveControlStyleProps['size'];
  w: InteractiveControlStyleProps['w'];
  className?: string;
}) {
  if (as === 'button') return buttonStyles({ variant, size, w, className });
  if (as === 'icon') return buttonStyles({ variant, size: 'icon', w: 'auto', className });

  return LinkStyles(className);
}

export type DynamicInternalLinkProps = DynamicInternalLinkStyleProps &
  LinkBaseProps & {
    href: string;
  };

/**
 * Component for dynamic internal routes that don't fit the strict InternalLink typing.
 * Suitable for routes like /messages/{slug} or /other/{username}
 */
export function DynamicInternalLink(args: DynamicInternalLinkProps) {
  const {
    children,
    href,
    variant = 'secondary',
    size = 'md',
    w = 'full',
    className,
    as = 'link',
    icon,
    label,
    placement = 'top',
    offset,
    ...props
  } = args;

  const content = (
    <Link
      {...props}
      href={href}
      aria-label={label}
      className={getLinkClassName({ as, variant, size, w, className })}
    >
      {icon && <span className={as === 'icon' ? undefined : iconStyles()}>{icon}</span>}
      {as !== 'icon' && children}
    </Link>
  );

  if (as === 'icon' && label) {
    return (
      <TooltipTrigger label={label} placement={placement} offset={offset}>
        {content}
      </TooltipTrigger>
    );
  }

  return content;
}
