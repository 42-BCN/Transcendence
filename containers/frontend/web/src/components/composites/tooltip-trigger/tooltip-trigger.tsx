'use client';

import type { ReactNode } from 'react';

import { TooltipTrigger as RACTooltipTrigger } from 'react-aria-components';
import { InternalLink, type InternalLinkProps } from '@components/controls/link/link';
import { Tooltip } from '@components/controls/tooltip';
import { Text } from '@components/primitives/text';

export type TooltipTriggerProps = {
  children: ReactNode;
  label: string;
  placement?: 'left' | 'right' | 'top' | 'bottom';
};

export function TooltipTrigger(props: TooltipTriggerProps) {
  const { children, label, placement = 'right' } = props;
  return (
    <RACTooltipTrigger delay={0}>
      {children}
      <Tooltip placement={placement}>{label}</Tooltip>
    </RACTooltipTrigger>
  );
}

export type TooltipLinkProps = InternalLinkProps & {
  label: string;
  placement?: 'left' | 'right' | 'top' | 'bottom';
};

export function TooltipLink(props: TooltipLinkProps) {
  const { label, placement = 'right', ...linkProps } = props;

  return (
    <RACTooltipTrigger>
      <InternalLink {...linkProps} />
      <Tooltip placement={placement}>
        <Text variant="caption">{label}</Text>
      </Tooltip>
    </RACTooltipTrigger>
  );
}
