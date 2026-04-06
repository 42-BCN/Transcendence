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
  offset?: number;
};

export function TooltipTrigger(props: TooltipTriggerProps) {
  const { children, label, placement = 'right', offset } = props;
  return (
    <RACTooltipTrigger delay={0}>
      {children}
      <Tooltip placement={placement} offset={offset}>
        {label}
      </Tooltip>
    </RACTooltipTrigger>
  );
}

export type TooltipLinkProps = InternalLinkProps & {
  label: string;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  offset?: number;
};

export function TooltipLink(props: TooltipLinkProps) {
  const { label, placement = 'right', offset, ...linkProps } = props;

  return (
    <RACTooltipTrigger>
      <InternalLink {...linkProps} />
      <Tooltip placement={placement} offset={offset}>
        <Text variant="caption">{label}</Text>
      </Tooltip>
    </RACTooltipTrigger>
  );
}
