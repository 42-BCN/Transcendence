'use client';

import type { ReactNode } from 'react';
import { segmentedControlGroupStyles } from './segmented-control-group.styles';
import { TooltipTrigger } from '@components/composites/tooltip-trigger';
import {
  ToggleButtonGroup,
  ToggleButton,
  type ToggleButtonProps,
  type Key,
  type Selection,
  SelectionIndicator,
  composeRenderProps,
} from 'react-aria-components';

type SegmentedOption = {
  id: Key;
  label: ReactNode;
  ariaLabel?: string;
  isDisabled?: boolean;
  tooltipLabel?: string;
  tooltipPlacement?: 'left' | 'right' | 'top' | 'bottom';
};

export type SegmentedControlGroupProps = {
  'aria-label': string;
  options: readonly SegmentedOption[];
  defaultSelectedKey?: Key;
  selectedKey?: Key; // controlled
  onSelectionChange?: (key: Key) => void;
};

function SegmentedControlItem(props: ToggleButtonProps) {
  return (
    <ToggleButton {...props} className={segmentedControlGroupStyles.item()}>
      {composeRenderProps(props.children, (children) => (
        <>
          <SelectionIndicator className={segmentedControlGroupStyles.indicator()} data-selected />
          <span className={segmentedControlGroupStyles.label()}>{children}</span>
        </>
      ))}
    </ToggleButton>
  );
}

// eslint-disable-next-line max-lines-per-function
export function SegmentedControlGroup({
  options,
  defaultSelectedKey,
  selectedKey,
  onSelectionChange,
  ...aria
}: SegmentedControlGroupProps) {
  const selectionModeProps =
    selectedKey !== undefined
      ? ({
          selectedKeys: new Set([selectedKey]),
          onSelectionChange: (keys: Selection) => {
            const key = [...(keys as Set<Key>)][0];
            if (key !== null) onSelectionChange?.(key);
          },
        } as const)
      : ({
          defaultSelectedKeys: defaultSelectedKey ? new Set([defaultSelectedKey]) : undefined,
          onSelectionChange: (keys: Selection) => {
            const key = [...(keys as Set<Key>)][0];
            if (key !== null) onSelectionChange?.(key);
          },
        } as const);

  return (
    <ToggleButtonGroup
      {...aria}
      className={segmentedControlGroupStyles.group()}
      disallowEmptySelection
      {...selectionModeProps}
    >
      {options.map((opt) => {
        const item = (
          <SegmentedControlItem
            key={String(opt.id)}
            id={opt.id}
            isDisabled={opt.isDisabled}
            aria-label={opt.ariaLabel}
          >
            {opt.label}
          </SegmentedControlItem>
        );

        if (!opt.tooltipLabel) return item;

        return (
          <TooltipTrigger
            key={`tooltip-${String(opt.id)}`}
            label={opt.tooltipLabel}
            placement={opt.tooltipPlacement ?? 'top'}
          >
            {item}
          </TooltipTrigger>
        );
      })}
    </ToggleButtonGroup>
  );
}
