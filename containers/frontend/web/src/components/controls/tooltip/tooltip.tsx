'use client';

import React from 'react';
import {
  Tooltip as AriaTooltip,
  type TooltipProps as AriaTooltipProps,
  OverlayArrow,
  composeRenderProps,
} from 'react-aria-components';
import { tooltipStyles } from './tooltip.styles';

export interface TooltipProps extends Omit<AriaTooltipProps, 'children'> {
  children: React.ReactNode;
}

export function Tooltip({ children, ...props }: TooltipProps) {
  return (
    <AriaTooltip
      {...props}
      offset={14}
      className={composeRenderProps(
        props.className,
        (className) => `${tooltipStyles.tooltip} ${className ?? ''}`,
      )}
    >
      <OverlayArrow>
        <svg width={8} height={8} viewBox="0 0 8 8" className={tooltipStyles.arrow}>
          <path d="M0 0 L4 4 L8 0" />
        </svg>
      </OverlayArrow>
      {children}
    </AriaTooltip>
  );
}
