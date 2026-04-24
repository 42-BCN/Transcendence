'use client';

import type { ButtonProps } from '@components/controls/button';
import { Button } from '@components/controls/button';

import { TooltipTrigger } from '@components/composites/tooltip-trigger';
import { Icon, type IconName } from '@components/primitives/icon';
import type { InteractiveControlVariant } from '@components/controls/types';

type IconButtonButtonProps = Pick<
  ButtonProps,
  'onPress' | 'isDisabled' | 'type' | 'id'
>;

export type IconButtonProps = {
  label: string;
  icon: IconName;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  variant?: InteractiveControlVariant;
} & IconButtonButtonProps;

export function IconButton(props: IconButtonProps) {
  const {
    label,
    placement = 'top',
    icon,
    className,
    variant = 'secondary',
    ...buttonProps
  } = props;

  return (
    <TooltipTrigger label={label} placement={placement}>
      <Button
        {...buttonProps}
        w="auto"
        size="icon"
        variant={variant}
        icon={<Icon name={icon} />}
        aria-label={label}
        className={className}
      />
    </TooltipTrigger>
  );
}